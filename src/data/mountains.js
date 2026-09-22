import { nationalExtraMountains } from './nationwide.js';

const capitalMountains = [
  {
    id: 'myeongseong', name: '명성산', region: '경기 포천', location: '포천시 영북면 · 산정호수', elevation: '923m', hikeTime: '약 4–5시간', driveTime: '약 1시간 50분', difficulty: '중급',
    feature: '가을이면 정상부 능선을 은빛으로 채우는 억새 군락이 압권. 산정호수와 함께 하루 코스로 묶기 좋습니다.',
    trail: '산정호수 상동주차장 → 비선폭포 → 등룡폭포 → 억새밭 → 팔각정 왕복',
    transitTime: '약 2시간 30분', transitRoute: '1호선 도봉산역 → 광역버스 1386 → 산정호수', carTime: '약 1시간 50분', carRoute: '서울역 → 구리포천고속도로 → 산정호수 상동주차장', destination: '산정호수 상동주차장',
    food: '이동갈비 · 포천막걸리 · 산채비빔밥', festival: '산정호수 명성산 억새꽃축제', festivalNote: '10월 대표 억새 축제 · 개최일은 포천시 공지 확인', festivalQuery: '산정호수 명성산 억새꽃축제', x: 46, y: 22
  },
  {
    id: 'baegun', name: '백운산', region: '경기 포천', location: '포천시 이동면 · 백운계곡', elevation: '903m', hikeTime: '약 4–5시간', driveTime: '약 2시간', difficulty: '중급',
    feature: '맑은 백운계곡과 울창한 숲길이 이어지는 산. 여름 계곡과 가을 단풍 산행 모두 좋습니다.',
    trail: '백운계곡 주차장 → 흥룡사 → 백운산 정상 → 삼각봉 회귀',
    transitTime: '약 3시간', transitRoute: '1호선 도봉산역 → 포천 이동 방면 버스 → 백운계곡', carTime: '약 2시간', carRoute: '서울역 → 구리포천고속도로 → 백운계곡 주차장', destination: '백운계곡 주차장',
    food: '이동갈비 · 산채백반 · 포천 사과', festival: '산정호수 명성산 억새꽃축제', festivalNote: '포천 북부에서 함께 즐기기 좋은 10월 축제', festivalQuery: '포천 10월 축제', x: 56, y: 23
  },
  {
    id: 'hwaak', name: '화악산', region: '경기 가평', location: '가평군 북면 · 화악리', elevation: '1,468m', hikeTime: '약 4–5시간', driveTime: '약 2시간 10분', difficulty: '상급',
    feature: '경기도 최고봉. 고도가 높아 날씨 변화가 빠르고, 중봉에서 펼쳐지는 조망이 시원합니다.',
    trail: '화악터널 쌈지공원 → 군사도로 갈림길 → 중봉 왕복',
    transitTime: '약 3시간', transitRoute: '경춘선·ITX 가평역 → 북면행 버스 → 화악리, 이후 택시 권장', carTime: '약 2시간 10분', carRoute: '서울역 → 서울양양고속도로 → 화악터널 쌈지공원', destination: '화악터널 쌈지공원',
    food: '가평 잣두부 · 닭갈비 · 잣막걸리', festival: '자라섬 재즈 페스티벌', festivalNote: '가평의 대표 10월 음악 축제 · 연도별 일정 확인', festivalQuery: '자라섬 재즈 페스티벌', x: 65, y: 34
  },
  {
    id: 'gamaksan', name: '감악산', region: '경기 파주', location: '파주시 적성면 · 설마리', elevation: '675m', hikeTime: '약 3–4시간', driveTime: '약 1시간 30분', difficulty: '중급',
    feature: '경기 오악 중 하나로 암릉과 임진강 조망이 매력적입니다. 출렁다리를 함께 지나는 코스가 인기예요.',
    trail: '감악산 출렁다리 주차장 → 범륜사 → 정상 → 까치봉 회귀',
    transitTime: '약 2시간 20분', transitRoute: '1호선 양주역 → 적성행 버스 25번대 → 출렁다리 입구', carTime: '약 1시간 30분', carRoute: '서울역 → 자유로·설마천로 → 감악산 출렁다리 주차장', destination: '감악산 출렁다리 주차장',
    food: '장단콩 두부 · 파주 닭국수 · 한수위쌀밥', festival: '파주개성인삼축제', festivalNote: '10월 임진각 일대에서 열리는 대표 특산물 축제', festivalQuery: '파주개성인삼축제', x: 33, y: 38
  },
  {
    id: 'soyo', name: '소요산', region: '경기 동두천', location: '동두천시 상봉암동', elevation: '588m', hikeTime: '약 3–4시간', driveTime: '약 1시간 30분', difficulty: '중급',
    feature: '전철역에서 바로 시작할 수 있는 수도권 단풍 명산. 자재암과 아기자기한 암릉이 이어집니다.',
    trail: '소요산역 → 일주문 → 자재암 → 하백운대 → 의상대 → 원점 회귀',
    transitTime: '약 1시간 50분', transitRoute: '서울역 → 1호선 소요산역 → 도보로 등산로 입구', carTime: '약 1시간 30분', carRoute: '서울역 → 동부간선도로 → 소요산 관광지 주차장', destination: '소요산 관광지 주차장',
    food: '동두천 부대찌개 · 떡갈비 · 도토리묵', festival: '소요단풍문화제', festivalNote: '단풍 절정 무렵 열리는 지역 가을 행사 · 일정 변동 가능', festivalQuery: '소요단풍문화제', x: 41, y: 41
  },
  {
    id: 'unak', name: '운악산', region: '경기 가평', location: '가평군 조종면 · 현등사', elevation: '935m', hikeTime: '약 4–5시간', driveTime: '약 1시간 45분', difficulty: '상급',
    feature: '기암괴석과 암릉이 웅장한 경기 오악. 로프·계단 구간이 있어 미끄럼 방지 신발이 필요합니다.',
    trail: '운악산 공영주차장 → 눈썹바위 → 미륵바위 → 정상 → 현등사',
    transitTime: '약 2시간 40분', transitRoute: '경춘선 청평역 → 현리행 버스 → 운악산·현등사 입구', carTime: '약 1시간 45분', carRoute: '서울역 → 서울양양고속도로 → 운악산 공영주차장', destination: '운악산 공영주차장',
    food: '가평 잣두부 · 막국수 · 닭갈비', festival: '자라섬 재즈 페스티벌', festivalNote: '산행과 묶어 가평의 10월을 즐기기 좋은 축제', festivalQuery: '자라섬 재즈 페스티벌', x: 49, y: 45
  },
  {
    id: 'myeongji', name: '명지산', region: '경기 가평', location: '가평군 북면 · 익근리', elevation: '1,267m', hikeTime: '약 6–7시간', driveTime: '약 2시간 10분', difficulty: '상급',
    feature: '경기도에서 두 번째로 높은 산. 명지계곡과 깊은 숲이 아름답지만 긴 산행을 준비해야 합니다.',
    trail: '익근리 주차장 → 승천사 → 명지폭포 → 명지1봉 왕복',
    transitTime: '약 3시간 20분', transitRoute: 'ITX 가평역 → 북면행 버스 → 익근리(배차 간격 확인)', carTime: '약 2시간 10분', carRoute: '서울역 → 서울양양고속도로 → 명지산 익근리 주차장', destination: '명지산 익근리 주차장',
    food: '가평 잣국수 · 잣두부 · 민물매운탕', festival: '자라섬 재즈 페스티벌', festivalNote: '가평 대표 10월 축제 · 산행일과 분리 방문 권장', festivalQuery: '자라섬 재즈 페스티벌', x: 59, y: 44
  },
  {
    id: 'mani', name: '마니산', region: '인천 강화', location: '강화군 화도면', elevation: '472m', hikeTime: '약 3–4시간', driveTime: '약 1시간 40분', difficulty: '중급',
    feature: '서해와 강화 들판이 한눈에 펼쳐지는 역사 산행지. 정상 참성단 주변의 탁 트인 조망이 좋습니다.',
    trail: '마니산 국민관광지 → 단군로 → 참성단 → 계단로 하산',
    transitTime: '약 2시간 40분', transitRoute: '서울역 → 홍대입구·김포 방면 → 강화터미널 → 화도행 버스', carTime: '약 1시간 40분', carRoute: '서울역 → 올림픽대로·김포대로 → 마니산 국민관광지', destination: '마니산 국민관광지',
    food: '젓국갈비 · 밴댕이회 · 강화 순무김치', festival: '강화도 새우젓축제', festivalNote: '10월 강화 외포항 일대 대표 먹거리 축제', festivalQuery: '강화도 새우젓축제', x: 21, y: 49
  },
  {
    id: 'bukhansan', name: '북한산', region: '서울 강북', location: '강북구 우이동 · 백운대', elevation: '837m', hikeTime: '약 4–5시간', driveTime: '약 50분', difficulty: '상급',
    feature: '도심 속 국립공원에서 만나는 거대한 화강암 봉우리. 백운대 정상부는 주말 혼잡을 고려하세요.',
    trail: '북한산우이역 → 도선사 → 백운대탐방지원센터 → 백운대 왕복',
    transitTime: '약 1시간 15분', transitRoute: '4호선 신용산·성신여대입구 환승 → 우이신설선 북한산우이역', carTime: '약 50분', carRoute: '서울역 → 내부순환로 → 북한산우이역 공영주차장', destination: '북한산우이역',
    food: '우이동 백숙 · 손두부 · 도토리묵', festival: '서울억새축제', festivalNote: '10월 서울의 대표 가을 축제 · 월드컵공원 개최', festivalQuery: '서울억새축제', x: 42, y: 58
  },
  {
    id: 'dobongsan', name: '도봉산', region: '서울 도봉', location: '도봉구 도봉동 · 신선대', elevation: '740m', hikeTime: '약 4–5시간', driveTime: '약 50분', difficulty: '상급',
    feature: '선인봉·만장봉·자운봉이 만드는 날카로운 암봉 풍경이 대표적. 지하철 접근성이 매우 좋습니다.',
    trail: '도봉산역 → 도봉탐방지원센터 → 천축사 → 마당바위 → 신선대 왕복',
    transitTime: '약 55분', transitRoute: '서울역 → 1호선 도봉산역 → 도보로 탐방지원센터', carTime: '약 50분', carRoute: '서울역 → 동부간선도로 → 도봉산 공영주차장', destination: '도봉산 공영주차장',
    food: '손두부 · 도토리묵 · 산채비빔밥', festival: '도봉 지역 가을문화행사', festivalNote: '10월 행사명·일정은 도봉구 문화관광 공지 확인', festivalQuery: '도봉구 10월 축제', x: 52, y: 60
  },
  {
    id: 'chukryeong', name: '축령산', region: '경기 남양주', location: '남양주시 수동면 · 자연휴양림', elevation: '886m', hikeTime: '약 4시간', driveTime: '약 1시간 25분', difficulty: '중급',
    feature: '잣나무 숲과 능선 조망이 어우러진 산. 서리산 철쭉 능선과 연계하면 더 긴 종주가 가능합니다.',
    trail: '축령산자연휴양림 → 수리바위 → 남이바위 → 정상 → 휴양림',
    transitTime: '약 2시간 30분', transitRoute: '경춘선 마석역 → 수동·축령산행 버스 → 휴양림', carTime: '약 1시간 25분', carRoute: '서울역 → 북부간선도로 → 축령산자연휴양림', destination: '축령산자연휴양림',
    food: '남양주 먹골배 · 팔당 장어 · 두부요리', festival: '정약용문화제', festivalNote: '남양주의 대표 가을 문화축제 · 10월 일정 확인', festivalQuery: '정약용문화제', x: 60, y: 54
  },
  {
    id: 'cheonma', name: '천마산', region: '경기 남양주', location: '남양주시 화도읍', elevation: '812m', hikeTime: '약 3–4시간', driveTime: '약 1시간 10분', difficulty: '중급',
    feature: '경춘선으로 편하게 닿는 남양주의 대표 산. 정상 능선에서 북한강과 수도권 동북부가 펼쳐집니다.',
    trail: '천마산역 → 관리사무소 → 깔딱고개 → 정상 왕복',
    transitTime: '약 1시간 30분', transitRoute: '서울역 → 회기역 환승 → 경춘선 천마산역 → 도보', carTime: '약 1시간 10분', carRoute: '서울역 → 북부간선도로 → 천마산군립공원 주차장', destination: '천마산군립공원 주차장',
    food: '팔당 장어 · 먹골배 디저트 · 숯불고기', festival: '정약용문화제', festivalNote: '남양주 대표 10월 인문·문화 축제', festivalQuery: '정약용문화제', x: 58, y: 70
  },
  {
    id: 'gwanak', name: '관악산', region: '서울 관악', location: '관악구 신림동 · 연주대', elevation: '632m', hikeTime: '약 4시간', driveTime: '약 40분', difficulty: '중급',
    feature: '서울 남쪽을 대표하는 바위산. 연주대의 절벽 풍경과 도심 조망이 좋고 대중교통 접근이 편합니다.',
    trail: '관악산역 → 서울대 건설환경종합연구소 → 깔딱고개 → 연주대',
    transitTime: '약 45분', transitRoute: '서울역 → 2호선 신림역 환승 → 신림선 관악산역', carTime: '약 40분', carRoute: '서울역 → 남부순환로 → 관악산공원 주차장', destination: '관악산공원 주차장',
    food: '신림동 순대 · 샤로수길 식당 · 막걸리', festival: '관악강감찬축제', festivalNote: '10월 낙성대공원 일대에서 열리는 관악구 대표 축제', festivalQuery: '관악강감찬축제', x: 45, y: 76
  },
  {
    id: 'yumyeong', name: '유명산', region: '경기 가평', location: '가평군 설악면 · 자연휴양림', elevation: '864m', hikeTime: '약 4시간', driveTime: '약 1시간 40분', difficulty: '중급',
    feature: '억새 능선과 맑은 계곡을 함께 즐기는 산. 자연휴양림을 기점으로 원점 회귀하기 좋습니다.',
    trail: '유명산자연휴양림 → 정상 → 유명계곡 → 용소 → 휴양림',
    transitTime: '약 3시간', transitRoute: '경춘선 청평역 → 설악터미널 → 유명산행 버스(배차 확인)', carTime: '약 1시간 40분', carRoute: '서울역 → 서울양양고속도로 → 유명산자연휴양림', destination: '유명산자연휴양림',
    food: '가평 잣두부 · 막국수 · 숯불 닭갈비', festival: '자라섬 재즈 페스티벌', festivalNote: '가평의 대표 10월 축제 · 산행 다음 일정으로 추천', festivalQuery: '자라섬 재즈 페스티벌', x: 69, y: 75
  },
  {
    id: 'yongmun', name: '용문산', region: '경기 양평', location: '양평군 용문면 · 용문사', elevation: '1,157m', hikeTime: '약 5–6시간', driveTime: '약 1시간 35분', difficulty: '상급',
    feature: '천년 은행나무가 있는 용문사와 깊은 계곡을 품은 양평의 최고봉. 정상부 오르막이 가파릅니다.',
    trail: '용문산관광지 → 용문사 → 마당바위 → 가섭봉 왕복',
    transitTime: '약 2시간 20분', transitRoute: '서울역 → 용산역 → 경의중앙선 용문역 → 7번대 버스', carTime: '약 1시간 35분', carRoute: '서울역 → 강변북로·6번 국도 → 용문산관광지', destination: '용문산관광지',
    food: '용문산 산채정식 · 더덕구이 · 양평해장국', festival: '용문산 은행나무 가을행사', festivalNote: '10월 말 전후 지역 행사 · 양평군 최신 공지 확인', festivalQuery: '용문산 은행나무 축제', x: 77, y: 72
  }
];

const regions = ['수도권', '강원', '충청', '전라', '경상', '제주'];
const mountains = [...capitalMountains.map(m => ({...m, group: '수도권'})), ...nationalExtraMountains];
mountains.find(m => m.id === 'baegun').name = '백운산(포천)';
// Correct known route ambiguity while retaining the Seoul Station origin.
mountains.find(m => m.id === 'bukhansan').transitRoute = '서울역 → 4호선 성신여대입구역 → 우이신설선 북한산우이역 → 도선사 방향 도보';
mountains.find(m => m.id === 'gwanak').transitRoute = '서울역 → 4호선 사당역 → 2호선 신림역 → 신림선 관악산역';
mountains.find(m => m.id === 'gwanak').trail = '관악산역 → 관악산공원 → 호수공원 → 제4야영장 → 연주대 왕복';
mountains.find(m => m.id === 'bukhansan').hikeTime = '약 5–6시간';
mountains.find(m => m.id === 'baegun').trail = '백운계곡 주차장 → 흥룡사 → 백운산 정상 왕복';
mountains.find(m => m.id === 'soyo').hikeTime = '약 4–5시간';
mountains.find(m => m.id === 'hwaak').feature += ' 최고봉은 출입 제한 구역이며 소개 코스는 중봉을 향합니다. 군사도로·탐방로 개방 여부를 확인하세요.';
const specialSafety = {
 '한라산':['https://visithalla.jeju.go.kr/contents/contents.do?id=49','한라산 탐방 예약 안내 ↗'],
 '대암산':['https://sum.inje.go.kr/','대암산 용늪 공식 탐방 안내 ↗'],
 '점봉산':['https://www.forest.go.kr/kfsweb/kfi/kfs/jbRsrvt/jbIntro.do?mn=AR02_02_06_01','점봉산 곰배령 공식 탐방 안내 ↗']
};
mountains.forEach(m => {
  if (specialSafety[m.name]) [m.safetyUrl, m.safetyLabel] = specialSafety[m.name];
  if (m.group === '수도권') m.festivalNote = '가을 행사 후보 · 2026년 10월 개최 여부와 정확한 날짜는 미확인입니다. 주최 측 공지를 확인하세요.';
});
mountains.find(m => m.name === '재약산').feature += ' 선정 자료의 1,189m는 사자봉 기준이며, 소개 코스는 수미봉 방향입니다.';

export { mountains, regions };
