const screens = {
  cover: document.getElementById("cover"),
  home: document.getElementById("home"),
  chapter: document.getElementById("chapter"),
  chapter2: document.getElementById("chapter2"),
  roulette: document.getElementById("roulette"),
};

const enterBtn = document.getElementById("enterBtn");
const openChapterOne = document.getElementById("openChapterOne");
const openChapterTwo = document.getElementById("openChapterTwo");
const openRouletteBtn = document.getElementById("openRouletteBtn");
const backHomeFromChapter = document.getElementById("backHomeFromChapter");
const backHomeFromChapterTwo = document.getElementById("backHomeFromChapterTwo");
const backHomeFromRoulette = document.getElementById("backHomeFromRoulette");

const nextPageBtn = document.getElementById("nextPageBtn");
const prevPageBtn = document.getElementById("prevPageBtn");
const pageOne = document.getElementById("pageOne");
const pageTwo = document.getElementById("pageTwo");

let transitionInProgress = false;
let transitionTimer = null;

function goToScreen(current, next) {
  if (!current || !next || current === next) return;

  if (transitionTimer) window.clearTimeout(transitionTimer);
  transitionInProgress = true;
  current.style.opacity = "0";

  transitionTimer = window.setTimeout(() => {
    current.classList.remove("active");
    current.style.opacity = "";
    next.classList.add("active");
    next.style.opacity = "1";

    if (next === screens.chapter2) {
      next.scrollTop = 0;
      next.dispatchEvent(new Event("scroll"));
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    if (next === screens.roulette && typeof drawWheel === "function") {
      drawWheel();
    }

    requestAnimationFrame(() => {
      next.style.opacity = "";
      transitionInProgress = false;
    });
  }, 420);
}

function bindClick(element, handler) {
  if (!element) return;
  element.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!transitionInProgress) handler();
  });
}

bindClick(enterBtn, () => goToScreen(screens.cover, screens.home));

bindClick(openChapterOne, () => {
  pageOne?.classList.add("active-page");
  pageTwo?.classList.remove("active-page");
  goToScreen(screens.home, screens.chapter);
});

bindClick(openChapterTwo, () => {
  goToScreen(screens.home, screens.chapter2);
});

bindClick(openRouletteBtn, () => {
  goToScreen(screens.home, screens.roulette);
});

bindClick(backHomeFromChapter, () => {
  goToScreen(screens.chapter, screens.home);
});

bindClick(backHomeFromChapterTwo, () => {
  goToScreen(screens.chapter2, screens.home);
});

bindClick(backHomeFromRoulette, () => {
  goToScreen(screens.roulette, screens.home);
});

bindClick(nextPageBtn, () => {
  pageOne?.classList.remove("active-page");
  pageTwo?.classList.add("active-page");
  window.scrollTo({ top: 0, behavior: "auto" });
});

bindClick(prevPageBtn, () => {
  pageTwo?.classList.remove("active-page");
  pageOne?.classList.add("active-page");
  window.scrollTo({ top: 0, behavior: "auto" });
});
