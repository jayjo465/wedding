/*
 * 청첩장 렌더링 스크립트.
 * 내용과 데이터는 config.js에서 수정하세요. 이 파일은 보통 수정할 필요가 없습니다.
 * 설정값은 innerHTML 대신 DOM API로 넣어서, 문구에 특수문자가 있어도 마크업으로 해석되지 않습니다.
 */
(function () {
  "use strict";

  var C = window.WEDDING_CONFIG;
  var app = document.getElementById("app");
  var toastEl = document.getElementById("toast");
  if (!C || !app) return;

  var L = C.labels;
  var WEEK = ["일", "월", "화", "수", "목", "금", "토"];

  /* ---------- DOM 헬퍼 ---------- */
  function h(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      var val = attrs[key];
      if (val === false || val === null || val === undefined) return;
      if (key === "text") node.textContent = val;
      else if (key === "class") node.className = val;
      else if (key.indexOf("on") === 0) node.addEventListener(key.slice(2), val);
      else node.setAttribute(key, val === true ? "" : val);
    });
    (children || []).forEach(function append(child) {
      if (Array.isArray(child)) {
        child.forEach(append);
        return;
      }
      if (child === null || child === undefined || child === false) return;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  /* 줄바꿈(\n)을 <br>로 바꿔서 자연스러운 줄바꿈 유지 */
  function lines(text) {
    var frag = document.createDocumentFragment();
    String(text || "").split("\n").forEach(function (line, i) {
      if (i > 0) frag.appendChild(h("br"));
      frag.appendChild(document.createTextNode(line));
    });
    return frag;
  }

  /* 빈 줄(\n\n)을 기준으로 문단 나누기 */
  function paragraphs(text) {
    return String(text || "").split(/\n\s*\n/).map(function (para) {
      return h("p", { class: "body" }, [lines(para)]);
    });
  }

  function section(id, title, children) {
    return h(
      "section",
      { class: "section", id: id, "aria-labelledby": id + "-title" },
      [h("h2", { class: "section__title", id: id + "-title", text: title })].concat(children)
    );
  }

  function displayName(p) {
    return p.deceased ? "故 " + p.name : p.name;
  }

  /* ---------- 날짜 계산 (로컬 시간대 영향 없이 UTC 기준으로 계산) ---------- */
  function isYMD(str) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(str));
  }

  function parseYMD(str) {
    var p = String(str).split("-").map(Number);
    return { y: p[0], m: p[1], d: p[2] };
  }

  function weekday(dt) {
    return new Date(Date.UTC(dt.y, dt.m - 1, dt.d)).getUTCDay();
  }

  /* to - from (일 단위) */
  function dayGap(from, to) {
    return Math.round(
      (Date.UTC(to.y, to.m - 1, to.d) - Date.UTC(from.y, from.m - 1, from.d)) / 86400000
    );
  }

  function today() {
    var t = new Date();
    return { y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate() };
  }

  function koreanDate(dt) {
    return dt.y + "년 " + dt.m + "월 " + dt.d + "일 " + WEEK[weekday(dt)] + "요일";
  }

  /* ---------- 1. 커버 ---------- */
  function renderCover(wd) {
    var info = [
      h("p", { class: "cover__kicker", text: L.coverKicker }),
      h("h1", { class: "cover__names", text: C.couple.groom.name + " · " + C.couple.bride.name }),
    ];
    if (wd) info.push(h("p", { class: "cover__date", text: koreanDate(wd) }));
    if (C.wedding.showTime) info.push(h("p", { class: "cover__meta", text: C.wedding.time }));
    if (C.wedding.showVenue) info.push(h("p", { class: "cover__meta", text: C.wedding.venue }));

    return h("header", { class: "cover" }, [
      h("img", {
        class: "cover__img",
        src: "./assets/img/cover.webp",
        alt: L.coverAlt,
        width: 1200,
        height: 1600,
      }),
      h("div", { class: "cover__text" }, info),
    ]);
  }

  /* ---------- 2. 인사말 ---------- */
  function renderGreeting() {
    var P = C.parents;
    var G = C.couple.groom;
    var B = C.couple.bride;
    var groomLine =
      displayName(P.groom.father) + " · " + displayName(P.groom.mother) + "의 " + G.role + " " + G.name;
    var brideLine =
      displayName(P.bride.father) + " · " + displayName(P.bride.mother) + "의 " + B.role + " " + B.name;

    return section("greeting", L.greetingTitle, [
      h("div", { class: "greeting" }, paragraphs(C.greeting)),
      h("ul", { class: "family" }, [
        h("li", { text: groomLine }),
        h("li", { text: brideLine }),
      ]),
    ]);
  }

  /* ---------- 3. 안내 ---------- */
  function renderNotice() {
    return section("notice", L.noticeTitle, [h("div", { class: "notice" }, paragraphs(C.notice))]);
  }

  /* ---------- 4. 달력 + D-day ---------- */
  function renderCalendar(wd) {
    if (!wd) return null;

    var firstDow = weekday({ y: wd.y, m: wd.m, d: 1 });
    var lastDay = new Date(Date.UTC(wd.y, wd.m, 0)).getUTCDate();

    var thead = h("thead", null, [
      h(
        "tr",
        null,
        WEEK.map(function (w, i) {
          return h("th", {
            scope: "col",
            class: i === 0 ? "sun" : i === 6 ? "sat" : null,
            text: w,
          });
        })
      ),
    ]);

    var rows = [];
    var row = [];
    var i;
    for (i = 0; i < firstDow; i++) row.push(h("td"));
    for (var d = 1; d <= lastDay; d++) {
      var col = (firstDow + d - 1) % 7;
      var label = d === wd.d ? h("span", { class: "hl", text: String(d) }) : String(d);
      row.push(h("td", { class: col === 0 ? "sun" : col === 6 ? "sat" : null }, [label]));
      if (row.length === 7) {
        rows.push(row);
        row = [];
      }
    }
    if (row.length) {
      while (row.length < 7) row.push(h("td"));
      rows.push(row);
    }

    var tbody = h("tbody", null, rows.map(function (cells) {
      return h("tr", null, cells);
    }));
    var table = h("table", { class: "cal", "aria-label": L.calendarTitle }, [thead, tbody]);

    var diff = dayGap(today(), wd);
    var value = diff > 0 ? "D-" + diff : diff === 0 ? "D-Day" : "D+" + (-diff);
    var note = diff > 0 ? L.ddayBefore : diff === 0 ? L.ddayToday : L.ddayAfter;

    return section("calendar", L.calendarTitle, [
      h("p", { class: "cal__month", text: wd.y + "년 " + wd.m + "월" }),
      table,
      h("div", { class: "dday" }, [
        h("p", { class: "dday__value", text: value }),
        h("p", { class: "dday__note", text: note }),
      ]),
    ]);
  }

  /* ---------- 5. 갤러리 + 라이트박스 ---------- */
  var gallery = []; /* render() 에서 gallery.json 을 읽어 채웁니다 */
  var lb = { el: null, index: 0, opener: null, touchX: null };

  function showSlide(i) {
    var n = gallery.length;
    lb.index = (i + n) % n;
    var item = gallery[lb.index];
    lb.el.querySelector(".lightbox__img").src = item.src;
    lb.el.querySelector(".lightbox__img").alt = item.alt;
    lb.el.querySelector(".lightbox__count").textContent = lb.index + 1 + " / " + n;
  }

  function step(dir) {
    showSlide(lb.index + dir);
  }

  function closeLightbox() {
    if (!lb.el || lb.el.hidden) return;
    lb.el.hidden = true;
    document.documentElement.classList.remove("is-locked");
    if (lb.opener) lb.opener.focus();
  }

  function buildLightbox() {
    var el = h(
      "div",
      { class: "lightbox", role: "dialog", "aria-modal": "true", "aria-label": L.galleryTitle, hidden: true },
      [
        h("button", { type: "button", class: "lightbox__close", "aria-label": L.close, text: "×", onclick: closeLightbox }),
        h("button", {
          type: "button",
          class: "lightbox__nav lightbox__prev",
          "aria-label": L.prev,
          text: "‹",
          onclick: function () { step(-1); },
        }),
        h("img", { class: "lightbox__img", alt: "" }),
        h("button", {
          type: "button",
          class: "lightbox__nav lightbox__next",
          "aria-label": L.next,
          text: "›",
          onclick: function () { step(1); },
        }),
        h("p", { class: "lightbox__count", "aria-live": "polite" }),
      ]
    );

    el.addEventListener("click", function (e) {
      if (e.target === el) closeLightbox();
    });
    el.addEventListener("touchstart", function (e) {
      lb.touchX = e.touches[0].clientX;
    }, { passive: true });
    el.addEventListener("touchend", function (e) {
      if (lb.touchX === null) return;
      var dx = e.changedTouches[0].clientX - lb.touchX;
      lb.touchX = null;
      if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    });

    document.body.appendChild(el);
    return el;
  }

  function openLightbox(i, opener) {
    if (!lb.el) lb.el = buildLightbox();
    lb.opener = opener;
    showSlide(i);
    lb.el.hidden = false;
    document.documentElement.classList.add("is-locked");
    lb.el.querySelector(".lightbox__close").focus();
  }

  document.addEventListener("keydown", function (e) {
    if (!lb.el || lb.el.hidden) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });

  function renderGallery() {
    if (!gallery.length) return null;
    return section("gallery", L.galleryTitle, [
      h(
        "div",
        { class: "gallery" },
        gallery.map(function (item, i) {
          return h(
            "button",
            {
              type: "button",
              class: "gallery__btn",
              "aria-label": L.galleryOpen + " " + (i + 1),
              onclick: function (e) { openLightbox(i, e.currentTarget); },
            },
            [h("img", {
              src: item.src,
              alt: item.alt,
              width: 800,
              height: 1067,
              loading: "lazy",
              decoding: "async",
            })]
          );
        })
      ),
    ]);
  }

  /* ---------- 공통: 클립보드 복사 (navigator.clipboard → execCommand 폴백) ---------- */
  function copyText(text) {
    function fallback() {
      return new Promise(function (resolve, reject) {
        var ta = h("textarea", { class: "sr-copy", readonly: true });
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, text.length);
        var ok = false;
        try {
          ok = document.execCommand("copy");
        } catch (err) {
          ok = false;
        }
        document.body.removeChild(ta);
        if (ok) resolve();
        else reject(new Error("copy failed"));
      });
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(fallback);
    }
    return fallback();
  }

  /* ---------- 토스트 ---------- */
  var toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("is-show");
    }, 2000);
  }

  function copyWithToast(text, okMsg) {
    copyText(text).then(
      function () { toast(okMsg); },
      function () { toast(L.copyFailed); }
    );
  }

  /* ---------- 6. 마음 전하실 곳 ---------- */
  /* 기본 방식: 계좌 대신 개별 연락 안내 + 연락하기 버튼 (#contact로 이동) */
  function renderAccountsNote() {
    return section("accounts", L.accountsTitle, [
      h("p", { class: "section__lead", text: L.accountsNote }),
      h("div", { class: "share" }, [
        h("a", { class: "btn btn--primary", href: "#contact", text: L.accountsContact }),
      ]),
    ]);
  }

  function renderAccounts() {
    if (!C.showAccounts) return renderAccountsNote();

    var groups = [
      { label: L.groomSide, list: C.accounts.groom },
      { label: L.brideSide, list: C.accounts.bride },
    ].filter(function (g) {
      return g.list && g.list.length;
    });
    if (!groups.length) return null;

    return section("accounts", L.accountsTitle, [
      h("p", { class: "section__lead", text: L.accountsLead }),
      h(
        "div",
        { class: "acc-wrap" },
        groups.map(function (g) {
          return h("details", { class: "acc" }, [
            h("summary", { class: "acc__sum", text: g.label }),
            h(
              "ul",
              { class: "acc__list" },
              g.list.map(function (a) {
                return h("li", { class: "acc__item" }, [
                  h("p", { class: "acc__bank", text: a.bank + " " + a.number }),
                  h("p", { class: "acc__owner", text: L.owner + " " + a.owner }),
                  h("button", {
                    type: "button",
                    class: "btn",
                    "aria-label": a.owner + " 계좌번호 복사",
                    text: L.copy,
                    onclick: function () { copyWithToast(a.number, L.copied); },
                  }),
                ]);
              })
            ),
          ]);
        })
      ),
    ]);
  }

  /* ---------- 7. 연락하기 ---------- */
  function renderContact() {
    var people = [C.contacts.groom, C.contacts.bride];
    return section("contact", L.contactTitle, [
      h(
        "ul",
        { class: "contact" },
        people.map(function (p) {
          var tel = String(p.phone).replace(/[^0-9+]/g, "");
          return h("li", { class: "contact__row" }, [
            h("span", { class: "contact__name", text: p.name }),
            h("span", { class: "contact__btns" }, [
              h("a", { class: "btn", href: "tel:" + tel, "aria-label": p.name + "에게 전화하기", text: L.call }),
              h("a", { class: "btn", href: "sms:" + tel, "aria-label": p.name + "에게 문자 보내기", text: L.text }),
            ]),
          ]);
        })
      ),
    ]);
  }

  /* ---------- 8. 공유하기 (Web Share API → 미지원 시 링크 복사) ---------- */
  function copyLink() {
    copyWithToast(location.href, L.linkCopied);
  }

  function onShare() {
    if (!navigator.share) {
      copyLink();
      return;
    }
    navigator
      .share({ title: document.title, text: C.shareText, url: location.href })
      .catch(function (err) {
        if (err && err.name === "AbortError") return;
        copyLink();
      });
  }

  function renderShare() {
    return section("share", L.shareTitle, [
      h("div", { class: "share" }, [
        h("button", { type: "button", class: "btn btn--primary", text: L.shareButton, onclick: onShare }),
      ]),
    ]);
  }

  /* ---------- 9. 푸터 ---------- */
  function renderFooter() {
    return h("footer", { class: "footer" }, [
      h("p", { class: "footer__thanks", text: C.footer }),
      h("p", { text: C.couple.groom.name + " · " + C.couple.bride.name }),
    ]);
  }

  /* ---------- 배경음악 토글 (src가 있을 때만, 기본 OFF) ---------- */
  function renderBgm() {
    if (!C.bgm || !C.bgm.src) return [];

    var audio = h("audio", { src: C.bgm.src, loop: true, preload: "none" });
    var btn = h("button", { type: "button", class: "bgm", "aria-pressed": "false", text: L.bgmOff });

    function setOn(on) {
      btn.setAttribute("aria-pressed", String(on));
      btn.textContent = on ? L.bgmOn : L.bgmOff;
    }

    btn.addEventListener("click", function () {
      if (audio.paused) {
        audio.play().then(
          function () { setOn(true); },
          function () { toast(L.bgmError); }
        );
      } else {
        audio.pause();
        setOn(false);
      }
    });

    return [audio, btn];
  }

  /* ---------- 조립 ---------- */
  /* JSON 파일 읽기. 실패(파일 없음, file:// 등)하면 null */
  function loadJSON(url) {
    if (!url) return Promise.resolve(null);
    return fetch(url, { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .catch(function () { return null; });
  }

  function render() {
    var wd = isYMD(C.wedding.date) ? parseYMD(C.wedding.date) : null;

    [
      renderCover(wd),
      renderGreeting(),
      renderNotice(),
      renderCalendar(wd),
      renderGallery(),
      renderAccounts(),
      renderContact(),
      renderShare(),
      renderFooter(),
    ]
      .concat(renderBgm())
      .forEach(function (node) {
        if (node) app.appendChild(node);
      });
  }

  Promise.all([
    loadJSON(C.galleryFile),
    C.showAccounts ? loadJSON(C.accountsFile) : Promise.resolve(null),
  ]).then(function (data) {
    gallery = Array.isArray(data[0]) ? data[0] : [];
    C.accounts = data[1] || { groom: [], bride: [] };
    render();
  });
})();
