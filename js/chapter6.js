/* SHEMLUM VI: local, no network required; symbolic PIN, not server security. */
(()=>{'use strict';
 const root=document.getElementById('chapter6');if(!root)return;
 const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)],views=$$('[data-v6-scene]');
 const objects=[
  ['La carta sin enviar','PISTA 01 / 04','Una nota escrita a mano dice: «Seis meses pueden esconder muchísimas historias. Busca las pruebas, no las prisas».'],
  ['El reloj detenido','PISTA 02 / 04','Un reloj detenido. En la parte de arriba hay algo escrito: «¿Por qué seis horas contigo parecen seis minutos?».'],
  ['La fotografía olvidada','PISTA 03 / 04','Detrás de una foto dice: «Los mejores recuerdos no siempre son perfectos; son nuestros».'],
  ['La grabación perdida','PISTA 04 / 04','Una vieja cinta lleva una etiqueta: «No mires el reloj; mira cuánto sonreímos».']
 ];
 const photos=[
  ['Dos vasos y una historia','FOTOGRAFÍA 01 · LETRA A','A','foto_bebidas','Un brindis juntos. Primera letra encontrada: A.'],
  ['El camino recorrido','FOTOGRAFÍA 02 · LETRA M','M','foto_paisaje','Una aventura que se quedó en la memoria. Segunda letra encontrada: M.'],
  ['Un secreto entre nosotros','FOTOGRAFÍA 03 · LETRA O','O','archivo_silencio_02','La señal es clara: silencio, detective. Tercera letra encontrada: O.'],
  ['El cómplice del silencio','FOTOGRAFÍA 04 · LETRA R','R','silencio_bombo','Hasta el detective guarda sus secretos. Cuarta letra encontrada: R.'],
  ['Una foto de recuerdo','ARCHIVO COMPLEMENTARIO',null,'perfil_bombo_02','No tiene letras escondidas, pero es un recuerdo muy bonito.'],
  ['Un momento tranquilo','ARCHIVO COMPLEMENTARIO',null,'perfil_chiqui_02','Entre tantas pistas también se puede descansar. Aquí no hay ninguna letra escondida.']
 ];
 const found=new Set(),viewed=new Set();let scene=0,originFocus=null;
 const modal=$('#v6Modal');
 function closeModal(restore=true){if(modal.hidden)return;modal.hidden=true;document.body.style.overflow='';$('#v6ModalImage').replaceChildren();if(restore)originFocus?.focus();}
 function setScene(n){closeModal(false);scene=Math.max(0,Math.min(n,views.length-1));views.forEach((v,i)=>{v.hidden=i!==scene;v.classList.toggle('is-current',i===scene)});if(scene!==4)$$('.v6-video-scene video').forEach(v=>v.pause());$('#v6Progress').textContent=scene===0?'CLASIFICADO':`${String(scene).padStart(2,'0')} / 07`;window.scrollTo({top:0,behavior:'instant'});}
 function goHome(){closeModal(false);if(typeof goToScreen==='function'&&typeof screens!=='undefined')goToScreen(screens.chapter6,screens.home);else{root.classList.remove('active');document.getElementById('home')?.classList.add('active')}}
 function openModal(meta,title,src,message,letter,trigger){originFocus=trigger;$('#v6ModalMeta').textContent=meta;$('#v6ModalTitle').textContent=title;$('#v6ModalImage').replaceChildren();if(src){const img=document.createElement('img');img.src=src;img.alt=title;$('#v6ModalImage').appendChild(img)}$('#v6ModalDescription').replaceChildren();const paragraph=document.createElement('p');paragraph.textContent=message;$('#v6ModalDescription').appendChild(paragraph);if(letter){const strong=document.createElement('strong');strong.textContent='LETRA ENCONTRADA: '+letter;$('#v6ModalDescription').appendChild(strong)}modal.hidden=false;document.body.style.overflow='hidden';$('#v6ModalClose').focus()}
 $('#v6Back').addEventListener('click',()=>scene<2?goHome():setScene(scene-1));$('#v6PortalHome').addEventListener('click',goHome);
 const pin=$('#v6Pin');pin.addEventListener('input',()=>{pin.value=pin.value.replace(/\D/g,'').slice(0,4);$('#v6PinMsg').textContent='Esperando a nuestra detective...';$('#v6PinMsg').classList.remove('v6-error')});
 $('#v6PinForm').addEventListener('submit',e=>{e.preventDefault();if(pin.value==='6842')setScene(1);else{$('#v6PinMsg').textContent='ACCESO DENEGADO · Código incorrecto, detective.';$('#v6PinMsg').classList.add('v6-error');pin.select()}});
 $('#v6Start').addEventListener('click',()=>setScene(2));
 $$('#v6Modal [data-v6-close], #v6ModalClose').forEach(b=>b.addEventListener('click',()=>closeModal()));
 document.addEventListener('keydown',e=>{if(modal.hidden)return;if(e.key==='Escape')closeModal();if(e.key==='Tab'){const nodes=[$('#v6ModalClose'),...$$('#v6Modal [data-v6-close]').filter(b=>b.tagName==='BUTTON')];const index=nodes.indexOf(document.activeElement);if(e.shiftKey&&index===0){e.preventDefault();nodes[nodes.length-1].focus()}else if(!e.shiftKey&&index===nodes.length-1){e.preventDefault();nodes[0].focus()}}});
 $$('[data-v6-object]').forEach(btn=>btn.addEventListener('click',()=>{const i=+btn.dataset.v6Object;found.add(i);btn.classList.add('is-found');btn.querySelector('small').textContent='EN ARCHIVO ✓';$('#v6Found').textContent=`${found.size} / 4 PISTAS REGISTRADAS`;$('#v6GoGallery').disabled=found.size<4;openModal(objects[i][1],objects[i][0],null,objects[i][2],null,btn)}));
 $('#v6GoGallery').addEventListener('click',()=>setScene(3));
 $$('[data-v6-photo]').forEach(btn=>btn.addEventListener('click',()=>{const i=+btn.dataset.v6Photo,p=photos[i];if(p[2])viewed.add(i);$('#v6OpenedPhotos').textContent=`${viewed.size} / 4 fotos con pistas revisadas`;openModal(p[1],p[0],'assets/chapter6/fotos/'+p[3]+'.jpg',p[4],p[2],btn)}));
 $('#v6WordForm').addEventListener('submit',e=>{e.preventDefault();const a=$('#v6Word').value.trim().toUpperCase(),msg=$('#v6WordMsg');msg.classList.remove('v6-error');if(viewed.size!==4){msg.textContent='Busca primero las cuatro fotos numeradas.';msg.classList.add('v6-error')}else if(a==='AMOR'){msg.textContent='✓ Código aceptado. Abriendo grabaciones...';setTimeout(()=>setScene(4),650)}else{msg.textContent='Ordena las letras según el número de cada foto.';msg.classList.add('v6-error')}});
 $$('.v6-video-scene video').forEach(v=>v.addEventListener('play',()=>$$('.v6-video-scene video').filter(x=>x!==v).forEach(x=>x.pause())));
 $('#v6TimeForm').addEventListener('submit',e=>{e.preventDefault();const a=$('#v6Time').value.trim().toLowerCase(),msg=$('#v6TimeMsg');if(/\b(tiempo|horas)\b/.test(a)){msg.textContent='✓ Caso resuelto';msg.classList.remove('v6-error');setTimeout(()=>setScene(5),550)}else{msg.textContent='¿Qué es lo que vuela sin que nadie lo vea?';msg.classList.add('v6-error')}});
 $('#v6OpenLetter').addEventListener('click',()=>setScene(6));$('#v6SecretNext').addEventListener('click',()=>{if(window.openPuntoCiego)window.openPuntoCiego();else setScene(7)});
 window.resetChapterSix=()=>{found.clear();viewed.clear();pin.value='';$('#v6Word').value='';$('#v6Time').value='';$('#v6PinMsg').textContent='Esperando a nuestra detective...';$('#v6WordMsg').textContent='Las pruebas aún guardan un mensaje.';$('#v6TimeMsg').textContent='Pista: no desaparecen los recuerdos.';$$('.v6-feedback').forEach(x=>x.classList.remove('v6-error'));$('#v6Found').textContent='0 / 4 PISTAS REGISTRADAS';$('#v6OpenedPhotos').textContent='0 / 4 fotos con pistas revisadas';$('#v6GoGallery').disabled=true;$$('[data-v6-object]').forEach(b=>{b.classList.remove('is-found');b.querySelector('small').textContent='REVISAR'});setScene(0)};
 window.resetChapterSix();
})();
