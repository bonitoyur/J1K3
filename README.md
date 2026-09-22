# 홍제 공삼삼 · 전국 100대 명산

현재 코드는 **Firebase Cloud Firestore + Firebase 익명 인증**을 사용합니다. PostgreSQL 전환 중 끊긴 기존 연결을 복원한 상태입니다. Firebase SQL Connect의 PostgreSQL은 Spark 기준 90일 체험이며 계속 무료로 운영할 수 있는 요금제가 아니므로 생성하거나 배포하지 않았습니다.

## 실행

```powershell
npm.cmd run dev
```

http://localhost:5173 에 접속합니다. Firebase SDK는 공식 CDN으로 읽으므로 패키지 설치가 필요하지 않습니다. `firebase-config.js`에는 기존 프로젝트 설정이 유지되어 있습니다.

Firebase 프로젝트 생성, 익명 인증, 보안 규칙 설정은 [Firebase 설정 안내](FIREBASE_SETUP.md)를 확인하세요. `firebase.json`에는 기존 `firebase/firestore.rules` 경로만 연결되어 있으며 로컬 규칙 파일과 클라우드에 게시된 규칙은 별도입니다. 클라우드 규칙 배포와 실제 저장 검증은 아직 완료하지 않았습니다.

## 수정할 파일

| 목적 | 파일 |
|---|---|
| 제목·소개·페이지 구성 | `index.html` |
| 헤더·푸터·산 상세·입력 폼 | `src/templates/` |
| 글꼴·색상·반응형 디자인 | `src/styles/` |
| 산 정보와 지도 좌표 | `src/data/` |
| 산 선택과 기록 UI | `src/features/` |
| Firebase 조회·저장·수정·삭제 | `src/services/visits.js` |
| 공개 웹 앱 설정 | `firebase-config.js` |
| 접근 권한 규칙 | `firebase/firestore.rules` |

기록은 공개 공유하며 본인 기록만 작성한 브라우저에서 수정·삭제할 수 있습니다. 인증 UID는 별도 컬렉션에 저장합니다. 브라우저 데이터 삭제 또는 주소 변경 시 기존 익명 인증 정보는 이어지지 않습니다.

## 검증과 빌드

```powershell
npm.cmd test
npm.cmd run build
```

테스트는 모의 Firebase SDK와 화면 상태를 확인합니다. 실제 프로젝트 권한 검증을 대신하지 않습니다. `dist/`에는 정적 웹 파일과 공개 Firebase 설정만 포함됩니다. `api/visits.js`와 PostgreSQL 서버 API는 제거했으며 `DATABASE_URL`과 `pg` 설치는 필요하지 않습니다.

기존 `supabase/`, `postgres/`, SQL·안내 파일은 이전 방식 참고용이며 현재 연결에 사용하지 않습니다. 기존 데이터를 자동 이전하지 않습니다.

무료 정책: [Firebase SQL Connect 가격](https://firebase.google.com/docs/sql-connect/pricing), [Firebase 무료 요금제](https://firebase.google.com/pricing).
