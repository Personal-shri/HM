import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import data from './interior-data.json';
const host=document.querySelector('#scene'),status=document.querySelector('#status');
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0xece9df);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.localClippingEnabled=true;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;host.appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(0xece9df);const camera=new THREE.PerspectiveCamera(65,1,.08,350);const orbit=new OrbitControls(camera,renderer.domElement);orbit.enabled=false;orbit.enableDamping=true;orbit.maxPolarAngle=Math.PI*.48;
scene.add(new THREE.HemisphereLight(0xffffff,0xbeb39b,2.4));const sun=new THREE.DirectionalLight(0xfff5de,1.7);sun.position.set(-25,50,40);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-40,right:40,top:45,bottom:-45});sun.shadow.bias=-.001;scene.add(sun);
const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.85});const wall=mat(0xefe9dc),wood=mat(0xb7966a),fabric=mat(0xc4bba7),black=mat(0x303939),tile=mat(0xd6cdbb),white=mat(0xf7f4eb);const barriers=[];
function box(x,y,w,d,h,m,b=0,solid=false){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x+w/2-22,b+h/2,24-y-d/2);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);if(solid)barriers.push([x,y,w,d]);return mesh;}
box(0,0,44,48,.15,tile,-.15);box(-3,-8,50,64,.12,mat(0xc7d1bb),-.3);
// Subtle tile grid provides a scale cue, not a finish specification.
for(let x=0;x<=44;x+=2)box(x,0,.018,48,.007,white);for(let y=0;y<=48;y+=2)box(0,y,44,.018,.007,white);
const thickness=.32,H=9.5;
function onLine(seg,x,y){return Math.abs(seg[0]-seg[2])<.001?Math.abs(x-seg[0])<.01:Math.abs(y-seg[1])<.01;}
for(const seg of data.walls){const vert=Math.abs(seg[0]-seg[2])<.001;const start=Math.min(seg[vert?1:0],seg[vert?3:2]),end=Math.max(seg[vert?1:0],seg[vert?3:2]);if(end-start<.01)continue;const cuts=[];
 for(const g of data.gaps){if((Math.abs(g[0]-g[2])<.001)!==vert||!onLine(seg,g[0],g[1]))continue;let lo=Math.max(start,Math.min(g[vert?1:0],g[vert?3:2])),hi=Math.min(end,Math.max(g[vert?1:0],g[vert?3:2]));if(hi>lo)cuts.push([lo,hi]);}
 const points=[...new Set([start,end,...cuts.flat()])].sort((a,b)=>a-b);
 for(let i=0;i<points.length-1;i++){const lo=points[i],hi=points[i+1],mid=(lo+hi)/2,gap=cuts.some(([a,b])=>mid>a&&mid<b);let sill=0,head=H,opening=null;if(gap){head=7;opening=data.openings.find(o=>onLine(seg,o.x,o.y)&&mid>=(vert?o.y:o.x)-.01&&mid<=(vert?o.y:o.x)+o.width_ft+.01);if(opening){head=opening.height_ft;if(opening.code.startsWith('W')||opening.code==='V1'){sill=opening.code==='V1'?6:opening.code==='W1'?2.5:4;head=sill+opening.height_ft;}}}
 const x=vert?seg[0]-thickness/2:lo,y=vert?lo:seg[1]-thickness/2,w=vert?thickness:hi-lo,d=vert?hi-lo:thickness;
 if(!gap)box(x,y,w,d,H,wall,0,true);else{if(sill)box(x,y,w,d,sill,wall,0,true);if(head<H)box(x,y,w,d,H-head,wall,head);if(sill){const glass=new THREE.MeshStandardMaterial({color:0xacc5c6,transparent:true,opacity:.24,roughness:.3,side:THREE.DoubleSide});box(x,y,w,d,head-sill,glass,sill);box(x,y,w,d,.09,black,sill);box(x,y,w,d,.09,black,head-.09);}}
 }
}
const metal=mat(0x545956),cream=mat(0xe8e2d5),green=mat(0x818a72);
const labelGroup=new THREE.Group();scene.add(labelGroup);
function label(x,y,text){const c=document.createElement('canvas');c.width=384;c.height=80;const t=c.getContext('2d');t.fillStyle='#fffffff0';t.fillRect(0,0,384,80);t.fillStyle='#293c35';t.font='26px sans-serif';t.textAlign='center';t.fillText(text,192,48);const tex=new THREE.CanvasTexture(c);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:false,toneMapped:false}));s.position.set(x-22,4.4,24-y);s.scale.set(7.5,1.55,1);labelGroup.add(s);}
function cylinder(x,y,r,h,m,b=0){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,24),m);mesh.position.set(x-22,b+h/2,24-y);mesh.castShadow=true;scene.add(mesh);return mesh;}
for(const [x,y,w,d,id] of data.furniture){barriers.push([x,y,w,d]);
 if(['L1','L2','P3'].includes(id)){
  box(x+.1,y+.1,w-.2,d-.2,.3,wood,.25);box(x,y,w,d,.5,fabric,.55);
  const vertical=id==='L1';
  if(vertical){box(x+w-.35,y,.35,d,1.5,fabric,1.05);box(x,y,w,.28,1.1,fabric,1.05);box(x,y+d-.28,w,.28,1.1,fabric,1.05);for(let k=0;k<3;k++){box(x+.2,y+.35+k*(d-.7)/3,w-.65,(d-.85)/3,.5,cream,1.05);box(x+w-.8,y+.5+k*(d-.8)/3,.45,(d-.9)/3,.9,fabric,1.55);}}
  else{box(x,y+d-.35,w,.35,1.5,fabric,1.05);box(x,y,.28,d,1.1,fabric,1.05);box(x+w-.28,y,.28,d,1.1,fabric,1.05);const n=id==='P3'?1:2;for(let k=0;k<n;k++)box(x+.35+k*(w-.7)/n,y+.2,(w-.85)/n,d-.65,.5,cream,1.05);}
 }else if(id==='P1'||id==='G1'){
  box(x,y,w,d,.5,wood,.4);box(x+.1,y+.1,w-.2,d-.2,.65,white,.9);box(x+.12,y+.12,w-.24,d-.24,.13,cream,1.55);
  if(id==='P1'){box(x+w-.2,y,.2,d,3.3,fabric,.2);for(let k=0;k<2;k++)box(x+w-1.6,y+.4+k*2.5,1.3,2.1,.3,white,1.7);box(x+.3,y+.15,1.5,d-.3,.09,green,1.7);}
  else{box(x,y,w,.2,3.3,wood,.2);for(let k=0;k<2;k++)box(x+.4+k*2.5,y+.4,2.1,1.3,.3,white,1.7);box(x+.15,y+d-1.7,w-.3,1.4,.09,green,1.7);}
 }else if(['T1','L3'].includes(id)){
  const h=id==='T1'?2.5:1.45;box(x,y,w,d,.15,wood,h-.15);for(const a of [.15,w-.3])for(const b of [.15,d-.3])box(x+a,y+b,.15,.15,h-.15,wood);if(id==='L3')cylinder(x+w/2,y+d/2,.3,.32,cream,h);
 }else if(id==='c'||id==='s'){
  let h=id==='s'?2:1.4;box(x,y,w,d,.17,fabric,h);box(x,y+d-.16,w,.16,.85,fabric,h);for(const a of [.12,w-.25])for(const b of [.12,d-.25])box(x+a,y+b,.13,.13,h,wood);
 }else if(id==='K3'){
  box(x,y,w,d,6.5,mat(0xa7aba8));box(x-.025,y+.08,.04,d-.16,3.5,metal,2.8);box(x-.07,y+.2,.08,.12,1.5,black,3.7);
 }else if(id==='C1'||id.startsWith('ST')||id==='A1'){
  for(let h=.25;h<6.5;h+=1.3)box(x,y,w,d,.08,wood,h);box(x,y,.08,d,6.5,cream);box(x+w-.08,y,.08,d,6.5,cream);for(let h=1.6;h<6;h+=1.3)box(x+.13,y+.1,w-.26,Math.min(d-.2,.8),.65,mat(0xbcb29b),h);
 }else if(id==='G2'){
  box(x,y,w,d,7,wood);for(let k=0;k<2;k++){box(x+w-.02,y+.07+k*d/2,.05,d/2-.14,6.7,cream,.15);box(x+w+.03,y+d/4+k*d/2,.04,.05,1,metal,3);}
 }else{
  const h=id==='TV'?1.65:['K1','K2','K4','U1','U2'].includes(id)?2.9:1.7;box(x,y,w,d,h,cream);box(x,y,w,d,.12,wood,h);
  const along=w>d;const n=Math.max(1,Math.round((along?w:d)/2));for(let k=0;k<n;k++){if(along){const ww=w/n;box(x+k*ww+.035,y+d-.015,ww-.07,.03,h-.18,wood,.09);box(x+k*ww+ww/2,y+d+.025,.35,.045,.04,metal,h-.4);}else{const dd=d/n;box(x-.015,y+k*dd+.035,.03,dd-.07,h-.18,wood,.09);box(x-.045,y+k*dd+dd/2,.04,.35,.04,metal,h-.4);}}
  if(id==='U1'){const drum=cylinder(x-.06,y+d/2,.7,.1,black,1.2);drum.rotation.z=Math.PI/2;drum.position.y=1.5;}
 }
}
// Appliance and finish details stay within the planned footprints.
box(31,.8,2.3,1.4,.07,metal,3.04);box(31.2,.95,1.9,1.1,.08,black,3.07);cylinder(32.1,.65,.045,.8,metal,3.06);
box(41.7,9,1.6,1.2,.08,black,3.03);for(const x of [42,42.9])for(const y of [9.3,9.9])cylinder(x,y,.16,.04,metal,3.12);
box(41.5,8.8,2,1.6,.15,metal,6);box(42.1,9.2,.8,.8,3.1,metal,6.15);
// Reference positions; the sink/hob models do not prescribe service installation.
for(const [x,y,w,d,h,b] of [[1,0,8,.15,6,2.5],[10,0,7,.15,8,0],[28,0,10,.15,4,4],[0,29,.15,8,6,2.5],[44,37,.15,8,6,2.5],[32,48,8,.15,6,2.5],[44,3,.15,6,4,4]]){
 if(w>d){box(x,y,w,.08,.08,black,b);box(x,y,w,.08,.08,black,b+h);for(let k=0;k<=2;k++)box(x+w*k/2,y,.08,.08,h,black,b);}else{box(x,y,.08,d,.08,black,b);box(x,y,.08,d,.08,black,b+h);for(let k=0;k<=2;k++)box(x,y+d*k/2,.08,.08,h,black,b);}
}
for(const x of [1,8.5,10,16.5])for(let k=0;k<4;k++)cylinder(x+k*.1,.3,.07,7.4,fabric,.3);
label(6,17,'Living · 24 × 20 ft*');label(33,13,'Kitchen · 20 × 14 ft');label(30,24,'Dining · 14 × 14 ft*');label(7,29,'Parents · 16 × 16 ft');label(36,44,'Guest · 14 × 14 ft');
box(.35,8.1,.1,4.8,2.7,black,2.3); // Screen beside front glazing, not opposite it.
// Window shading indication, no simulated solar performance.
box(.8,.18,8.4,.13,1.1,fabric,7.4);box(9.8,.18,7.4,.13,1.1,fabric,7.4);
// Original stair zone is a reserved surface, not an invented climbable stair.
box(16.3,26.3,9.4,15.4,.08,mat(0xaaa99b));barriers.push([16.3,27,9.4,14.7]);
const rooms=[['Entry',21,4.6,0],['Living / TV',8.5,10.25,Math.PI/2],['Kitchen',38.8,11.5,Math.PI],['Dining',35.5,23,Math.PI/2],['Parents',6,32,-Math.PI/2],['Guest',32.8,39,-Math.PI/2],['Laundry',39.5,25,-Math.PI/2],['Store',41,30,0],['Pantry',40,18,-Math.PI/2],['Parents’ bath',7,45,Math.PI/2],['Closet',12,46,-Math.PI/2],['Shared bath',34,30,0],['Rear entry',21,46,Math.PI],['Stair approach',21,24.5,0]];
let mode='walk',yaw=0,pitch=0,current=0;const keys=new Set();const map=document.querySelector('#map'),ctx=map.getContext('2d');
function blocked(x,y){return x<.6||x>43.4||y<.6||y>47.4||barriers.some(([a,b,w,d])=>x>a-.38&&x<a+w+.38&&y>b-.38&&y<b+d+.38);}
function orient(){camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0);}
function go(index){closePhoto();wall.clippingPlanes=[];labelGroup.visible=false;current=index;mode='walk';orbit.enabled=false;const [name,x,y,angle]=rooms[index];camera.position.set(x-22,5.2,24-y);yaw=angle;pitch=0;orient();status.textContent=name+' · Walk mode · drag to look, use arrows or WASD to move';document.querySelector('#mode').textContent='Overview';document.querySelector('#room').value=index;drawMap();}
function move(dx,dy,dt){const speed=5*dt,x=camera.position.x+22,y=24-camera.position.z;const vx=(-Math.sin(yaw)*dy+Math.cos(yaw)*dx)*speed,vy=(Math.cos(yaw)*dy+Math.sin(yaw)*dx)*speed;if(!blocked(x+vx,y))camera.position.x+=vx;const xx=camera.position.x+22;if(!blocked(xx,y+vy))camera.position.z-=vy;}
function drawMap(){ctx.clearRect(0,0,176,192);ctx.fillStyle='#eee9dc';ctx.fillRect(0,0,176,192);ctx.strokeStyle='#667267';ctx.lineWidth=1;for(const [x,y,w,d] of barriers){ctx.strokeRect(x*4,(48-y-d)*4,w*4,d*4);}if(mode==='walk'){const x=(camera.position.x+22)*4,y=(camera.position.z+24)*4;ctx.fillStyle='#bd692f';ctx.beginPath();ctx.arc(x,y,4,0,7);ctx.fill();ctx.strokeStyle='#bd692f';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-Math.sin(yaw)*12,y-Math.cos(yaw)*12);ctx.stroke();}}
const select=document.querySelector('#room');rooms.forEach(([name],i)=>select.add(new Option(name,i)));select.onchange=()=>go(+select.value);document.querySelector('#next').onclick=()=>go((current+1)%rooms.length);document.querySelector('#prev').onclick=()=>go((current+rooms.length-1)%rooms.length);document.querySelector('#reset').onclick=()=>go(0);
document.querySelector('#mode').onclick=()=>{if(mode==='walk'){mode='overview';wall.clippingPlanes=document.querySelector('#cutaway').checked?[new THREE.Plane(new THREE.Vector3(0,-1,0),3)]:[];labelGroup.visible=document.querySelector('#labels').checked;orbit.enabled=true;const fit=Math.max(1,1.15/camera.aspect);camera.position.set(-33*fit,46*fit,48*fit);orbit.target.set(0,0,0);orbit.update();status.textContent='Overview · drag to orbit; scroll or pinch to zoom · choose a room to walk';document.querySelector('#mode').textContent='Return to walking';}else go(current);};
let drag=null;renderer.domElement.addEventListener('pointerdown',e=>{if(mode!=='walk')return;drag=[e.clientX,e.clientY];renderer.domElement.setPointerCapture(e.pointerId);renderer.domElement.focus();});renderer.domElement.tabIndex=0;renderer.domElement.addEventListener('pointermove',e=>{if(!drag||mode!=='walk')return;yaw-=(e.clientX-drag[0])*.004;pitch=Math.max(-1.1,Math.min(1.1,pitch-(e.clientY-drag[1])*.004));drag=[e.clientX,e.clientY];orient();});for(const event of ['pointerup','pointercancel'])renderer.domElement.addEventListener(event,()=>drag=null);
window.addEventListener('keydown',e=>{if(e.key==='Escape'){closePhoto();return;}if(!document.querySelector('#photo-panel').hidden)return;if(['SELECT','INPUT','BUTTON'].includes(document.activeElement.tagName))return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D'].includes(e.key)){keys.add(e.key.toLowerCase());e.preventDefault();}});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());
document.querySelectorAll('[data-move]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.move);};for(const name of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(name,()=>keys.delete(b.dataset.move));});
function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(host);resize();go(0);let last=performance.now();renderer.setAnimationLoop(t=>{let dt=Math.min((t-last)/1000,.05);last=t;if(mode==='walk'){let x=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),y=(keys.has('w')||keys.has('arrowup')?1:0)-(keys.has('s')||keys.has('arrowdown')?1:0);if(x&&y){x*=.707;y*=.707;}if(x||y)move(x,y,dt);drawMap();}else orbit.update();renderer.render(scene,camera);});
window.HMInterior={go,rooms,blocked,camera,move,get mode(){return mode;}};

function closePhoto(){document.querySelector('#photo-panel').hidden=true;}
document.querySelector('#cutaway').onchange=e=>{if(mode==='overview')wall.clippingPlanes=e.target.checked?[new THREE.Plane(new THREE.Vector3(0,-1,0),3)]:[];};
document.querySelector('#labels').onchange=e=>labelGroup.visible=mode==='overview'&&e.target.checked;
const photoMap=['foyer-hall','living','kitchen-dining','kitchen-dining','parents','guest','laundry-store','laundry-store','pantry-closet','bathrooms','pantry-closet','bathrooms','foyer-hall',null];
document.querySelector('#photo').onclick=()=>{keys.clear();const key=photoMap[current];const panel=document.querySelector('#photo-panel');panel.hidden=false;const img=panel.querySelector('img');img.hidden=!key;document.querySelector('#photo-caption').textContent=key?rooms[current][0]+' · actual saved photo sample; scaled model governs geometry. Utility and hall images remain finish studies.':'No coordinated stair photo exists yet. The stair footprint is reserved.';if(key)img.src=window.HMInteriorPhotos[key];};document.querySelector('#close-photo').onclick=closePhoto;
document.querySelector('#focus-room').onclick=()=>{closePhoto();mode='overview';orbit.enabled=true;wall.clippingPlanes=[new THREE.Plane(new THREE.Vector3(0,-1,0),3)];labelGroup.visible=false;const r=rooms[current];orbit.target.set(r[1]-22,1,24-r[2]);const f=Math.max(1,1/camera.aspect);camera.position.copy(orbit.target).add(new THREE.Vector3(-12*f,19*f,17*f));orbit.update();status.textContent=r[0]+' · close overhead view; drag to rotate';document.querySelector('#mode').textContent='Return to walking';document.querySelector('#cutaway').checked=true;};
document.querySelector('#mode').click();
