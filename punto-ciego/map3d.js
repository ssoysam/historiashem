(()=>{'use strict';
const $=id=>document.getElementById(id),canvas=$('map'),c=canvas.getContext('2d'),W=1100,H=650;
const DEFAULT_YAW=-.30,DEFAULT_PITCH=.91,MIN_PITCH=.72,MAX_PITCH=1.28,BASE_SCALE=1.22;
let yaw=DEFAULT_YAW,pitch=DEFAULT_PITCH,zoom=1,selected=-1,hover=-1,points=[],drag=null,clock=0,still=false;
const names=['A01','B02','C03','D04','E05'];
const locations=[[-295,-170],[-115,8],[240,-170],[290,180],[-250,185]];
let seed=72891;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647}
// Preserve the central city layout; extend the surrounding grid to keep the viewport filled.
const blocks=[];function block(ix,iz){
 const bx=ix*83,bz=iz*83;if(Math.abs(ix)===3&&iz===0||ix===0&&Math.abs(iz)===3)return;
 const park=rnd()<.12;if(park){blocks.push({x:bx-30,z:bz-30,w:60,d:60,h:0,park:true});return;}
 for(let a=0;a<2;a++)for(let b=0;b<2;b++){if(rnd()<.12)continue;let w=19+rnd()*7,d=19+rnd()*7,h=7+rnd()*28;if(rnd()<.09)h+=28+rnd()*48;blocks.push({x:bx-30+a*32,z:bz-30+b*32,w,d,h,tone:rnd()});}}
for(let iz=-5;iz<=5;iz++)for(let ix=-7;ix<=7;ix++)block(ix,iz);
for(let iz=-13;iz<=13;iz++)for(let ix=-13;ix<=13;ix++)if(Math.abs(ix)>7||Math.abs(iz)>5)block(ix,iz);
let cy=1,sy=0,cp=1,sp=0,scale=1;
function camera(){cy=Math.cos(yaw);sy=Math.sin(yaw);cp=Math.cos(pitch);sp=Math.sin(pitch);scale=BASE_SCALE*zoom;}
// Orthographic aerial camera; nearer geometry has smaller depth. Height is toward the camera.
function project(x,z,h=0){const X=x*cy-z*sy,Z=x*sy+z*cy;return [W/2+X*scale,H*.51+(Z*sp-h*cp)*scale,-Z*cp-h*sp];}
function line(a,b,color,width=1){c.beginPath();c.moveTo(...a.slice(0,2));c.lineTo(...b.slice(0,2));c.strokeStyle=color;c.lineWidth=width;c.stroke()}
const buffer=document.createElement('canvas');const BW=640,BH=378;buffer.width=BW;buffer.height=BH;const bc=buffer.getContext('2d');
const image=bc.createImageData(BW,BH),pixels=new Uint32Array(image.data.buffer),depth=new Float32Array(BW*BH);let previous='';
const rgb=(r,g,b)=>(255<<24)|(b<<16)|(g<<8)|r;
function color(hex){return rgb(parseInt(hex.slice(0,2),16),parseInt(hex.slice(2,4),16),parseInt(hex.slice(4,6),16));}
const edges=[];
function triangle(a,b,d,col){
 a=[a[0]*BW/W,a[1]*BH/H,a[2]];b=[b[0]*BW/W,b[1]*BH/H,b[2]];d=[d[0]*BW/W,d[1]*BH/H,d[2]];
 const minX=Math.max(0,Math.floor(Math.min(a[0],b[0],d[0]))),maxX=Math.min(BW-1,Math.ceil(Math.max(a[0],b[0],d[0]))),minY=Math.max(0,Math.floor(Math.min(a[1],b[1],d[1]))),maxY=Math.min(BH-1,Math.ceil(Math.max(a[1],b[1],d[1])));if(minX>maxX||minY>maxY)return;
 const ux=b[0]-a[0],uy=b[1]-a[1],vx=d[0]-a[0],vy=d[1]-a[1],det=ux*vy-uy*vx;if(Math.abs(det)<1e-6)return;
 const du=vy/det,dv=-uy/det,duy=-vx/det,dvy=ux/det,dz1=b[2]-a[2],dz2=d[2]-a[2];
 for(let y=minY;y<=maxY;y++){let u=(minX+.5-a[0])*du+(y+.5-a[1])*duy,v=(minX+.5-a[0])*dv+(y+.5-a[1])*dvy,k=y*BW+minX;for(let x=minX;x<=maxX;x++,k++,u+=du,v+=dv){if(u>=-1e-6&&v>=-1e-6&&u+v<=1.000001){let z=a[2]+u*dz1+v*dz2;if(z<depth[k]){depth[k]=z;pixels[k]=col;}}}}
}
function quad(v,col){triangle(v[0],v[1],v[2],col);triangle(v[0],v[2],v[3],col);}
function edge(a,b,col){edges.push([a,b,col]);}
function drawEdges(){for(const [aa,bb,col] of edges){const a=[aa[0]*BW/W,aa[1]*BH/H,aa[2]],b=[bb[0]*BW/W,bb[1]*BH/H,bb[2]];let n=Math.ceil(Math.max(Math.abs(a[0]-b[0]),Math.abs(a[1]-b[1])));if(!n)continue;for(let i=0;i<=n;i++){let t=i/n,x=Math.round(a[0]+(b[0]-a[0])*t),y=Math.round(a[1]+(b[1]-a[1])*t);if(x<0||x>=BW||y<0||y>=BH)continue;let z=a[2]+(b[2]-a[2])*t,k=y*BW+x;if(z<=depth[k]+.85/scale){pixels[k]=col;}}}}
function rect(x,z,w,d,h=0){return [[x,z],[x+w,z],[x+w,z+d],[x,z+d]].map(v=>project(...v,h));}
function terrain(x,z,w,d,col,h=0){quad(rect(x,z,w,d,h),col);}
function renderSoftware(){
 const key=[yaw,pitch,zoom].join('/');if(key===previous)return;previous=key;camera();pixels.fill(color('182631'));depth.fill(Infinity);edges.length=0;
 const extent=1200;terrain(-extent,-extent,extent*2,extent*2,color('192732'));
 for(let i=-14;i<=14;i++){const a=i*83-42;terrain(a,-extent,12,extent*2,color('0b151e'),.1);terrain(-extent,a,extent*2,12,color('0b151e'),.2);terrain(a+5.5,-extent,1,extent*2,color('44535e'),.3);terrain(-extent,a+5.5,extent*2,1,color('44535e'),.4);}
 terrain(-extent,-50,extent*2,16,color('0a121a'),.5);terrain(285,-extent,17,extent*2,color('0a121a'),.6);
 terrain(-extent,-42,extent*2,1,color('718797'),.7);terrain(293,-extent,1,extent*2,color('718797'),.8);
 for(const b of blocks){const center=project(b.x+b.w/2,b.z+b.d/2,b.h/2),margin=(Math.max(b.w,b.d)+b.h)*scale+8;if(center[0]<-margin||center[0]>W+margin||center[1]<-margin||center[1]>H+margin)continue;
  if(b.park){terrain(b.x,b.z,b.w,b.d,color('253b37'),1);continue;}
  const lo=rect(b.x,b.z,b.w,b.d),hi=rect(b.x,b.z,b.w,b.d,b.h);
  // All faces participate in the per-pixel depth test, not a building-level painter sort.
  for(let i=0;i<4;i++){const j=(i+1)%4;const v=[lo[i],lo[j],hi[j],hi[i]];const shade=(i===0?57:i===1?40:i===2?38:50)+Math.round(b.tone*10);quad(v,rgb(shade,shade+14,shade+24));edge(lo[i],hi[i],color('253541'));if(b.h>24){for(let h=9;h<b.h-4;h+=10){const f=h/b.h;const interp=(a,d)=>a.map((x,k)=>x+(d[k]-x)*f);edge(interp(lo[i],hi[i]),interp(lo[j],hi[j]),rgb(shade+6,shade+19,shade+28));}}}
  const sh=Math.round(75+b.tone*30);quad(hi,rgb(sh,sh+14,sh+24));for(let i=0;i<4;i++)edge(hi[i],hi[(i+1)%4],color('647b8a'));
  if(b.h>40){const x=b.x+5,z=b.z+5;quad(rect(x,z,8,8,b.h+.2),color('364956'));}
 }
 drawEdges();bc.putImageData(image,0,0);
}

// Static GPU geometry: only the camera uniforms change during interaction.
function createGPU(){
 const surface=document.createElement('canvas');surface.width=W;surface.height=H;
 let gl;try{gl=surface.getContext('webgl',{alpha:false,antialias:true,depth:true,preserveDrawingBuffer:true,failIfMajorPerformanceCaveat:true});}catch{}if(!gl)return null;
 const vertex=`attribute vec3 pos;attribute vec3 shade;uniform vec4 cam;uniform float mag;varying vec3 ink;void main(){float X=pos.x*cam.x-pos.y*cam.y;float Z=pos.x*cam.y+pos.y*cam.x;float d=-Z*cam.z-pos.z*cam.w;gl_Position=vec4(X*mag/550.0,-(Z*cam.w-pos.z*cam.z)*mag/325.0-0.02,d/2500.0,1.0);ink=shade;}`;
 const fragment=`precision mediump float;varying vec3 ink;void main(){gl_FragColor=vec4(ink,1.0);}`;
 function shader(type,source){const v=gl.createShader(type);gl.shaderSource(v,source);gl.compileShader(v);if(!gl.getShaderParameter(v,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(v));return v;}
 try{
 const prog=gl.createProgram();gl.attachShader(prog,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS))return null;gl.useProgram(prog);
 const data=[];function vert(v,col){data.push(...v,...col.map(n=>n/255));}function q(v,col){for(const i of [0,1,2,0,2,3])vert(v[i],col);}function r(x,z,w,d,h,col){q([[x,z,h],[x+w,z,h],[x+w,z+d,h],[x,z+d,h]],col);}
 const ext=1200;r(-ext,-ext,ext*2,ext*2,0,[25,39,50]);
 for(let i=-14;i<=14;i++){const a=i*83-42;r(a,-ext,12,ext*2,.12,[11,21,30]);r(-ext,a,ext*2,12,.24,[11,21,30]);r(a+5.5,-ext,1,ext*2,.36,[66,82,94]);r(-ext,a+5.5,ext*2,1,.48,[66,82,94]);}
 r(-ext,-50,ext*2,16,.6,[10,18,26]);r(285,-ext,17,ext*2,.72,[10,18,26]);r(-ext,-42,ext*2,1,.84,[100,121,137]);r(293,-ext,1,ext*2,.96,[100,121,137]);
 for(const b of blocks){if(b.park){r(b.x,b.z,b.w,b.d,1.2,[37,59,55]);continue;}
 const lo=[[b.x,b.z,0],[b.x+b.w,b.z,0],[b.x+b.w,b.z+b.d,0],[b.x,b.z+b.d,0]],hi=lo.map(v=>[v[0],v[1],b.h]);
 for(let i=0;i<4;i++){const j=(i+1)%4,sh=(i===0?57:i===1?40:i===2?38:50)+Math.round(b.tone*10);q([lo[i],lo[j],hi[j],hi[i]],[sh,sh+14,sh+24]);}
 const sh=Math.round(75+b.tone*30);q(hi,[sh,sh+14,sh+24]);if(b.h>40)r(b.x+5,b.z+5,8,8,b.h+.25,[54,73,86]);
 }
 const vbo=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vbo);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
 for(const [name,offset] of [['pos',0],['shade',12]]){const loc=gl.getAttribLocation(prog,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,24,offset);}
 const cam=gl.getUniformLocation(prog,'cam'),mag=gl.getUniformLocation(prog,'mag'),count=data.length/6;gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.clearColor(.098,.153,.196,1);
 return {surface,valid:()=>!gl.isContextLost(),render(){if(gl.isContextLost())return false;gl.viewport(0,0,W,H);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform4f(cam,cy,sy,cp,sp);gl.uniform1f(mag,scale);gl.drawArrays(gl.TRIANGLES,0,count);return true;}};
 }catch{return null;}
}
let gpu=createGPU(),gpuKey='',cityFrame=null;
function renderCity(){
 const key=[yaw,pitch,zoom].join('/');if(key===gpuKey&&cityFrame&&(!gpu||gpu.valid()))return cityFrame;
 camera();if(gpu&&gpu.render()){cityFrame=gpu.surface;gpuKey=key;return cityFrame;}
 gpu=null;renderSoftware();cityFrame=buffer;gpuKey=key;return cityFrame;
}
let lastDrawKey='',lastDrawTime=-1;
function draw(t=clock,paused=still){clock=t;still=paused;const key=[yaw,pitch,zoom,selected,hover,window.PC_CASE.getStage(),paused].join('/');if(key===lastDrawKey&&(!gpu||gpu.valid())&&(paused||Math.abs(t-lastDrawTime)<.14))return;lastDrawKey=key;lastDrawTime=t;const frame=renderCity();c.drawImage(frame,0,0,W,H); 
 // Edge shading strengthens the aerial image without introducing a blank border.
 const vignette=c.createRadialGradient(W/2,H/2,H*.28,W/2,H/2,W*.62);vignette.addColorStop(0,'#0000');vignette.addColorStop(1,'#03070c66');c.fillStyle=vignette;c.fillRect(0,0,W,H);
 const stage=Math.min(window.PC_CASE.getStage(),4);points=[];
 for(let i=0;i<locations.length;i++){let [x,z]=locations[i],base=project(x,z,0),top=project(x,z,73);points.push(top);if(top[0]<0||top[0]>W||top[1]<0||top[1]>H)continue;let active=i<=stage,sel=i===selected,hot=i===hover;let color=sel?'#f0f7ff':active?'#9ec3df':'#77818c';
 c.save();c.setLineDash(active?[]:[4,4]);line(base,top,color,sel?2:1);c.setLineDash([]);c.strokeStyle=color;c.lineWidth=sel?2.5:1.3;c.beginPath();c.ellipse(base[0],base[1],19*zoom,8*zoom,0,0,Math.PI*2);c.stroke();if(active&&!paused){c.globalAlpha=.23;c.beginPath();c.ellipse(base[0],base[1],(22+5*Math.sin(t*2+i))*zoom,10*zoom,0,0,Math.PI*2);c.stroke();c.globalAlpha=1;}
 c.shadowColor=active?'#c0dcf5':'transparent';c.shadowBlur=sel?12:active?5:0;c.fillStyle=sel?'#dbeafa':'#0b1520';c.beginPath();c.arc(top[0],top[1],sel?8:6,0,Math.PI*2);c.fill();c.stroke();c.shadowBlur=0;
 let lx=Math.max(3,Math.min(W-83,top[0]+12)),ly=Math.max(3,Math.min(H-35,top[1]-17));c.fillStyle=sel?'#dbeafa':'#07111ded';c.fillRect(lx,ly,80,32);c.strokeStyle=color;c.strokeRect(lx+.5,ly+.5,79,31);c.fillStyle=sel?'#0a1722':color;c.font='bold 15px monospace';c.fillText(names[i],lx+7,ly+14);c.font='10px monospace';c.fillText(active?'ACCESO':'BLOQUEADO',lx+7,ly+26);c.restore();}
 const az=Math.round(yaw*180/Math.PI);$('mapcoords').textContent=`AZ ${az}°  /  EL ${Math.round(pitch*180/Math.PI)}°  /  ${Math.round(zoom*100)}%`;
}
function pick(i){selected=i;$('detail').textContent='NODO '+names[i]+' / '+(i<=Math.min(window.PC_CASE.getStage(),4)?'REGISTROS AUTORIZADOS':'ACCESO BLOQUEADO');window.PC_CASE.nodeIndex($('nodefiles'),i);refreshButtons();draw();}
function refreshButtons(){const stage=Math.min(window.PC_CASE.getStage(),4);$('nodebuttons').replaceChildren();names.forEach((n,i)=>{const b=document.createElement('button');b.type='button';b.textContent=n+' · '+(i<=stage?'ACCESO':'BLOQUEADO');b.classList.toggle('active',selected===i);b.setAttribute('aria-pressed',String(selected===i));b.onclick=()=>pick(i);$('nodebuttons').append(b)})}
function refresh(){refreshButtons();if(selected>=0)pick(selected);else{$('nodefiles').textContent='Selecciona un sector para consultar su índice de registros.';draw();}}
function pointer(e){let r=canvas.getBoundingClientRect();return [(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height];}
function hit(x,y){return points.findIndex(([a,b])=>a>=0&&a<=W&&b>=0&&b<=H&&(Math.hypot(a-x,b-y)<17||(x>=Math.max(3,Math.min(W-83,a+12))&&x<=Math.max(3,Math.min(W-83,a+12))+80&&y>=Math.max(3,Math.min(H-35,b-17))&&y<=Math.max(3,Math.min(H-35,b-17))+32)))}
canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,yaw,pitch,moved:false};canvas.setPointerCapture(e.pointerId)});
let pending=0,lastMove=0;function scheduleDraw(){if(pending)return;pending=requestAnimationFrame(ms=>{pending=0;if(!gpu&&ms-lastMove<32){scheduleDraw();return;}lastMove=ms;draw();});}
canvas.addEventListener('pointermove',e=>{if(drag){let dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>5)drag.moved=true;if(drag.moved){yaw=normalize(drag.yaw+dx*.006);pitch=Math.max(MIN_PITCH,Math.min(MAX_PITCH,drag.pitch+dy*.004));scheduleDraw()}}else{hover=hit(...pointer(e));canvas.style.cursor=hover>=0?'pointer':'grab'}});
canvas.addEventListener('pointerup',e=>{if(drag&&!drag.moved){const i=hit(...pointer(e));if(i>=0)pick(i)}drag=null;scheduleDraw()});canvas.addEventListener('pointercancel',()=>drag=null);
function normalize(a){return Math.atan2(Math.sin(a),Math.cos(a))}
$('zoomIn').onclick=()=>{zoom=Math.min(1.85,zoom+.15);draw()};$('zoomOut').onclick=()=>{zoom=Math.max(.95,zoom-.15);draw()};$('rotateLeft').onclick=()=>{yaw=normalize(yaw-.20);draw()};$('rotateRight').onclick=()=>{yaw=normalize(yaw+.20);draw()};$('reset').onclick=()=>{yaw=DEFAULT_YAW;pitch=DEFAULT_PITCH;zoom=1;selected=-1;$('detail').textContent='SELECCIONA UN NODO PARA INSPECCIONARLO';refresh()};
window.PC_MAP3D={draw,refresh};
})();
