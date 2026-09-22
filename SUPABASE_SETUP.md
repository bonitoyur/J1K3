# Supabase 연결

> 현재 사이트는 일반 PostgreSQL 서버 API를 사용합니다. [현재 설정 안내](POSTGRES_SETUP.md)를 확인하세요. 아래는 이전 버전의 기록입니다.

> 이전 Supabase 버전의 참고 문서입니다. 현재 사이트는 Firebase로 연결합니다. 신규 설정은 [Firebase 설정 안내](FIREBASE_SETUP.md)를 따라 진행하세요. 아래 SQL을 Firebase에서 실행하지 않습니다.

## 이미 연결해 둔 프로젝트의 수정 기능 추가

이전 버전의 `schema.sql`을 실행했다면 SQL Editor에서 **`supabase/migrations/20260921_edit_visits.sql`** 을 실행하세요. 기존 방문 기록을 유지하면서 본인 기록 수정·삭제 권한과 소유권 조회 함수를 추가합니다. 웹 파일도 새 구조로 함께 배포하세요. 신규 프로젝트는 아래의 최신 `schema.sql` 전체 실행만 하면 됩니다.

## 1. 프로젝트와 테이블 준비

1. Supabase에서 프로젝트를 만듭니다.
2. SQL Editor에서 `supabase/schema.sql` 전체를 실행합니다. 100개 산 ID와 방문 기록 테이블, 접근 정책을 생성합니다. 같은 SQL을 다시 실행해도 기존 방문 기록은 지우지 않습니다.
3. Authentication 설정에서 **Anonymous Sign-Ins (익명 로그인)** 를 켭니다. 방문자가 별도의 가입 화면 없이 기록을 남기기 위한 설정입니다.

## 2. 공개 키 입력

프로젝트의 Connect 대화상자 또는 Settings에서 Project URL과 API Keys의 Publishable key를 확인하고 `supabase-config.js`에 입력합니다.

```js
window.SUPABASE_CONFIG = {
  url: 'https://YOUR-PROJECT.supabase.co',
  publishableKey: 'sb_publishable_YOUR_KEY'
};
```

legacy `anon` 키도 사용할 수 있습니다. `secret` 또는 `service_role` 키는 브라우저 파일에 넣지 마세요.

## 3. 실행과 확인

`npm run dev` 또는 VS Code Live Server로 실행합니다. 정적 HTTPS 호스팅에는 `index.html`, `supabase-config.js`, `src/`, `assets/`를 함께 올리세요. 별도 빌드는 없습니다. 파일을 직접 여는 `file://` 대신 HTTP/HTTPS 주소를 사용하세요.

1. 산을 선택하고 날짜, 작성자, 코멘트를 입력해 저장합니다.
2. 산 카드가 연한 초록색과 ‘✓ 방문 완료’로 바뀌고 상세 카드에 기록이 표시되는지 확인합니다.
3. 새로고침해도 기록이 남는지, 다른 브라우저에서도 읽을 수 있는지 확인합니다.
4. 다른 사람이 추가한 기록은 ‘기록 새로고침’ 버튼으로 가져옵니다.
5. 작성한 브라우저에서 기록의 ‘수정’을 누르고 날짜·작성자·코멘트를 변경해 저장합니다. 새로고침 후에도 수정 버튼과 내용이 유지되는지 확인합니다.
6. 다른 브라우저에는 수정·삭제 버튼이 없는지 확인합니다. 날짜나 작성자 이름만 같다고 수정 권한이 생기지 않습니다.
7. 본인 테스트 기록을 삭제하고 마지막 기록이면 카드가 미방문 색상으로 돌아오는지 확인합니다.

연결 전에는 입력이 비활성화됩니다. 저장 실패 시 입력은 유지되고 성공한 경우에만 카드 색상이 바뀝니다. 산을 전환할 때 임시 입력을 유지하지만 페이지를 새로고침하면 저장 전 입력은 사라집니다.

## 공유와 권한

- 이 사이트는 **공개 공유 산행 기록장**입니다. 누군가 기록한 산이면 모두에게 방문 완료로 표시됩니다. 개인별 달성 현황이 아닙니다.
- 방문 날짜·작성자·코멘트는 누구나 읽을 수 있습니다. 작성자는 사용자가 입력하는 별명으로, 본인 인증된 이름이 아닙니다.
- 작성 시 Supabase 익명 인증을 사용합니다. RLS는 자신의 사용자 ID로만 기록을 추가하고 본인 기록만 수정·삭제하도록 제한합니다. 수정 가능한 필드는 날짜·작성자·코멘트입니다. 기록의 소유자와 산 ID는 변경할 수 없습니다. 관리자는 Table Editor에서 정정할 수 있습니다.
- 본인 기록은 같은 사이트 주소·브라우저의 인증 정보가 남아 있을 때 수정할 수 있습니다. 다른 브라우저 또는 사이트 데이터 삭제 후에는 익명 계정을 복구할 수 없습니다. 기기 간 본인 인증이 필요하면 이메일·소셜 로그인 도입이 추가로 필요합니다.
- 방문 기록에는 사용자 ID가 저장되지만 공개 조회 권한에는 사용자 ID를 포함하지 않습니다.
- `my_mountain_visit_ids()` 함수는 현재 JWT의 `auth.uid()`와 일치하는 기록 ID만 반환합니다. 사용자 ID를 인자로 받지 않으며 다른 사용자의 소유자 정보를 공개하지 않습니다. 실제 수정·삭제는 별도의 RLS 정책으로 다시 제한합니다.
- 하나의 산에 여러 날짜/작성자의 기록을 남길 수 있습니다. 오늘까지의 날짜만 허용하며 DB 날짜 검증 기준은 한국 시간입니다.
- 공개 서비스의 무분별한 등록 방지가 필요하면 Supabase의 익명 인증 제한과 CAPTCHA 설정을 검토하세요. CAPTCHA를 필수로 켜면 프런트엔드에 해당 위젯과 토큰 전달도 구현해야 합니다.
- Supabase 프로젝트가 없거나 인터넷/CDN 연결이 끊기면 기존 산 가이드는 표시되지만 기록 저장 기능은 사용할 수 없습니다.

공식 문서: [API 키](https://supabase.com/docs/guides/getting-started/api-keys), [익명 로그인](https://supabase.com/docs/guides/auth/auth-anonymous), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).
