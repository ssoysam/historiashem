const memoryStage = document.getElementById("memoryStage");
const openMemories = document.getElementById("openMemories");
const closeMemories = document.getElementById("closeMemories");

const vintageIntro = document.getElementById("vintageIntro");
const typewriterStage = document.getElementById("typewriterStage");
const openTypewriter = document.getElementById("openTypewriter");
const closeTypewriter = document.getElementById("closeTypewriter");
const typewriterSkip = document.getElementById("typewriterSkip");
const typedLetter = document.getElementById("typedLetter");
const letterFallback = document.getElementById("letterFallback");
const typewriterPaper = document.getElementById("typewriterPaper");

const chapterThreeLetter = `Para Lupita:\n\nÚltimamente tengo un pequeño problema contigo.\n\nSiento que se me están acabando las palabras.\n\nTe he dicho que te amo, que eres hermosa, preciosa, increíble, maravillosa… hasta llegué al punto de llamarte patrimonio de la humanidad y fenómeno intergaláctico JAJAJA.\n\nY aun así, siento que ninguna termina de explicar lo que quiero decir.\n\nQuizá porque estos tres meses me han enseñado que amarte ya no cabe solamente en palabras.\n\nTambién está en verte conseguir algo por lo que te esforzaste y sentirme orgulloso de ti. En descubrir lugares juntos, perdernos por algún caminito, terminar cansadísimos después de una aventura o simplemente sentarnos a ver una película.\n\nEstá en saber que puedo acudir a ti cuando algo no va bien y encontrarte a mi lado.\n\nY está también en esos momentos mucho más nuestros, donde me permites acercarme a ti, confiar en mí para acompañarte en experiencias que también son nuevas para ti. No sabes lo especial que me hace sentir que hayas elegido compartirlas conmigo.\n\nTal vez por eso me gusta tanto que este capítulo sea vintage.\n\nPorque algún día todo esto lo será.\n\nNuestras fotos envejecerán. Los boletos que guardemos se volverán recuerdos. Las aventuras de estos meses serán historias que contaremos empezando con un “¿te acuerdas cuando…?”\n\nY esta carta será una pequeña fotografía de cómo me sentía cuando apenas llevábamos tres meses.\n\nAsí que quiero dejar algo escrito para ese Samuel y esa Lupita del futuro:\n\nNo encontré la palabra que viene después de “te amo”.\n\nPero sí descubrí qué viene después de decirlo:\n\nvivirlo contigo.\n\nY eso es exactamente lo que quiero seguir haciendo mientras pase el tiempo.\n\nCon amor,\nSamuel\n\nCapítulo III — Tres meses contigo.`;

let typingTimer = null;
let typingIndex = 0;
let typingActive = false;

function scrollPaperToBottom() {
  if (!typewriterPaper) return;
  typewriterPaper.scrollTop = typewriterPaper.scrollHeight;
}

function stopTyping() {
  typingActive = false;
  if (typingTimer) window.clearTimeout(typingTimer);
  typingTimer = null;
}

function finishLetter() {
  stopTyping();
  typedLetter?.classList.add("hidden");
  typedLetter?.classList.remove("done");
  letterFallback?.classList.add("show");
  if (typewriterSkip) typewriterSkip.style.display = "none";
  window.setTimeout(scrollPaperToBottom, 20);
}

function typeNextCharacter() {
  if (!typingActive || !typedLetter) return;
  if (typingIndex >= chapterThreeLetter.length) {
    typedLetter.classList.add("done");
    typingActive = false;
    if (typewriterSkip) typewriterSkip.textContent = "Carta terminada";
    return;
  }

  const char = chapterThreeLetter.charAt(typingIndex++);
  typedLetter.textContent += char;

  if (typingIndex % 7 === 0 || char === "\n") scrollPaperToBottom();

  let delay = 20;
  if (char === "." || char === "…" || char === "?" || char === "!") delay = 180;
  else if (char === "," || char === ":" || char === ";") delay = 80;
  else if (char === "\n") delay = 110;
  else delay += Math.random() * 25;

  typingTimer = window.setTimeout(typeNextCharacter, delay);
}

function startLetter() {
  stopTyping();
  typingIndex = 0;
  if (typedLetter) {
    typedLetter.textContent = "";
    typedLetter.classList.remove("hidden", "done");
  }
  letterFallback?.classList.remove("show");
  if (typewriterSkip) {
    typewriterSkip.style.display = "inline-block";
    typewriterSkip.textContent = "Mostrar carta completa";
  }
  if (typewriterPaper) typewriterPaper.scrollTop = 0;
  typingActive = true;
  typeNextCharacter();
}

function openChapterThreeLetter() {
  vintageIntro?.setAttribute("hidden", "");
  typewriterStage?.classList.add("active");
  typewriterStage?.setAttribute("aria-hidden", "false");
  startLetter();
}

function resetChapterThree() {
  stopTyping();
  memoryStage?.classList.remove("active");
  memoryStage?.setAttribute("aria-hidden", "true");
  vintageIntro?.removeAttribute("hidden");
  typewriterStage?.classList.remove("active");
  typewriterStage?.setAttribute("aria-hidden", "true");
  if (typedLetter) typedLetter.textContent = "";
  letterFallback?.classList.remove("show");
  if (typewriterPaper) typewriterPaper.scrollTop = 0;
}

openTypewriter?.addEventListener("click", openChapterThreeLetter);
typewriterSkip?.addEventListener("click", finishLetter);
closeTypewriter?.addEventListener("click", resetChapterThree);

window.resetChapterThree = resetChapterThree;
\n\nfunction openChapterThreeMemories(){\n  stopTyping();\n  vintageIntro?.setAttribute("hidden", "");\n  typewriterStage?.classList.remove("active");\n  typewriterStage?.setAttribute("aria-hidden", "true");\n  memoryStage?.classList.add("active");\n  memoryStage?.setAttribute("aria-hidden", "false");\n  window.scrollTo({top:0, behavior:"smooth"});\n}\nfunction closeChapterThreeMemories(){\n  memoryStage?.classList.remove("active");\n  memoryStage?.setAttribute("aria-hidden", "true");\n  document.querySelectorAll("#memoryStage .memory-card.flipped").forEach(card=>card.classList.remove("flipped"));\n  vintageIntro?.removeAttribute("hidden");\n}\nopenMemories?.addEventListener("click", openChapterThreeMemories);\ncloseMemories?.addEventListener("click", closeChapterThreeMemories);\ndocument.querySelectorAll("#memoryStage .memory-card").forEach(card=>{\n  card.addEventListener("click", ()=>card.classList.toggle("flipped"));\n});\n