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

function goToScreen(current, next) {
  if (!current || !next || current === next || transitionInProgress) return;

  transitionInProgress = true;
  current.style.opacity = "0";

  window.setTimeout(() => {
    current.classList.remove("active");
    current.style.opacity = "";
    next.classList.add("active");

    if (next === screens.chapter2) {
      next.scrollTop = 0;
      next.dispatchEvent(new Event("scroll"));
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    if (next === screens.roulette && typeof drawWheel === "function") {
      drawWheel();
    }

    transitionInProgress = false;
  }, 650);
}

enterBtn?.addEventListener("click", () => goToScreen(screens.cover, screens.home));

openChapterOne?.addEventListener("click", () => {
  pageOne?.classList.add("active-page");
  pageTwo?.classList.remove("active-page");
  goToScreen(screens.home, screens.chapter);
});

openChapterTwo?.addEventListener("click", () => {
  goToScreen(screens.home, screens.chapter2);
});

openRouletteBtn?.addEventListener("click", () => {
  goToScreen(screens.home, screens.roulette);
});

backHomeFromChapter?.addEventListener("click", () => {
  goToScreen(screens.chapter, screens.home);
});

backHomeFromChapterTwo?.addEventListener("click", () => {
  goToScreen(screens.chapter2, screens.home);
});

backHomeFromRoulette?.addEventListener("click", () => {
  goToScreen(screens.roulette, screens.home);
});

nextPageBtn?.addEventListener("click", () => {
  pageOne?.classList.remove("active-page");
  pageTwo?.classList.add("active-page");
  window.scrollTo({ top: 0, behavior: "auto" });
});

prevPageBtn?.addEventListener("click", () => {
  pageTwo?.classList.remove("active-page");
  pageOne?.classList.add("active-page");
  window.scrollTo({ top: 0, behavior: "auto" });
});
