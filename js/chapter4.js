const artViews = [...document.querySelectorAll('#chapter4 .art-view')];
const artTransition = document.getElementById('artTransition');
const artMap = {lobby:'artLobby',gallery:'artGallery',canvas:'artCanvasRoom',puzzle:'artPuzzleRoom',perspective:'artPerspectiveRoom',final:'artFinalRoom',letter:'artLetterRoom'};
function artGo(name, animate=true){const show=()=>{artViews.forEach(v=>v.classList.toggle('active',v.id===artMap[name]));window.scrollTo({top:0,behavior:'auto'});if(name==='puzzle') buildPuzzle();};if(!animate){show();return;}artTransition?.classList.remove('paint-swipe');void artTransition?.offsetWidth;artTransition?.classList.add('paint-swipe');setTimeout(show,390);setTimeout(()=>artTransition?.classList.remove('paint-swipe'),850)}
// Navegación robusta del museo: delegación de eventos para que funcione incluso
// si el capítulo se activa después de cargar la página.
const chapterFour = document.getElementById('chapter4');
chapterFour?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-art-go]');
  if (!button || !chapterFour.contains(button)) return;
  event.preventDefault();
  event.stopPropagation();
  const destination = button.getAttribute('data-art-go');
  if (destination && artMap[destination]) artGo(destination);
});
window.resetChapterFour=()=>{artGo('lobby',false);clearCanvas();const s=document.getElementById('perspectiveSlider');if(s){s.value=0;updatePerspective(0)}};

const canvas=document.getElementById('loveCanvas'),ctx=canvas?.getContext('2d');let paint='#ef476f',drawing=false,last=null;
function canvasPoint(e){const r=canvas.getBoundingClientRect(),t=e.touches?.[0]||e;return{x:(t.clientX-r.left)*canvas.width/r.width,y:(t.clientY-r.top)*canvas.height/r.height}}
function startDraw(e){drawing=true;last=canvasPoint(e);e.preventDefault()} function moveDraw(e){if(!drawing)return;const p=canvasPoint(e);ctx.strokeStyle=paint;ctx.lineWidth=14;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p;e.preventDefault()} function endDraw(){drawing=false;last=null}
if(canvas){['pointerdown'].forEach(x=>canvas.addEventListener(x,startDraw));canvas.addEventListener('pointermove',moveDraw);window.addEventListener('pointerup',endDraw)}
document.querySelectorAll('[data-paint]').forEach((b,i)=>{if(i===0)b.classList.add('selected');b.addEventListener('click',()=>{paint=b.dataset.paint;document.querySelectorAll('[data-paint]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')})});
function clearCanvas(){if(ctx){ctx.clearRect(0,0,canvas.width,canvas.height)}}document.getElementById('clearLoveCanvas')?.addEventListener('click',clearCanvas);

const puzzle=document.getElementById('artPuzzle'),status=document.getElementById('puzzleStatus'),puzzleContinue=document.getElementById('puzzleContinue');let order=[],selected=null;
function shuffled(){let a=[0,1,2,3,4,5,6,7,8];do{a.sort(()=>Math.random()-.5)}while(a.every((v,i)=>v===i));return a}
function buildPuzzle(){if(!puzzle)return;order=shuffled();selected=null;renderPuzzle()}
function renderPuzzle(){puzzle.innerHTML='';order.forEach((piece,pos)=>{const b=document.createElement('button');b.className='puzzle-piece';b.type='button';b.dataset.pos=pos;b.style.backgroundPosition=`${(piece%3)*50}% ${Math.floor(piece/3)*50}%`;b.setAttribute('aria-label',`Pieza ${pos+1}`);b.addEventListener('click',()=>pickPiece(pos,b));puzzle.appendChild(b)});const wrong=order.filter((v,i)=>v!==i).length;if(status)status.textContent=wrong?`Piezas fuera de lugar: ${wrong}`:'Obra restaurada. ♡';if(puzzleContinue)puzzleContinue.disabled=wrong!==0}
function pickPiece(pos,el){if(selected===null){selected=pos;el.classList.add('selected');return}if(selected===pos){selected=null;el.classList.remove('selected');return}[order[selected],order[pos]]=[order[pos],order[selected]];selected=null;renderPuzzle()}

const slider=document.getElementById('perspectiveSlider'),cover=document.getElementById('abstractCover');function updatePerspective(v){if(cover)cover.style.opacity=String(1-(Number(v)/100)*.96)}slider?.addEventListener('input',e=>updatePerspective(e.target.value));
