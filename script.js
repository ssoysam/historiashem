const cover = document.getElementById("cover");
const chapter = document.getElementById("chapter");

const enterBtn = document.getElementById("enterBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const restartBtn = document.getElementById("restartBtn");

const pageOne = document.getElementById("pageOne");
const pageTwo = document.getElementById("pageTwo");

function goToScreen(current, next) {
  current.style.opacity = "0";

  setTimeout(() => {
    current.classList.remove("active");
    current.style.opacity = "";
    next.classList.add("active");
    window.scrollTo(0, 0);
  }, 650);
}

enterBtn.addEventListener("click", () => {
  goToScreen(cover, chapter);
});

nextPageBtn.addEventListener("click", () => {
  pageOne.classList.remove("active-page");
  pageTwo.classList.add("active-page");
  window.scrollTo(0, 0);
});

restartBtn.addEventListener("click", () => {
  pageTwo.classList.remove("active-page");
  pageOne.classList.add("active-page");
  goToScreen(chapter, cover);
});
