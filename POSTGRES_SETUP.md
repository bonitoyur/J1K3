# PostgreSQL 설정 (이전 전환안, 현재 미사용)

> 무료 운영 조건을 확인하면서 Firebase Firestore 코드를 복원했습니다. 아래 Node API 및 Neon 안내는 현재 코드와 일치하지 않습니다. 현재 사용 방법은 FIREBASE_SETUP.md를 확인하세요. Firebase SQL Connect의 PostgreSQL은 Spark 기준 90일 체험이며 상시 무료가 아닙니다.

구조: 브라우저 → 같은 사이트의 `/api/visits` → PostgreSQL.
무료 시작 구성은 Neon Free PostgreSQL + Vercel Hobby 웹/API 호스팅입니다. Vercel Hobby는 개인 비상업 용도이며 두 서비스 모두 무료 사용량 제한이 있습니다. 상업용이면 요금제 조건을 다시 확인하세요.

이전 Firebase/Supabase 설정 파일은 참고용으로 남겨두었지만 현재 앱에서 읽거나 배포하지 않습니다. 기존 DB의 기록과 인증 정보는 자동 이전되지 않습니다.

## 순서대로 설정

1. https://console.neon.tech/ 에 가입하고 Free 요금제로 프로젝트를 만듭니다. 이름 예: `hongje033-mountains`. 지역은 사용자와 서버에 가까운 곳을 선택하세요.
2. 프로젝트의 Connect에서 **Pooled connection** 연결 문자열을 확인합니다. `postgresql://...?...sslmode=require` 형태이며 DB 비밀번호가 들어 있습니다. 대화창이나 GitHub에 올리지 마세요.
3. 로컬에서 `.env.example`을 복사해 `.env`를 만들고 `DATABASE_URL=` 뒤에 연결 문자열을 입력합니다. 연결 문자열만 넣고 `psql` 명령어나 감싸는 작은따옴표는 넣지 않습니다. 예시가 아닌 실제 주소가 필요합니다.
4. Node.js 22 이상에서 의존성을 설치합니다: `npm.cmd install`.
5. 테이블을 만듭니다: `npm.cmd run db:setup`. 또는 Neon SQL Editor에서 `postgres/schema.sql` 전체를 실행할 수 있습니다. 기존 기록은 지우지 않습니다.
6. 개발 서버를 실행합니다: `npm.cmd run dev`. http://localhost:5173 에서 기록 저장·새로고침·수정·삭제를 확인하세요.

VS Code Live Server는 정적 파일만 제공하므로 DB 기능에는 사용할 수 없습니다. 반드시 프로젝트의 Node 서버를 사용하세요. `.env` 변경 후 서버를 재시작하세요.

## 작성자 권한

별도 회원가입 화면 없이 브라우저별 보안 쿠키로 작성자를 구분합니다. 쿠키 원문은 HttpOnly라서 JavaScript에서 읽을 수 없고 DB에는 해시만 저장합니다. API는 모든 수정·삭제 쿼리에 소유자 조건을 적용합니다. 작성자 이름을 같게 입력해도 타인의 기록을 수정할 수 없습니다.

공개 조회에는 날짜·작성자·코멘트와 현재 브라우저의 소유 여부만 반환합니다. 소유자 해시는 반환하지 않습니다. 쿠키가 사라지거나 다른 기기·사이트 주소로 이동하면 이전 기록을 수정할 수 없습니다. 로컬에서 작성한 기록도 배포 주소에서는 본인 기록으로 인식되지 않습니다. 관리자는 DB에서 정정할 수 있습니다. 쿠키는 사용 시 갱신되며 마지막 사용 기준 1년간 유지됩니다.

## GitHub와 배포 (DB 연결 확인 후 진행)

- `.gitignore`가 `.env`, `node_modules`, 캐시, 배포 산출물을 제외합니다. `.env.example`에는 실제 비밀번호를 넣지 마세요.
- GitHub 저장소에 소스를 올린 후 Vercel에서 Import합니다. Framework Preset은 **Other**입니다.
- Build Command: `npm run build`, Output Directory: `dist`. `vercel.json`에 설정되어 있습니다.
- Vercel 프로젝트의 Environment Variables에 `DATABASE_URL`을 등록합니다. 서버 전용이며 `NEXT_PUBLIC_` 같은 공개 접두사를 붙이지 않습니다.
- Preview 환경은 가능하면 별도의 Neon 개발 브랜치 DB를 사용하세요. Production과 동일한 DB를 설정하면 미리보기 페이지도 실제 기록을 변경합니다.
- 배포가 끝나면 제공되는 `*.vercel.app` 주소로 접속합니다. 별도 도메인 구매는 필요하지 않습니다.
- 선택 사항: 서버 환경 변수 `APP_ORIGIN=https://실제주소.vercel.app`을 설정하면 해당 Origin의 변경 요청만 허용합니다. 미설정 시 요청한 사이트 Host와 Origin이 같은지 확인합니다.
- 정적 파일은 `dist/`만 공개하고 API는 Vercel Node 함수로 실행합니다. Firebase Hosting이나 GitHub Pages만으로는 현재 서버 API를 실행할 수 없습니다.

## 수정 위치

| 목적 | 파일 |
|---|---|
| DB 연결 | `.env`의 `DATABASE_URL` (서버 전용) |
| DB 테이블·제약조건 | `postgres/schema.sql` |
| 연결 풀 | `server/db.js` |
| API 인증·검증·SQL | `server/visits.js` |
| Vercel API 진입점 | `api/visits.js` |
| 브라우저 API 호출 | `src/services/visits.js` |
| 입력·기록 표시·카드 색 | `src/features/visits.js`, `src/styles/visits.css` |

## 확인과 오류

`npm.cmd test`는 모의 DB를 이용해 API 소유권, 입력 검증, SQL 매개변수 처리, 오류 정보 보호, 화면 동작을 확인합니다. 실제 PostgreSQL 연결·SQL 실행·Vercel 배포를 검증한 것은 아닙니다. 연결 정보 입력 후 실제 저장을 확인해야 합니다.

- `HTTP_503`: `.env`의 DATABASE_URL, 의존성 설치, 테이블 생성, DB 네트워크 확인.
- `HTTP_401` 또는 `HTTP_404`: 작성한 브라우저·사이트 주소인지 확인. 이미 삭제된 기록도 404입니다.
- `HTTP_403`: 같은 사이트에서 요청했는지, APP_ORIGIN이 현재 주소와 일치하는지 확인.
- 저장은 공개 방문 기록장 방식입니다. 누구나 기록을 읽고 자기 기록을 작성할 수 있습니다.

공식 안내: [Neon 무료 요금제](https://neon.com/blog/how-to-make-the-most-of-neons-free-plan), [Vercel Hobby 조건](https://vercel.com/docs/plans/hobby), [Vercel 환경 변수](https://vercel.com/docs/environment-variables).
