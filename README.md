# 결혼 소식 페이지 (모바일 청첩장)

순수 HTML / CSS / JS로 만든 정적 페이지입니다. 빌드 도구, 서버 코드, GitHub Actions 없이 **GitHub Pages**에 그대로 올려 쓰도록 만들었습니다.

```
wedding/
├── index.html          # 뼈대 + OG/SEO 메타 태그
├── config.js           # 모든 문구와 데이터 (여기만 수정)
├── 404.html            # 없는 주소로 들어왔을 때 보이는 페이지 (index.html로 돌아가는 링크)
├── .nojekyll           # GitHub Pages의 Jekyll 처리를 끄는 빈 파일 (지우지 마세요)
├── README.md
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/            # cover.webp, gallery-01~06.webp, og-image.jpg, favicon.svg
```

> 현재 이미지, 이름, 날짜, 전화번호, 계좌번호는 모두 **샘플 값**입니다. 실제 정보로 바꾼 뒤 배포하세요.

## 공개 저장소 주의사항 (꼭 읽어 주세요)

이 저장소는 **public**으로 올리는 것을 전제로 합니다. 저장소에 올린 파일은 누구나 볼 수 있고, 지워도 커밋 기록에 남습니다.

- 실제 **계좌번호, 전화번호, 주소**를 `config.js`나 다른 파일에 넣지 마세요. 샘플 값만 둡니다.
- 마음 전하실 곳(`showAccounts`)은 기본값이 `false`입니다. 이때 페이지에는 계좌 대신 "마음을 전하고 싶으신 분은 개별로 연락 주세요"라는 안내와 연락하기 버튼만 표시됩니다.
- 실제 연락처를 꼭 노출해야 한다면 저장소 공개 여부를 먼저 다시 생각해 보세요. 이 프로젝트는 암호화 기능을 포함하지 않습니다.

## 경로 규칙 (프로젝트 사이트)

GitHub Pages 프로젝트 사이트의 주소는 `https://[깃헙아이디].github.io/[저장소명]/` 입니다. 사이트가 도메인 루트가 아니라 **하위 경로**에 있으므로:

- 모든 내부 경로는 `./assets/...`처럼 **상대 경로**로 씁니다. `/assets/...`처럼 `/`로 시작하면 `github.io/assets/...`를 찾아서 깨집니다.
- 절대 주소(`https://...`)가 필요한 곳은 `og:image`와 `og:url` 두 곳뿐입니다. `index.html`에서 `YOUR-ID`(깃헙 아이디)와 `YOUR-REPO`(저장소명)를 실제 값으로 바꾸세요.

## 로컬에서 확인하기

배포 환경과 같은 하위 경로로 확인하기 위해 **저장소 폴더의 상위 폴더**에서 서버를 띄웁니다.

```bash
cd wedding/..          # wedding 폴더의 부모 폴더
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000/wedding/ 열기 (개발자 도구에서 모바일 보기 권장)
```

저장소명을 `wedding`이 아닌 다른 이름으로 만들었다면 폴더 이름과 주소의 `wedding` 부분을 그 이름으로 바꿔 확인하세요. `file://`로 직접 열면 클립보드 등 일부 기능이 동작하지 않을 수 있습니다.

## 1. config.js 수정하기

문구와 데이터는 `config.js`에서만 바꿉니다. `main.js`는 건드리지 않아도 됩니다.

| 항목 | 설명 |
| --- | --- |
| `couple` | 신랑/신부 이름과 호칭(장남, 장녀 등) |
| `parents` | 양가 부모님 성함. `deceased: true`로 두면 성함 앞에 「故」가 붙습니다 |
| `wedding.date` | `YYYY-MM-DD` 형식. 달력, D-day, 커버 날짜가 자동 계산됩니다 |
| `wedding.showTime` / `showVenue` | `false`면 시간과 장소를 공개하지 않습니다 (기본 `false`) |
| `greeting` / `notice` | 인사말과 안내 문구. 빈 줄은 문단 구분, 한 줄 바꿈은 줄바꿈 |
| `gallery` | 갤러리 이미지 경로 배열. 항목을 추가하거나 빼면 됩니다 (`./assets/img/...` 상대 경로) |
| `contacts` | 신랑/신부 전화번호 (공개 저장소이므로 샘플 값 유지 권장) |
| `showAccounts` | 기본 `false`: 계좌 대신 개별 연락 안내 + 연락하기 버튼. `true`로 바꾸면 `accounts` 목록이 아코디언으로 보입니다. 실제 계좌는 넣지 마세요 |
| `accounts` | 신랑측/신부측 계좌 목록 (샘플 값) |
| `bgm.src` | 배경음악 파일 경로. 비워 두면 토글 버튼이 나타나지 않습니다. 켜더라도 기본은 OFF이고 자동재생하지 않습니다 |
| `labels` | 버튼과 섹션 제목 등 모든 고정 문구 |

**OG 제목/설명은 `index.html`에서 따로 수정해야 합니다.** 카카오톡 같은 크롤러는 JS를 실행하지 않기 때문에 `config.js`의 값이 반영되지 않습니다. `index.html` 상단의 `<title>`, `description`, `og:*`, `twitter:*` 태그를 직접 고치세요.

## 2. 이미지 교체하기

모든 이미지는 `assets/img/`에 같은 파일명으로 덮어쓰면 됩니다.

| 파일 | 권장 규격 | 용도 |
| --- | --- | --- |
| `cover.webp` | 1200×1600 (3:4) | 커버 사진 |
| `gallery-01.webp` … | 800×1067 (3:4) | 갤러리 썸네일과 확대 보기 |
| `og-image.jpg` | 1200×630 이상 (약 1.91:1) | 카카오톡/SNS 공유 미리보기 |
| `favicon.svg` | 정사각형 | 브라우저 탭 아이콘 |

- 규격을 지키면 `width`/`height` 속성과 맞아 레이아웃이 밀리지 않습니다 (CLS 방지). 다른 비율을 쓰려면 `main.js`의 갤러리 `width: 800, height: 1067`과 커버 `1200 × 1600`, CSS의 `aspect-ratio`를 함께 바꾸세요.
- WebP 변환 예시 (macOS): `cwebp -q 80 input.jpg -o cover.webp`
- 사진을 추가하려면 파일을 넣고 `config.js`의 `gallery`에 `{ src: "./assets/img/gallery-07.webp", alt: "웨딩 사진 7" }`를 추가합니다.
- 용량은 장당 200KB 안팎을 권장합니다. 카카오톡 인앱 브라우저에서 빠르게 열립니다.

## 3. GitHub Pages 배포

1. **저장소 만들고 push**: GitHub에서 새 저장소를 만들고(public) 이 폴더의 내용을 `main` 브랜치에 push합니다.
   ```bash
   cd wedding
   git init
   git add .
   git commit -m "첫 배포"
   git branch -M main
   git remote add origin https://github.com/[깃헙아이디]/[저장소명].git
   git push -u origin main
   ```
2. **Pages 켜기**: 저장소의 Settings → Pages → Build and deployment → Source를 **Deploy from a branch**로 두고, Branch를 **main / (root)**로 선택한 뒤 Save를 누릅니다.
3. **확인**: 1~2분 뒤 `https://[깃헙아이디].github.io/[저장소명]/`에 접속해 페이지가 뜨는지 확인합니다.
4. **이후 수정**: 파일을 고친 뒤 `git add . && git commit -m "수정" && git push`만 하면 자동으로 반영됩니다.

**배포 후 꼭 할 일**
- `index.html`의 `YOUR-ID`와 `YOUR-REPO`를 실제 값으로 모두 교체합니다 (`og:image`, `og:url`, `twitter:image`). 이후 다시 push합니다.
- 카카오톡에 공유하기 전에 아래 "카카오톡 OG 캐시 초기화"를 한 번 해 두면 미리보기가 정확합니다.

## 검색엔진 노출 차단

검색 차단은 `index.html`의 `<meta name="robots" content="noindex, nofollow">` (그리고 `404.html`의 같은 태그)에만 의존합니다.

- `robots.txt`는 이 프로젝트에 포함하지 않습니다. 프로젝트 사이트(`github.io/[저장소명]/`)에서는 `robots.txt`가 **도메인 루트(`[깃헙아이디].github.io/robots.txt`)에 있을 때만** 인식되므로, 저장소 안에 두어도 효과가 없습니다.
- `noindex`는 검색 결과에서 빼 달라는 요청일 뿐 접근을 막지는 않습니다. 주소를 아는 사람은 누구나 열 수 있고, public 저장소의 코드도 누구나 볼 수 있습니다. 주소는 공유할 분들에게만 전달하세요.

## 4. 카카오톡 OG 캐시 초기화

카카오톡은 한 번 불러온 링크 미리보기(제목, 설명, 이미지)를 캐시합니다. 이미지나 문구를 바꿨는데 이전 미리보기가 나오면 아래 순서로 초기화하세요.

1. [Kakao Developers 공유 디버거](https://developers.kakao.com/tool/debugger/sharing)에 접속해 카카오 계정으로 로그인합니다.
2. 확인할 페이지 URL을 입력하고 **디버그**를 누릅니다.
3. 결과 화면에서 **캐시 초기화**를 누릅니다.
4. 카카오톡 채팅창에서 링크를 다시 보내 미리보기를 확인합니다.

미리보기가 계속 나오지 않으면 다음을 점검하세요.
- `og:image`가 `https://`로 시작하는 절대 주소인지, 브라우저로 직접 열리는지
- 이미지가 너무 크지 않은지 (5MB 이하 권장)
- 카카오톡 앱을 완전히 종료한 뒤 다시 열어 보기
- 링크 끝에 `?v=2`처럼 쿼리를 붙여 새 URL로 보내기 (임시 방법)

## 배포 전 점검 체크리스트

- [ ] 저장소명 하위 경로(`/[저장소명]/`)에서 모든 리소스(CSS, JS, 이미지, 파비콘)가 로드되는지
- [ ] 브라우저 콘솔에 오류와 404가 없는지
- [ ] `config.js`, `index.html`, 이미지에 실제 계좌번호·전화번호·주소가 들어가지 않았는지
- [ ] `index.html`의 `YOUR-ID` / `YOUR-REPO`를 실제 값으로 바꿨는지
- [ ] `og:image` 주소가 브라우저로 직접 열리는지
- [ ] 모든 내부 경로가 `./`로 시작하는 상대 경로인지 (`/`로 시작하는 경로 없음)
- [ ] `.nojekyll`이 저장소 루트에 있는지
- [ ] `404.html`의 "처음으로 돌아가기" 링크가 동작하는지
- [ ] 모바일(360–430px)에서 가로 스크롤이 생기지 않는지

## 지원 환경과 접근성

- 모바일 우선 (360–430px). 데스크톱에서는 최대 480px 중앙 컨테이너로 표시됩니다.
- `100vh` 대신 `dvh`, 그리고 `safe-area-inset`을 사용해 카카오톡 인앱 브라우저(iOS/Android)에서 화면이 잘리지 않습니다.
- `prefers-reduced-motion` 설정을 존중하며, 자동 스크롤 효과는 없습니다.
- 버튼은 `aria-label`이 있고 터치 영역이 44px 이상입니다.
- 이 페이지에는 길찾기, 참석 여부(RSVP) 기능이 없습니다. 결혼 소식을 알리는 용도입니다.
