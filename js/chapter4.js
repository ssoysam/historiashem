const artViews=[...document.querySelectorAll('#chapter4 .art-view')];
const artTransition=document.getElementById('artTransition');
const artMap={lobby:'artLobby',gallery:'artGallery',studio:'artStudioRoom',restore:'artRestoreRoom',styles:'artStylesRoom',perspective:'artPerspectiveRoom',final:'artFinalRoom',letter:'artLetterRoom'};
function artGo(name,animate=true){const show=()=>{artViews.forEach(v=>v.classList.toggle('active',v.id===artMap[name]));window.scrollTo({top:0,behavior:'auto'});if(name==='restore')initRestore();if(name==='perspective')resetPerspective();if(name==='final')resetFinal();};if(!animate){show();return;}artTransition?.classList.remove('paint-swipe');void artTransition?.offsetWidth;artTransition?.classList.add('paint-swipe');setTimeout(show,430);setTimeout(()=>artTransition?.classList.remove('paint-swipe'),900)}
const chapterFour=document.getElementById('chapter4');
chapterFour?.addEventListener('click',e=>{const b=e.target.closest('[data-art-go]');if(!b||b.disabled)return;e.preventDefault();const d=b.dataset.artGo;if(artMap[d])artGo(d)});
window.resetChapterFour=()=>{artGo('lobby',false);clearLoveCanvas();resetPerspective();resetFinal()};

// Entrada: pincelada siguiendo el dedo
const brush=document.getElementById('brushStart'),brushCanvas=document.getElementById('brushStartCanvas'),bctx=brushCanvas?.getContext('2d');let brushing=false,brushLast=null,brushDistance=0;
function brushPoint(e){const r=brushCanvas.getBoundingClientRect();return{x:(e.clientX-r.left)*brushCanvas.width/r.width,y:(e.clientY-r.top)*brushCanvas.height/r.height}}
function brushDown(e){brushing=true;brushLast=brushPoint(e);brushDistance=0;brush?.setPointerCapture?.(e.pointerId)}
function brushMove(e){if(!brushing||!bctx)return;const p=brushPoint(e),dx=p.x-brushLast.x,dy=p.y-brushLast.y;brushDistance+=Math.hypot(dx,dy);const g=bctx.createLinearGradient(0,0,brushCanvas.width,0);g.addColorStop(0,'#ef476f');g.addColorStop(.25,'#ffd166');g.addColorStop(.5,'#06d6a0');g.addColorStop(.75,'#118ab2');g.addColorStop(1,'#7b2cbf');bctx.strokeStyle=g;bctx.lineWidth=70;bctx.lineCap='round';bctx.beginPath();bctx.moveTo(brushLast.x,brushLast.y);bctx.lineTo(p.x,p.y);bctx.stroke();brushLast=p;if(brushDistance>brushCanvas.width*.62){brushing=false;brush.classList.add('done');setTimeout(()=>artGo('gallery'),180)}}
brush?.addEventListener('pointerdown',brushDown);brush?.addEventListener('pointermove',brushMove);brush?.addEventListener('pointerup',()=>brushing=false);brush?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();artGo('gallery')}});

// Galería viva
const modal=document.getElementById('artModal'),modalCard=modal?.querySelector('.modal-card'),modalTitle=document.getElementById('modalTitle'),modalMeta=document.getElementById('modalMeta'),modalCopy=document.getElementById('modalCopy'),modalSecret=document.getElementById('modalSecret');
function openPiece(piece,secret=false){if(!modal)return;modalTitle.textContent=piece.dataset.title||'';modalMeta.textContent=piece.dataset.meta||'';modalCopy.textContent=piece.dataset.copy||'';modalSecret.textContent=piece.dataset.secret||'';modalCard.classList.toggle('show-secret',secret);modal.classList.add('open');modal.setAttribute('aria-hidden','false')}
document.querySelectorAll('.living-piece').forEach(piece=>{let timer,moved=false;piece.addEventListener('pointerdown',()=>{moved=false;timer=setTimeout(()=>openPiece(piece,true),650)});piece.addEventListener('pointermove',()=>{moved=true;clearTimeout(timer)});piece.addEventListener('pointerup',e=>{clearTimeout(timer);if(!moved&&!e.target.closest('.straighten'))openPiece(piece,false)});piece.addEventListener('pointercancel',()=>clearTimeout(timer))});
document.getElementById('closeArtModal')?.addEventListener('click',()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true')});modal?.addEventListener('click',e=>{if(e.target===modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}});
document.querySelector('.straighten')?.addEventListener('click',e=>{e.stopPropagation();document.getElementById('crookedPiece')?.classList.add('fixed');e.currentTarget.textContent='Perfecto. ♡'});
document.getElementById('paperTab')?.addEventListener('click',()=>document.getElementById('hiddenNote')?.classList.toggle('show'));

// Estudio / pintura
const loveCanvasEl=document.getElementById('loveCanvas'),loveCtx=loveCanvasEl?.getContext('2d');let paint='#ef476f',drawing=false,last=null,strokeDistance=0;
function canvasPoint(e){const r=loveCanvasEl.getBoundingClientRect();return{x:(e.clientX-r.left)*loveCanvasEl.width/r.width,y:(e.clientY-r.top)*loveCanvasEl.height/r.height}}
function startDraw(e){drawing=true;last=canvasPoint(e);loveCanvasEl.setPointerCapture?.(e.pointerId);e.preventDefault()}
function moveDraw(e){if(!drawing||!loveCtx)return;const p=canvasPoint(e);strokeDistance+=Math.hypot(p.x-last.x,p.y-last.y);loveCtx.strokeStyle=paint;loveCtx.globalAlpha=.82;loveCtx.lineWidth=18+Math.random()*8;loveCtx.lineCap='round';loveCtx.lineJoin='round';loveCtx.beginPath();loveCtx.moveTo(last.x,last.y);loveCtx.lineTo(p.x,p.y);loveCtx.stroke();loveCtx.globalAlpha=1;last=p;if(strokeDistance>850)document.querySelector('.canvas-secrets')?.classList.add('revealed');e.preventDefault()}
function endDraw(){drawing=false;last=null}
if(loveCanvasEl){loveCanvasEl.addEventListener('pointerdown',startDraw);loveCanvasEl.addEventListener('pointermove',moveDraw);loveCanvasEl.addEventListener('pointerup',endDraw);loveCanvasEl.addEventListener('pointercancel',endDraw)}
document.querySelectorAll('[data-paint]').forEach((b,i)=>{if(i===0)b.classList.add('selected');b.addEventListener('click',()=>{paint=b.dataset.paint;document.querySelectorAll('[data-paint]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')})});
function clearLoveCanvas(){if(loveCtx){loveCtx.clearRect(0,0,loveCanvasEl.width,loveCanvasEl.height);strokeDistance=0;document.querySelector('.canvas-secrets')?.classList.remove('revealed')}}document.getElementById('clearLoveCanvas')?.addEventListener('click',clearLoveCanvas);
document.getElementById('saveLoveCanvas')?.addEventListener('click',()=>{if(!loveCanvasEl)return;const a=document.createElement('a');a.download='obra-de-chiqui.png';a.href=loveCanvasEl.toDataURL('image/png');a.click()});

// Restauración táctil
const restoreCanvas=document.getElementById('restoreCanvas'),rctx=restoreCanvas?.getContext('2d'),restoreContinue=document.getElementById('restoreContinue'),restoreProgress=document.getElementById('restoreProgress'),restoreMsg=document.getElementById('restoredMessage'),restoreHint=document.getElementById('restoreHint');let restoring=false,restoreMoves=0,restoreReady=false;
function initRestore(){if(!rctx||restoreReady)return;const w=restoreCanvas.width,h=restoreCanvas.height;rctx.globalCompositeOperation='source-over';rctx.fillStyle='#c7b69b';rctx.fillRect(0,0,w,h);for(let i=0;i<80;i++){rctx.strokeStyle=i%3===0?'#8b6f55':'#d9cbb4';rctx.globalAlpha=.25+Math.random()*.35;rctx.lineWidth=5+Math.random()*24;rctx.beginPath();rctx.moveTo(Math.random()*w,Math.random()*h);rctx.bezierCurveTo(Math.random()*w,Math.random()*h,Math.random()*w,Math.random()*h,Math.random()*w,Math.random()*h);rctx.stroke()}rctx.globalAlpha=1;restoreReady=true}
function restorePoint(e){const r=restoreCanvas.getBoundingClientRect();return{x:(e.clientX-r.left)*restoreCanvas.width/r.width,y:(e.clientY-r.top)*restoreCanvas.height/r.height}}
function eraseAt(e){if(!restoring||!rctx)return;const p=restorePoint(e);rctx.globalCompositeOperation='destination-out';rctx.beginPath();rctx.arc(p.x,p.y,65,0,Math.PI*2);rctx.fill();restoreMoves++;restoreHint.style.opacity='0';const pct=Math.min(100,Math.round(restoreMoves/1.35));restoreProgress.textContent=`Restauración: ${pct}%`;if(pct>=70){restoreContinue.disabled=false;restoreMsg.classList.add('show');restoreProgress.textContent='Restauración completada. ♡'}}
restoreCanvas?.addEventListener('pointerdown',e=>{restoring=true;restoreCanvas.setPointerCapture?.(e.pointerId);eraseAt(e)});restoreCanvas?.addEventListener('pointermove',eraseAt);restoreCanvas?.addEventListener('pointerup',()=>restoring=false);restoreCanvas?.addEventListener('pointercancel',()=>restoring=false);

// Filtros artísticos
const styleImage=document.getElementById('styleImage'),styleCaption=document.getElementById('styleCaption');const captions={oil:'Óleo · colores intensos, bordes suaves.',water:'Acuarela · ligera, luminosa e imperfecta.',charcoal:'Carboncillo · contraste, sombra y trazo.',collage:'Collage · un poquito caótico. Como debe ser.'};
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{const f=b.dataset.filter;styleImage.className=f;styleCaption.textContent=captions[f];document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('selected',x===b))}));styleImage?.classList.add('oil');

// Perspectiva: deslizar hasta el punto correcto
const stage=document.getElementById('perspectiveStage'),perspectiveContinue=document.getElementById('perspectiveContinue'),perspectiveInstruction=document.getElementById('perspectiveInstruction');let stageDrag=false;
function updatePerspectiveFromEvent(e){if(!stageDrag||!stage)return;const r=stage.getBoundingClientRect(),n=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),distance=Math.abs(n-.68);stage.querySelectorAll('.perspective-shape').forEach((s,i)=>{const mult=(i%2?1:-1)*(distance*220);s.style.transform=`translateX(${mult}px) rotate(${(i-2)*10*distance}deg)`});if(distance<.055){stage.classList.add('solved');perspectiveContinue.disabled=false;perspectiveInstruction.textContent='PERSPECTIVA ENCONTRADA ♡';stageDrag=false}}
function resetPerspective(){if(!stage)return;stage.classList.remove('solved');perspectiveContinue.disabled=true;perspectiveInstruction.textContent='DESLIZA AQUÍ ↔';stage.querySelectorAll('.perspective-shape').forEach(s=>s.style.transform='')}
stage?.addEventListener('pointerdown',e=>{stageDrag=true;stage.setPointerCapture?.(e.pointerId);updatePerspectiveFromEvent(e)});stage?.addEventListener('pointermove',updatePerspectiveFromEvent);stage?.addEventListener('pointerup',()=>stageDrag=false);

// Obra final: acercarse con tres toques
const finalFrame=document.getElementById('finalFrame'),finalReveal=document.getElementById('finalReveal'),curatorButton=document.getElementById('curatorButton'),finalInstruction=document.getElementById('finalInstruction');let finalZoom=0;
function resetFinal(){finalZoom=0;finalFrame?.classList.remove('zoom1','zoom2','zoom3');finalReveal?.classList.remove('show');curatorButton?.classList.remove('ready');if(finalInstruction)finalInstruction.textContent='Toca la obra para acercarte.'}
finalFrame?.addEventListener('click',()=>{finalZoom=Math.min(3,finalZoom+1);finalFrame.classList.remove('zoom1','zoom2','zoom3');finalFrame.classList.add(`zoom${finalZoom}`);if(finalZoom===1)finalInstruction.textContent='Un poquito más cerca…';if(finalZoom===2)finalInstruction.textContent='Todavía más…';if(finalZoom===3){finalInstruction.textContent='Ahí está.';finalReveal.classList.add('show');curatorButton.classList.add('ready')}});

// V4 — guards for touch interactions on phones
['pointerup','pointercancel'].forEach(type=>window.addEventListener(type,()=>{brushing=false;drawing=false;restoring=false;stageDrag=false},{passive:true}));
// If a modal is open, only the modal should consume the gesture; closing restores normal page scroll.
if(artModal){artModal.addEventListener('touchmove',()=>{}, {passive:true});}
