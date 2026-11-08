/*
 * 청첩장 설정 파일 — 모든 문구와 데이터는 이 파일에서만 수정하세요.
 * 코드(main.js, index.html)는 건드리지 않아도 내용이 바뀝니다.
 * 날짜는 반드시 YYYY-MM-DD 형식이어야 달력과 D-day가 계산됩니다.
 * 이 저장소는 공개(public)입니다. 실제 계좌번호, 전화번호, 주소는 절대 넣지 마세요. 샘플 값만 사용합니다.
 * 경로는 모두 ./assets/... 처럼 상대 경로로 씁니다. /assets/... 처럼 / 로 시작하면 GitHub Pages 하위 경로에서 깨집니다.
 */
window.WEDDING_CONFIG = {
  /* 신랑 / 신부 */
  couple: {
    groom: { name: "조지훈", role: "장남" },
    bride: { name: "유희연", role: "차녀" },
  },

  /* 양가 부모님 — deceased: true 로 두면 성함 앞에 "故"가 붙습니다 */
  parents: {
    groom: {
      father: { name: "조광재", deceased: false },
      mother: { name: "임수현", deceased: false },
    },
    bride: {
      father: { name: "유종민", deceased: false },
      mother: { name: "박소연", deceased: false },
    },
  },

  /* 예식 정보 — showTime / showVenue 가 false 면 해당 정보는 공개하지 않습니다 */
  wedding: {
    date: "2027-05-15", // 샘플 날짜 (YYYY-MM-DD)
    showTime: false,
    time: "낮 12시",
    showVenue: false,
    venue: "[예식장 이름]",
  },

  /* 인사말 — 빈 줄(줄바꿈 두 번)은 문단 구분, 한 줄 바꿈은 줄바꿈으로 표시됩니다 */
  greeting:
    "서로의 하루를 나누며 같은 곳을 바라보기로 했습니다.\n" +
    "이제 그 약속을 가족들 앞에서 조용히 전하려 합니다.\n\n" +
    "늘 곁에서 응원해 주신 가족분들께 감사한 마음을 담아 소식을 전합니다.",

  /* 안내 — 가족끼리 조용히 진행한다는 취지의 문구 */
  notice:
    "저희는 가까운 가족들과 함께 조용히 결혼식을 올리려 합니다.\n\n" +
    "마음 써 주신 뜻 깊이 감사드리며, 따뜻한 축복으로 함께해 주시면 더없이 기쁘겠습니다.",

  /* 갤러리 — assets/img/gallery/ 폴더에 사진을 넣고 `python3 scripts/update-gallery.py` 를 실행하면
     assets/data/gallery.json 이 갱신되어 자동으로 보입니다. 이미지는 WebP 권장 (3:4 비율) */
  galleryFile: "./assets/data/gallery.json",

  /* 연락처 */
  contacts: {
    groom: { name: "[신랑 이름]", phone: "010-0000-0000" },
    bride: { name: "[신부 이름]", phone: "010-0000-0000" },
  },

  /* 마음 전하실 곳 — 기본값 false: 계좌 대신 "개별 연락" 안내와 연락하기 버튼만 보여 줍니다.
     true 로 바꾸면 아래 accounts 목록이 아코디언으로 나옵니다. 공개 저장소이므로 실제 계좌는 넣지 마세요. */
  showAccounts: true,
  /* 계좌 목록은 별도 파일에서 불러옵니다 (showAccounts 가 true 일 때만 읽음) */
  accountsFile: "./assets/data/accounts.json",

  /* 배경음악 — src 를 비워 두면 토글 버튼이 나타나지 않습니다. 기본값은 항상 OFF(자동재생 없음) */
  bgm: { src: "" },

  /* 공유 문구 / 푸터 */
  shareText: "조지훈 · 유희연의 결혼 소식을 전합니다.",
  footer: "감사합니다. 행복하게 살겠습니다.",

  /* 상단 메뉴바에 보일 짧은 이름 (섹션 id 기준). 비워 두면 섹션 제목을 그대로 씁니다 */
  navLabels: {
    greeting: "인사말",
    notice: "안내",
    gallery: "갤러리",
    accounts: "마음 전하기",
    contact: "연락",
    share: "공유",
  },

  /* 섹션 제목과 버튼 문구 */
  labels: {
    coverKicker: "WEDDING INVITATION",
    coverAlt: "커버 사진",
    navLabel: "바로가기 메뉴",
    greetingTitle: "인사말",
    noticeTitle: "안내",
    galleryTitle: "갤러리",
    galleryOpen: "사진 크게 보기",
    galleryPage: "사진 묶음",
    galleryPrevPage: "이전 사진들",
    galleryNextPage: "다음 사진들",
    close: "닫기",
    prev: "이전 사진",
    next: "다음 사진",
    accountsTitle: "마음 전하실 곳",
    accountsLead: "직접 전하기 어려우신 분들을 위해 계좌번호를 남겨 둡니다.",
    accountsNote: "마음을 전하고 싶으신 분은 개별로 연락 주세요.",
    accountsContact: "연락하기",
    groomSide: "신랑측",
    brideSide: "신부측",
    owner: "예금주",
    copy: "복사",
    copied: "계좌번호를 복사했습니다",
    copyFailed: "복사에 실패했습니다. 번호를 직접 선택해 주세요",
    contactTitle: "연락하기",
    call: "전화",
    text: "문자",
    shareTitle: "공유하기",
    shareButton: "청첩장 공유하기",
    linkCopied: "링크를 복사했습니다",
    bgmOn: "배경음악 끄기",
    bgmOff: "배경음악 켜기",
    bgmError: "음악을 재생할 수 없습니다",
  },
};
