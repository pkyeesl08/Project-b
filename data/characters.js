// 카오스 제로 나이트메어 캐릭터 데이터
// 전투원 + 파트너 캐릭터

const characters = [
  // ─── 나이트메어호 (트라이온 중앙청) ───
  { id: 1,  name: '레노아',     color: '#e74c3c', desc: '나이트메어호 · 메인 히로인',         faction: '나이트메어호' },
  { id: 2,  name: '미카',       color: '#f48fb1', desc: '나이트메어호 · 힐러 전투원',         faction: '나이트메어호' },
  { id: 3,  name: '레이',       color: '#ab47bc', desc: '나이트메어호 · 4성 컨트롤러',        faction: '나이트메어호' },
  { id: 4,  name: '하루',       color: '#ff7043', desc: '나이트메어호 · 스트라이커',           faction: '나이트메어호' },
  { id: 5,  name: '오웬',       color: '#5c6bc0', desc: '나이트메어호 · 전투원',              faction: '나이트메어호' },
  { id: 6,  name: '유키',       color: '#29b6f6', desc: '나이트메어호 · 광역 딜러',           faction: '나이트메어호' },
  { id: 7,  name: '아델하이트', color: '#78909c', desc: '나이트메어호 · 전투원',              faction: '나이트메어호' },
  { id: 8,  name: '트리사',     color: '#66bb6a', desc: '나이트메어호 · 전투원',              faction: '나이트메어호' },
  { id: 9,  name: '아미르',     color: '#ffa726', desc: '나이트메어호 · 전투원',              faction: '나이트메어호' },
  { id: 10, name: '메이린',     color: '#ec407a', desc: '나이트메어호 · 스트라이커',           faction: '나이트메어호' },
  { id: 11, name: '레테',       color: '#7e57c2', desc: '나이트메어호 · 전투원',              faction: '나이트메어호' },
  { id: 12, name: '일레인',     color: '#26c6da', desc: '나이트메어호 · 전투원',              faction: '나이트메어호' },
  { id: 13, name: '아스나',     color: '#ef5350', desc: '나이트메어호 · 전투원',              faction: '나이트메어호' },
  { id: 14, name: '세레니엘',   color: '#42a5f5', desc: '나이트메어호 · T0 메타 전투원',      faction: '나이트메어호' },
  { id: 15, name: '니아',       color: '#ba68c8', desc: '나이트메어호 · 영감 서포터',         faction: '나이트메어호' },

  // ─── 아이언레인 ───
  { id: 16, name: '아니카',     color: '#8d6e63', desc: '아이언레인 · 전투원',               faction: '아이언레인' },
  { id: 17, name: '마리벨',     color: '#f06292', desc: '아이언레인 · 전투원',               faction: '아이언레인' },
  { id: 18, name: '루크',       color: '#5d4037', desc: '아이언레인 · 전투원',               faction: '아이언레인' },
  { id: 19, name: '베릴',       color: '#4db6ac', desc: '아이언레인 · 전투원',               faction: '아이언레인' },
  { id: 20, name: '루카스',     color: '#7cb342', desc: '아이언레인 · 전투원',               faction: '아이언레인' },

  // ─── 실레이마 ───
  { id: 21, name: '세리티아',   color: '#ce93d8', desc: '실레이마 · 전투원',                 faction: '실레이마' },
  { id: 22, name: '아이슐렌',   color: '#4fc3f7', desc: '실레이마 · 강력한 유닛',            faction: '실레이마' },
  { id: 23, name: '솔리아',     color: '#fff176', desc: '실레이마 · 전투원',                 faction: '실레이마' },
  { id: 24, name: '프리실라',   color: '#a1887f', desc: '실레이마 · 전투원',                 faction: '실레이마' },

  // ─── 펠티온 ───
  { id: 25, name: '카시우스',   color: '#546e7a', desc: '펠티온 · 전투원',                   faction: '펠티온' },
  { id: 26, name: '유피나',     color: '#ffab91', desc: '펠티온 · 전투원',                   faction: '펠티온' },
  { id: 27, name: '치즈루',     color: '#ff8a65', desc: '펠티온 · 1코스트 주력 전투원',       faction: '펠티온' },
  { id: 28, name: '나르쟈',     color: '#e040fb', desc: '펠티온 · T0 메타 전투원',            faction: '펠티온' },
  { id: 29, name: '일렉시아',   color: '#ffee58', desc: '펠티온 · 전투원',                   faction: '펠티온' },

  // ─── 스텔라 파밀리아 ───
  { id: 30, name: '베로니카',   color: '#d32f2f', desc: '스텔라 파밀리아 · T0 딜러',          faction: '스텔라 파밀리아' },
  { id: 31, name: '휴고',       color: '#1565c0', desc: '스텔라 파밀리아 · 범용 딜러',        faction: '스텔라 파밀리아' },
  { id: 32, name: '마그나',     color: '#c62828', desc: '스텔라 파밀리아 · 뱅가드',           faction: '스텔라 파밀리아' },
  { id: 33, name: '카를',       color: '#37474f', desc: '스텔라 파밀리아 · 전투원',           faction: '스텔라 파밀리아' },
  { id: 34, name: '칼리페',     color: '#ad1457', desc: '스텔라 파밀리아 · 전투원',           faction: '스텔라 파밀리아' },
  { id: 35, name: '사라',       color: '#81c784', desc: '스텔라 파밀리아 · 전투원',           faction: '스텔라 파밀리아' },

  // ─── 성전십자회 ───
  { id: 36, name: '오를레아',   color: '#ffd54f', desc: '성전십자회 · 대검 기사',             faction: '성전십자회' },
  { id: 37, name: '루셰',       color: '#b39ddb', desc: '성전십자회 · 전투원',               faction: '성전십자회' },
  { id: 38, name: '쥬다스',     color: '#455a64', desc: '성전십자회 · 전투원',               faction: '성전십자회' },

  // ─── 방랑자 ───
  { id: 39, name: '린',         color: '#4caf50', desc: '방랑자 · 1코스트 스트라이커',        faction: '방랑자' },
  { id: 40, name: '카일론',     color: '#795548', desc: '방랑자 · 전투원',                   faction: '방랑자' },

  // ─── 제국 중앙 감찰부 ───
  { id: 41, name: '루이스',     color: '#90a4ae', desc: '제국 중앙 감찰부 · 전투원',          faction: '제국 중앙 감찰부' },
  { id: 42, name: '로지',       color: '#f44336', desc: '제국 중앙 감찰부 · 전투원',          faction: '제국 중앙 감찰부' },
  { id: 43, name: '나인',       color: '#311b92', desc: '제국 중앙 감찰부 · 강력한 유닛',     faction: '제국 중앙 감찰부' },
];

module.exports = { characters };
