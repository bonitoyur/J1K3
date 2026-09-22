// Add entries here; keep existing IDs stable for saved visit records.
const defaults = {
  isAdditional: true, difficulty: '중급',
  festival: '지역 문화행사', festivalNote: '개최 여부와 일정은 해당 지자체 공식 공지를 확인하세요.'
};
export const additionalMountains = [
  {
    ...defaults, id: 'taegisan', name: '태기산', group: '강원', region: '강원 횡성·평창', location: '횡성군 둔내면 · 평창군 봉평면', elevation: '1,261m',
    hikeTime: '약 3–4시간', driveTime: '약 2시간 30분–3시간',
    feature: '풍력발전기와 산 능선 풍경을 만나는 산입니다. 양구두미재에서 출발하며, 개방된 길과 현장 출입 안내를 확인하세요.',
    trail: '양구두미재 → 풍력발전단지 방향 개방 산행길 왕복',
    transitTime: '약 2시간 30분–3시간 30분', transitRoute: '서울역 → KTX 둔내역 → 양구두미재 방면 택시 (운행·귀가편 확인)',
    carTime: '약 2시간 30분–3시간', carRoute: '서울역 → 영동고속도로 → 둔내IC → 양구두미재 (주차·도로 상태 확인)', destination: '양구두미재',
    food: '횡성 한우 · 막국수', festivalQuery: '횡성군 문화행사',
    sourceUrl: 'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=9a725dfc-cbf3-43b4-b728-d12a5e726c21', sourceLabel: '한국관광공사 태기산 안내 ↗'
  },
  {
    ...defaults, id: 'inwangsan', name: '인왕산', group: '수도권', region: '서울 종로·서대문', location: '종로구 · 서대문구 경계', elevation: '338m',
    hikeTime: '약 2–3시간', driveTime: '약 20–40분',
    feature: '성곽길과 화강암 바위가 어우러진 도심 산입니다. 정상 주변은 가파른 바위와 계단이 이어집니다.',
    trail: '돈의문 터 → 인왕산 성곽길 → 정상 → 윤동주 시인의 언덕',
    transitTime: '약 20–40분', transitRoute: '서울역 → 서대문역 방면 대중교통 → 돈의문 터 도보 (환승·도보 포함 추정)',
    carTime: '약 20–40분', carRoute: '서울역 → 돈의문 터 인근 공영주차장 (주차 위치 확인)', destination: '돈의문 터',
    food: '서촌 한식 · 통인시장 먹거리', festivalQuery: '종로구 문화행사', x: 35, y: 67,
    sourceUrl: 'https://seoulcitywall.seoul.go.kr/wallcourse/6.do', sourceLabel: '서울 한양도성 인왕구간 안내 ↗'
  },
  {
    ...defaults, id: 'bugaksan', name: '북악산', group: '수도권', region: '서울 종로·성북', location: '종로구 · 성북구 백악산 일대', elevation: '342m',
    hikeTime: '약 3시간', driveTime: '약 30–50분',
    feature: '백악산이라고도 부르며 한양도성 성곽과 서울 도심 풍경을 함께 볼 수 있습니다. 계단이 많으므로 여유 있게 걷고 탐방 공지를 확인하세요.',
    trail: '창의문 → 백악마루 → 청운대 → 숙정문 → 말바위 → 와룡공원',
    transitTime: '약 40–60분', transitRoute: '서울역 → 경복궁역 방면 대중교통 → 창의문 방면 버스 → 도보 (환승 포함 추정)',
    carTime: '약 30–50분', carRoute: '서울역 → 창의문 인근 공영주차장 (주차 위치 확인)', destination: '창의문',
    food: '부암동 한식 · 성북동 국수', festivalQuery: '종로 성북 문화행사', x: 46, y: 67,
    sourceUrl: 'https://seoulcitywall.seoul.go.kr/wallcourse/1.do', sourceLabel: '서울 한양도성 백악구간 안내 ↗'
  }
];
