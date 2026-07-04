const screens = {
  cover: document.getElementById("cover"),
  home: document.getElementById("home"),
  chapter: document.getElementById("chapter"),
  roulette: document.getElementById("roulette"),
};

const enterBtn = document.getElementById("enterBtn");
const openChapterOne = document.getElementById("openChapterOne");
const openRouletteBtn = document.getElementById("openRouletteBtn");
const backHomeFromChapter = document.getElementById("backHomeFromChapter");
const backHomeFromRoulette = document.getElementById("backHomeFromRoulette");

const nextPageBtn = document.getElementById("nextPageBtn");
const prevPageBtn = document.getElementById("prevPageBtn");
const pageOne = document.getElementById("pageOne");
const pageTwo = document.getElementById("pageTwo");

function goToScreen(current, next) {
  current.style.opacity = "0";

  setTimeout(() => {
    current.classList.remove("active");
    current.style.opacity = "";
    next.classList.add("active");
    window.scrollTo(0, 0);

    if (next === screens.roulette && typeof drawWheel === "function") {
      drawWheel();
    }
  }, 650);
}

enterBtn.addEventListener("click", () => goToScreen(screens.cover, screens.home));

openChapterOne.addEventListener("click", () => {
  pageOne.classList.add("active-page");
  pageTwo.classList.remove("active-page");
  goToScreen(screens.home, screens.chapter);
});

openRouletteBtn.addEventListener("click", () => goToScreen(screens.home, screens.roulette));
backHomeFromChapter.addEventListener("click", () => goToScreen(screens.chapter, screens.home));
backHomeFromRoulette.addEventListener("click", () => goToScreen(screens.roulette, screens.home));

nextPageBtn.addEventListener("click", () => {
  pageOne.classList.remove("active-page");
  pageTwo.classList.add("active-page");
  window.scrollTo(0, 0);
});

prevPageBtn.addEventListener("click", () => {
  pageTwo.classList.remove("active-page");
  pageOne.classList.add("active-page");
  window.scrollTo(0, 0);
});
