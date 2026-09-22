# Firebase Cloud Firestore 설정 순서


사이트 코드는 Firebase용으로 변경되어 있습니다. 사용자가 직접 할 일은 Firebase 프로젝트 생성, 익명 인증 활성화, Firestore 규칙 게시, `firebase-config.js` 값 입력입니다. Supabase SQL은 실행하지 않습니다.

## 1. 무료 프로젝트 만들기

1. https://console.firebase.google.com/ 에 Google 계정으로 로그인합니다.
2. 프로젝트 만들기(Add/Create project)를 누릅니다.
3. 이름을 입력합니다. 예: `hongje033-mountains`.
4. Google Analytics는 이 사이트에서 사용하지 않으므로 선택하지 않아도 됩니다.
5. 생성 후 요금제가 **Spark (무료)** 인지 확인합니다. 이 구현에는 Blaze, Cloud Functions, Cloud Storage, App Hosting이 필요하지 않습니다.

## 2. 웹 앱 등록

1. 프로젝트 개요에서 웹 아이콘 **`</>`** 을 누릅니다. 또는 톱니바퀴 → 프로젝트 설정 → 일반 → 내 앱 → 웹 앱 추가.
2. 앱 닉네임을 입력합니다. 예: `mountains-web`.
3. Firebase Hosting 설정은 선택하지 않아도 됩니다. 기존 호스팅이나 로컬 개발 서버를 사용할 수 있습니다.
4. 앱 등록 후 표시되는 `firebaseConfig`의 값을 복사합니다. 별도 npm SDK 설치 명령은 실행하지 않아도 됩니다. 프로젝트 코드가 Firebase 공식 CDN의 SDK를 읽습니다.

## 3. 로컬 설정 파일 입력

프로젝트 루트의 **`firebase-config.js`** 를 열어 아래 네 필드의 빈 문자열을 실제 값으로 바꿉니다.

```js
window.FIREBASE_CONFIG = {
  apiKey: 'Firebase 화면에서 복사한 apiKey',
  authDomain: '프로젝트ID.firebaseapp.com',
  projectId: '프로젝트ID',
  appId: 'Firebase 화면에서 복사한 appId'
};
```

`window.FIREBASE_CONFIG =`는 그대로 두고 값만 바꾸세요. Firebase 화면에 함께 나오는 `storageBucket`, `messagingSenderId`, `measurementId`는 현재 기능에 필요하지 않습니다. 웹 앱 설정은 공개 가능한 값이며, 접근 권한은 아래 Security Rules에서 제한합니다. 서비스 계정 JSON이나 `private_key`를 넣지 마세요.

## 4. 익명 인증 활성화

1. Firebase 콘솔 → **Authentication** → 시작하기(Get started).
2. **Sign-in method / 로그인 방법**에서 **Anonymous / 익명**을 선택합니다.
3. **Enable / 사용 설정**을 켜고 저장합니다.

별도의 이메일 입력 없이 브라우저에 인증 정보를 저장합니다. 방문 기록을 처음 저장할 때 익명 사용자가 생성됩니다. 같은 브라우저·사이트 주소에서는 새로고침 후에도 본인 기록 수정 버튼이 표시됩니다. 다른 기기나 브라우저, 사이트 데이터 삭제 후에는 기존 익명 계정에 접근할 수 없습니다.

`auth/unauthorized-domain` 오류가 발생하면 Authentication → Settings → Authorized domains에서 접속한 도메인을 확인하세요. 로컬은 `localhost`, 배포 후에는 실제 사이트 도메인을 추가합니다. 도메인 입력에는 `http://`, 포트, 경로를 넣지 않습니다.

## 5. Cloud Firestore 만들기

1. 메뉴의 **Firestore Database / Cloud Firestore**를 엽니다. 콘솔 구성에 따라 Build 또는 Databases & Storage 아래에 있습니다.
2. **Create database / 데이터베이스 만들기**를 누릅니다.
3. 에디션 선택이 있으면 **Standard edition**을 선택합니다.
4. Database ID는 **`(default)`** 를 사용합니다. 코드는 기본 데이터베이스에 연결합니다.
5. 위치는 한국 사용자 기준으로 Seoul (`asia-northeast3`)이 제공되면 선택합니다. 위치는 생성 후 바꾸기 어렵기 때문에 확인하고 진행하세요.
6. 모드는 **Production mode / 프로덕션 모드**를 선택합니다. 다음 단계에서 사이트에 맞는 규칙을 적용합니다.

컬렉션과 문서를 미리 만들 필요는 없습니다. 첫 방문 기록 저장 시 자동 생성됩니다. 무료 할당량은 무제한이 아니며 Firestore의 Usage 화면에서 확인할 수 있습니다.

## 6. 보안 규칙 게시 — 필수

1. VS Code에서 **`firebase/firestore.rules`** 를 엽니다.
2. 파일 전체 내용을 복사합니다.
3. Firebase 콘솔 → Firestore Database → **Rules / 규칙** 탭을 엽니다.
4. 기본 규칙 전체를 복사한 내용으로 교체합니다.
5. **Publish / 게시**를 누릅니다. 로컬 파일 저장만으로 콘솔의 규칙이 변경되지는 않습니다.

규칙은 이 사이트 전용 프로젝트 기준입니다. 다른 앱의 컬렉션을 이미 사용하는 프로젝트에서는 기존 규칙을 덮어쓰지 말고 병합해야 합니다.

규칙이 허용하는 동작:

- 누구나 산행 기록을 읽을 수 있습니다.
- 익명 인증을 포함한 로그인한 사용자만 기록을 추가할 수 있습니다.
- 작성자만 자신의 기록을 수정·삭제할 수 있습니다.
- 날짜·작성자·코멘트만 수정할 수 있고, 소유자·산 ID는 변경할 수 없습니다.
- 날짜는 한국 시간 기준 오늘까지, 작성자 1~40자, 코멘트 1~2,000자입니다.
- 산 ID는 기존 100곳만 허용됩니다.
- 공개 기록은 `mountain_visits`, 인증 UID는 비공개 `visit_owners`에 따로 저장됩니다. 작성자 정보 문서는 본인만 읽을 수 있습니다.
- 기록과 소유자 문서는 한 번에 생성·삭제되어야 합니다. 사이트 코드가 이를 처리합니다.

## 7. 로컬에서 실행

VS Code 터미널에서 프로젝트 폴더를 기준으로 실행합니다.

```powershell
npm.cmd run dev
```

브라우저에서 **http://localhost:5173** 을 엽니다. 이미 서버를 실행 중이라면 페이지를 새로고침합니다. HTML을 더블클릭하는 `file://` 방식은 사용하지 않습니다. 패키지 설치나 빌드는 필요하지 않습니다.

## 8. 실제 동작 확인

1. 산 하나를 선택합니다.
2. 날짜·작성자 별명·코멘트를 입력하고 저장합니다.
3. 초록색 카드와 방문 완료 표시를 확인합니다.
4. 새로고침해도 기록과 수정·삭제 버튼이 남는지 확인합니다.
5. 수정 버튼으로 코멘트를 바꾸고 저장합니다.
6. 다른 브라우저에서 같은 페이지를 열어 기록은 보이지만 수정·삭제 버튼은 없는지 확인합니다.
7. 본인 테스트 기록을 삭제합니다. 해당 산의 마지막 기록이면 방문 완료 표시도 사라집니다.

Firebase 콘솔의 Firestore Data 탭에는 `mountain_visits`, `visit_owners`가 표시되고, Authentication Users 탭에는 익명 사용자가 표시됩니다. 관리자가 콘솔에서 기록을 삭제할 때에는 두 컬렉션의 **동일한 문서 ID**를 함께 삭제하세요.

## 오류 해결

| 증상/코드 | 확인할 부분 |
| --- | --- |
| 입력 폼이 계속 비활성화, ‘관리자가 Firebase를 연결하면…’ | `firebase-config.js`의 네 값이 모두 입력되어 있는지 |
| `auth/invalid-api-key` | 웹 앱 설정의 `apiKey`를 정확히 복사했는지 |
| `auth/operation-not-allowed` 또는 `auth/admin-restricted-operation` | Authentication에서 익명 로그인을 켰는지 |
| `permission-denied` / Missing or insufficient permissions | `firestore.rules` 전체를 올바른 프로젝트의 Rules에 게시했는지 |
| `auth/unauthorized-domain` | 접속 도메인이 Authorized domains에 등록되었는지 |
| DB가 없다는 오류 | Firestore의 `(default)` 데이터베이스를 생성했는지 |
| `resource-exhausted` | 무료 사용량 한도를 넘었는지 Usage에서 확인 |
| 연결 오류 | 인터넷, Firebase CDN 접근, 브라우저 확장 프로그램 차단 여부 확인 |

수정·삭제 버튼이 없을 때에는 처음 작성한 브라우저와 **같은 사이트 주소**인지 확인하고 ‘기록 새로고침’을 누르세요. `localhost`와 `127.0.0.1`, 로컬과 배포 주소는 서로 다른 인증 저장 공간입니다.

## 배포할 파일

`index.html`, `firebase-config.js`, `src/`, `assets/`를 정적 호스팅에 같은 구조로 올립니다. `firebase/firestore.rules`는 웹에 올리는 것으로 적용되지 않으며, Firebase 콘솔에 게시해야 합니다. Supabase 관련 파일은 배포할 필요가 없습니다.

기존 Supabase 기록은 자동으로 옮기지 않습니다. 이미 저장한 기록이 있다면 데이터 이전과 작성자 계정 연결을 별도로 진행해야 합니다.

## 검증 범위

모의 SDK를 사용하는 자동 테스트로 저장·조회·수정·삭제·실패 흐름을 확인했습니다. 실제 Firebase 프로젝트 연결과 Security Rules의 허용/거부 동작은 프로젝트 생성 및 설정 후 확인해야 합니다.

공식 문서: [웹 앱 설정](https://firebase.google.com/docs/web/setup), [익명 인증](https://firebase.google.com/docs/auth/web/anonymous-auth), [보안 규칙](https://firebase.google.com/docs/firestore/security/get-started), [무료 요금제](https://firebase.google.com/pricing).
