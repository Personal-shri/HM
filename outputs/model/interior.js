import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import data from './interior-data.json';
const host=document.querySelector('#scene'),status=document.querySelector('#status');
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0xece9df);host.appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(0xece9df);const camera=new THREE.PerspectiveCamera(65,1,.08,350);const orbit=new OrbitControls(camera,renderer.domElement);orbit.enabled=false;orbit.enableDamping=true;orbit.maxPolarAngle=Math.PI*.48;
scene.add(new THREE.HemisphereLight(0xffffff,0xbeb39b,2.4));const sun=new THREE.DirectionalLight(0xfff5de,1.7);sun.position.set(-25,50,40);scene.add(sun);
const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.85});const wall=mat(0xefe9dc),wood=mat(0xb7966a),fabric=mat(0xc4bba7),black=mat(0x303939),tile=mat(0xd6cdbb),white=mat(0xf7f4eb);const barriers=[];
function box(x,y,w,d,h,m,b=0,solid=false){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x+w/2-22,b+h/2,24-y-d/2);scene.add(mesh);if(solid)barriers.push([x,y,w,d]);return mesh;}
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
const furnitureMeshes=[];
for(const [x,y,w,d,id] of data.furniture){let h=2.4,m=wood;if(['L1','L2','P3','c','s'].includes(id)){h=1.5;m=fabric;}if(id==='L3')h=1.3;if(id==='P1'||id==='G1')h=1.4;if(['K1','K2','K4','U2'].includes(id))h=3;if(id==='K3'||id==='G2'||id==='C1'||id.startsWith('ST')||id==='A1')h=6.8;const obj=box(x,y,w,d,h,m,0,true);furnitureMeshes.push(obj);
 if(id==='L1')box(x+w-.35,y,.35,d,1.3,fabric,1.5);if(id==='L2')box(x,y+d-.35,w,.35,1.3,fabric,1.5);
 if(id==='P1'||id==='G1'){box(x+.1,y+.1,w-.2,d-.2,.55,white,1.4);if(id==='P1')box(x+w-.7,y+.3,.5,d-.6,.25,fabric,1.95);else box(x+.3,y+.15,w-.6,.6,.25,fabric,1.95);}
 if(id.startsWith('K')&&id!=='K3')box(x,y,w,d,.12,mat(0x79766f),h);
 if(id==='U1'){const drum=new THREE.Mesh(new THREE.CylinderGeometry(.65,.65,.12,24),black);drum.rotation.z=Math.PI/2;drum.position.set(x-22-.07,1.3,24-y-d/2);scene.add(drum);}
}
box(.35,8.1,.1,4.8,2.7,black,2.3); // Screen beside front glazing, not opposite it.
// Window shading indication, no simulated solar performance.
box(.8,.18,8.4,.13,1.1,fabric,7.4);box(9.8,.18,7.4,.13,1.1,fabric,7.4);
// Original stair zone is a reserved surface, not an invented climbable stair.
box(16.3,26.3,9.4,15.4,.08,mat(0xaaa99b));barriers.push([16.3,27,9.4,14.7]);
const rooms=[['Entry',21,4.6,0],['Living / TV',8.5,10.25,Math.PI/2],['Kitchen',38.8,11.5,Math.PI],['Dining',35.5,23,Math.PI/2],['Parents',6,32,-Math.PI/2],['Guest',32.8,39,-Math.PI/2],['Laundry',39.5,25,-Math.PI/2],['Store',41,30,0],['Pantry',40,18,-Math.PI/2],['Parents’ bath',7,45,Math.PI/2],['Closet',12,46,-Math.PI/2],['Shared bath',34,30,0],['Rear entry',21,46,Math.PI],['Stair approach',21,24.5,0]];
let mode='walk',yaw=0,pitch=0,current=0;const keys=new Set();const map=document.querySelector('#map'),ctx=map.getContext('2d');
function blocked(x,y){return x<.6||x>43.4||y<.6||y>47.4||barriers.some(([a,b,w,d])=>x>a-.38&&x<a+w+.38&&y>b-.38&&y<b+d+.38);}
function orient(){camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0);}
function go(index){current=index;mode='walk';orbit.enabled=false;const [name,x,y,angle]=rooms[index];camera.position.set(x-22,5.2,24-y);yaw=angle;pitch=0;orient();status.textContent=name+' · Walk mode · drag to look, use arrows or WASD to move';document.querySelector('#mode').textContent='Overview';document.querySelector('#room').value=index;drawMap();}
function move(dx,dy,dt){const speed=5*dt,x=camera.position.x+22,y=24-camera.position.z;const vx=(-Math.sin(yaw)*dy+Math.cos(yaw)*dx)*speed,vy=(Math.cos(yaw)*dy+Math.sin(yaw)*dx)*speed;if(!blocked(x+vx,y))camera.position.x+=vx;const xx=camera.position.x+22;if(!blocked(xx,y+vy))camera.position.z-=vy;}
function drawMap(){ctx.clearRect(0,0,176,192);ctx.fillStyle='#eee9dc';ctx.fillRect(0,0,176,192);ctx.strokeStyle='#667267';ctx.lineWidth=1;for(const [x,y,w,d] of barriers){ctx.strokeRect(x*4,(48-y-d)*4,w*4,d*4);}if(mode==='walk'){const x=(camera.position.x+22)*4,y=(camera.position.z+24)*4;ctx.fillStyle='#bd692f';ctx.beginPath();ctx.arc(x,y,4,0,7);ctx.fill();ctx.strokeStyle='#bd692f';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-Math.sin(yaw)*12,y-Math.cos(yaw)*12);ctx.stroke();}}
const select=document.querySelector('#room');rooms.forEach(([name],i)=>select.add(new Option(name,i)));select.onchange=()=>go(+select.value);document.querySelector('#next').onclick=()=>go((current+1)%rooms.length);document.querySelector('#prev').onclick=()=>go((current+rooms.length-1)%rooms.length);document.querySelector('#reset').onclick=()=>go(0);
document.querySelector('#mode').onclick=()=>{if(mode==='walk'){mode='overview';orbit.enabled=true;const fit=Math.max(1,1.15/camera.aspect);camera.position.set(-33*fit,46*fit,48*fit);orbit.target.set(0,0,0);orbit.update();status.textContent='Overview · drag to orbit; scroll or pinch to zoom · choose a room to walk';document.querySelector('#mode').textContent='Return to walking';}else go(current);};
let drag=null;renderer.domElement.addEventListener('pointerdown',e=>{if(mode!=='walk')return;drag=[e.clientX,e.clientY];renderer.domElement.setPointerCapture(e.pointerId);renderer.domElement.focus();});renderer.domElement.tabIndex=0;renderer.domElement.addEventListener('pointermove',e=>{if(!drag||mode!=='walk')return;yaw-=(e.clientX-drag[0])*.004;pitch=Math.max(-1.1,Math.min(1.1,pitch-(e.clientY-drag[1])*.004));drag=[e.clientX,e.clientY];orient();});for(const event of ['pointerup','pointercancel'])renderer.domElement.addEventListener(event,()=>drag=null);
window.addEventListener('keydown',e=>{if(['SELECT','INPUT','BUTTON'].includes(document.activeElement.tagName))return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D'].includes(e.key)){keys.add(e.key.toLowerCase());e.preventDefault();}});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());
document.querySelectorAll('[data-move]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.move);};for(const name of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(name,()=>keys.delete(b.dataset.move));});
function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(host);resize();go(0);let last=performance.now();renderer.setAnimationLoop(t=>{let dt=Math.min((t-last)/1000,.05);last=t;if(mode==='walk'){let x=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),y=(keys.has('w')||keys.has('arrowup')?1:0)-(keys.has('s')||keys.has('arrowdown')?1:0);if(x&&y){x*=.707;y*=.707;}if(x||y)move(x,y,dt);drawMap();}else orbit.update();renderer.render(scene,camera);});
window.HMInterior={go,rooms,blocked,camera,move,get mode(){return mode;}};
