const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { characters } = require('./data/characters');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(express.static(path.join(__dirname, 'public')));

// ─── Game State ───
let gameState = {
  phase: 'lobby',        // lobby | voting | result | finished
  players: new Map(),     // socketId -> { name, joinedAt }
  bracket: [],            // full bracket of character pairs
  currentRound: 0,        // e.g. 16강=0, 8강=1, 4강=2, 결승=3
  currentMatchIndex: 0,
  currentMatch: null,     // { left, right }
  votes: new Map(),       // socketId -> { choice: 'left'|'right', time: ms }
  voteTimer: null,
  voteDeadline: null,
  results: [],            // history of each match result
  winners: [],            // winners of current round (advance to next)
  roundNames: [],
  finalRanking: [],
};

const VOTE_TIME_SECONDS = 10;
const MIN_PLAYERS = 1; // set to 1 for testing, raise for production

function resetGame() {
  clearTimeout(gameState.voteTimer);
  gameState = {
    phase: 'lobby',
    players: gameState.players,
    bracket: [],
    currentRound: 0,
    currentMatchIndex: 0,
    currentMatch: null,
    votes: new Map(),
    voteTimer: null,
    voteDeadline: null,
    results: [],
    winners: [],
    roundNames: [],
    finalRanking: [],
  };
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getRoundName(totalInRound) {
  if (totalInRound === 2) return '결승';
  if (totalInRound === 4) return '준결승 (4강)';
  return `${totalInRound}강`;
}

function buildBracket(chars) {
  const shuffled = shuffleArray(chars);
  const pairs = [];
  for (let i = 0; i < shuffled.length; i += 2) {
    pairs.push({ left: shuffled[i], right: shuffled[i + 1] });
  }
  return pairs;
}

function startGame() {
  const totalChars = characters.length;
  // pick power of 2 bracket size
  let bracketSize = 2;
  while (bracketSize * 2 <= totalChars) bracketSize *= 2;
  // if characters count isn't power of 2, select bracketSize characters
  const selected = shuffleArray(characters).slice(0, bracketSize);

  gameState.bracket = buildBracket(selected);
  gameState.currentRound = 0;
  gameState.currentMatchIndex = 0;
  gameState.winners = [];
  gameState.results = [];
  gameState.finalRanking = [];

  const roundName = getRoundName(bracketSize);
  gameState.roundNames = [roundName];
  gameState.phase = 'voting';

  startMatch();
}

function startMatch() {
  const match = gameState.bracket[gameState.currentMatchIndex];
  gameState.currentMatch = match;
  gameState.votes = new Map();

  const deadline = Date.now() + VOTE_TIME_SECONDS * 1000;
  gameState.voteDeadline = deadline;

  io.emit('match-start', {
    left: match.left,
    right: match.right,
    roundName: gameState.roundNames[gameState.currentRound],
    matchIndex: gameState.currentMatchIndex + 1,
    totalMatches: gameState.bracket.length,
    timeLimit: VOTE_TIME_SECONDS,
    deadline,
  });

  gameState.voteTimer = setTimeout(() => {
    endMatch();
  }, VOTE_TIME_SECONDS * 1000 + 500); // 0.5s buffer
}

function endMatch() {
  clearTimeout(gameState.voteTimer);
  const match = gameState.currentMatch;

  let leftVotes = 0;
  let rightVotes = 0;
  let leftTimeSum = 0;
  let rightTimeSum = 0;

  for (const [, vote] of gameState.votes) {
    if (vote.choice === 'left') {
      leftVotes++;
      leftTimeSum += vote.time;
    } else {
      rightVotes++;
      rightTimeSum += vote.time;
    }
  }

  let winner, loser, reason;

  if (leftVotes > rightVotes) {
    winner = match.left;
    loser = match.right;
    reason = 'majority';
  } else if (rightVotes > leftVotes) {
    winner = match.right;
    loser = match.left;
    reason = 'majority';
  } else {
    // tiebreaker: faster total selection time wins
    if (leftTimeSum <= rightTimeSum) {
      winner = match.left;
      loser = match.right;
    } else {
      winner = match.right;
      loser = match.left;
    }
    reason = 'tiebreaker';
    // edge case: no votes at all -> left wins by default
    if (leftVotes === 0 && rightVotes === 0) {
      winner = match.left;
      loser = match.right;
      reason = 'no-votes';
    }
  }

  const result = {
    left: match.left,
    right: match.right,
    leftVotes,
    rightVotes,
    leftTimeSum,
    rightTimeSum,
    winner,
    loser,
    reason,
    roundName: gameState.roundNames[gameState.currentRound],
  };

  gameState.results.push(result);
  gameState.winners.push(winner);

  // determine rank of loser based on current round
  // e.g. 16강 탈락 = rank 9~16, 8강 탈락 = rank 5~8, etc.

  io.emit('match-result', result);

  // next match or next round
  setTimeout(() => {
    gameState.currentMatchIndex++;

    if (gameState.currentMatchIndex < gameState.bracket.length) {
      startMatch();
    } else {
      // round complete
      if (gameState.winners.length === 1) {
        // tournament over
        gameState.phase = 'finished';
        gameState.finalRanking = buildFinalRanking();
        io.emit('game-finished', {
          ranking: gameState.finalRanking,
          allResults: gameState.results,
        });
      } else {
        // next round
        gameState.bracket = buildBracket(gameState.winners);
        gameState.currentRound++;
        gameState.currentMatchIndex = 0;
        gameState.winners = [];
        const roundName = getRoundName(gameState.bracket.length * 2);
        gameState.roundNames.push(roundName);
        startMatch();
      }
    }
  }, 3000); // 3s pause between matches
}

function buildFinalRanking() {
  // build ranking from results (reverse order: final winner = 1st)
  const ranking = [];
  const totalResults = [...gameState.results].reverse();

  // final winner
  if (totalResults.length > 0) {
    ranking.push({ rank: 1, character: totalResults[0].winner });
    ranking.push({ rank: 2, character: totalResults[0].loser });
  }

  // 3rd/4th from semifinals
  let rank = 3;
  const placed = new Set(ranking.map(r => r.character.id));
  for (const r of totalResults) {
    if (!placed.has(r.loser.id)) {
      ranking.push({ rank, character: r.loser });
      placed.add(r.loser.id);
      rank++;
    }
  }

  return ranking;
}

function broadcastLobby() {
  const playerList = [];
  for (const [id, p] of gameState.players) {
    playerList.push({ id, name: p.name });
  }
  io.emit('lobby-update', {
    players: playerList,
    phase: gameState.phase,
    canStart: playerList.length >= MIN_PLAYERS,
  });
}

// ─── Socket.IO ───
io.on('connection', (socket) => {
  console.log(`Connected: ${socket.id}`);

  socket.on('join', (name) => {
    const sanitized = String(name).trim().slice(0, 20) || '익명';
    gameState.players.set(socket.id, { name: sanitized, joinedAt: Date.now() });
    broadcastLobby();

    // if game is in progress, send current state
    if (gameState.phase === 'voting' && gameState.currentMatch) {
      socket.emit('match-start', {
        left: gameState.currentMatch.left,
        right: gameState.currentMatch.right,
        roundName: gameState.roundNames[gameState.currentRound],
        matchIndex: gameState.currentMatchIndex + 1,
        totalMatches: gameState.bracket.length,
        timeLimit: VOTE_TIME_SECONDS,
        deadline: gameState.voteDeadline,
      });
    }
  });

  socket.on('start-game', () => {
    if (gameState.phase !== 'lobby') return;
    if (gameState.players.size < MIN_PLAYERS) return;
    startGame();
  });

  socket.on('vote', ({ choice, time }) => {
    if (gameState.phase !== 'voting') return;
    if (choice !== 'left' && choice !== 'right') return;
    if (gameState.votes.has(socket.id)) return; // already voted

    const elapsed = typeof time === 'number' ? Math.max(0, time) : VOTE_TIME_SECONDS * 1000;
    gameState.votes.set(socket.id, { choice, time: elapsed });

    // broadcast vote count
    let leftCount = 0, rightCount = 0;
    for (const [, v] of gameState.votes) {
      if (v.choice === 'left') leftCount++;
      else rightCount++;
    }
    io.emit('vote-update', {
      leftCount,
      rightCount,
      totalPlayers: gameState.players.size,
      totalVoted: gameState.votes.size,
    });
  });

  socket.on('restart-game', () => {
    resetGame();
    broadcastLobby();
  });

  socket.on('disconnect', () => {
    gameState.players.delete(socket.id);
    console.log(`Disconnected: ${socket.id}`);
    if (gameState.phase === 'lobby') {
      broadcastLobby();
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🎮 카오스 제로 나이트메어 이상형 월드컵 서버 실행 중: http://localhost:${PORT}`);
});
