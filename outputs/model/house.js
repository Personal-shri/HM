import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const container=document.getElementById('canvas');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setClearColor(0xeaece5);
container.appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(0xeaece5);
const camera=new THREE.PerspectiveCamera(42,1,.1,500);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,9,0);
controls.maxPolarAngle=Math.PI*.49;controls.minDistance=35;controls.maxDistance=400;
controls.enableDamping=true;
scene.add(new THREE.HemisphereLight(0xf5f5ec,0x929b7e,2.6));
const sun=new THREE.DirectionalLight(0xfff2d6,3);sun.position.set(-40,70,35);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-70,right:70,top:70,bottom:-70,near:1,far:180});sun.shadow.bias=-.0008;scene.add(sun);
const M=(color,roughness=.7)=>new THREE.MeshStandardMaterial({color,roughness});
const wall=M(0xe6e0d0),roofMat=M(0x374447),wood=M(0xa78151),trim=M(0x333f3e),stone=M(0xb8ab94),glass=new THREE.MeshStandardMaterial({color:0x6e9ca7,metalness:.25,roughness:.2}),grass=M(0xb2bca3),pave=M(0xd4cfc1);
const moulding=M(0xf0e7d4),entryStone=M(0xd4c7ac);
const lower=new THREE.Group(),upper=new THREE.Group(),roofs=new THREE.Group();scene.add(lower,upper,roofs);
// Floor-plan coordinates x 0..44, z 0 rear..48 front; y is vertical, in feet.
function box(x,z,w,d,bottom,height,mat,parent=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,height,d),mat);m.position.set(x+w/2-22,bottom+height/2,z+d/2-24);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
box(-5.5,-16,55,80,-.6,.5,grass);box(-5.5,64,55,7,-.65,.15,M(0x929895));
box(0,0,44,48,0,.65,stone,lower);box(0,0,44,48,.65,9.5,wall,lower);
box(0,0,44,48,10.15,.65,stone,upper);
// Upper occupied footprint: rear full width, left loft, center front kitchen.
box(0,0,44,34,10.8,9.4,wall,upper);box(0,34,16,4,10.8,9.4,wall,upper);box(16,34,14,14,10.8,9.4,wall,upper);
box(0,38,16,10,10.8,.12,wood,upper);box(30,34,14,14,10.8,.12,pave,upper);
box(0,48,24,8,-.03,.45,pave);box(10,-8,24,8,-.03,.45,pave);
box(19,56,4,8,-.08,.2,pave);box(17,47.5,8,1.5,.1,.22,stone);
// Front and rear facade windows/doors are schematic surface assemblies.
function glazing(x,z,w,h,bottom,orientation='front',parent=lower,isDoor=false){
 const depth=.12,frame=.16;
 if(orientation==='front'||orientation==='rear'){
  const plane=orientation==='front'?z+.075:z-.2;
  box(x,plane,w,depth,bottom,h,trim,parent);box(x+frame,plane+(orientation==='front'?.04:-.04),w-2*frame,depth,bottom+frame,h-2*frame,glass,parent);
  for(let i=1;i<Math.ceil(w/3);i++)box(x+w*i/Math.ceil(w/3)-.05,plane+(orientation==='front'?.1:-.1),.1,.15,bottom,h,trim,parent);
  box(x-.2,plane-.04,w+.4,.23,bottom-.22,.22,moulding,parent);box(x-.2,plane-.04,w+.4,.23,bottom+h,.18,moulding,parent);
  box(x-.2,plane-.04,.18,.23,bottom,h,moulding,parent);box(x+w+.02,plane-.04,.18,.23,bottom,h,moulding,parent);
 }else{
  const plane=orientation==='right'?x+.075:x-.2;
  box(plane,z,depth,w,bottom,h,trim,parent);box(plane+(orientation==='right'?.05:-.05),z+frame,depth,w-2*frame,bottom+frame,h-2*frame,glass,parent);
  box(plane-.04,z-.2,.24,w+.4,bottom-.22,.22,moulding,parent);box(plane-.04,z-.2,.24,w+.4,bottom+h,.18,moulding,parent);
  box(plane-.04,z-.2,.24,.18,bottom,h,moulding,parent);box(plane-.04,z+w+.02,.24,.18,bottom,h,moulding,parent);
 }
}
// Large front living windows, slider, foyer entry and kitchen window.
glazing(1,48,8,6,2.5);glazing(10,48,7,8,.65);
box(19,48.13,4,.18,.65,8,wood,lower);box(22.4,48.35,.1,.1,4.2,1.2,trim,lower);
glazing(28,48,10,4,4.2);glazing(44,39,6,4,4.2,'right');
glazing(0,11,8,6,2.5,'left');glazing(44,3,8,6,2.5,'right');glazing(32,0,8,6,2.5,'rear');
box(20,-.15,3.5,.16,.65,7,wood,lower);glazing(0,3,2,2,6,'left');glazing(44,22,4,4,4.5,'right');glazing(44,17,2,2,6,'right');
glazing(3,0,8,6,13,'rear',upper);glazing(33,0,8,6,13,'rear',upper);
glazing(0,4,8,6,13,'left',upper);glazing(44,4,8,6,13,'right',upper);glazing(44,19,8,6,13,'right',upper);
glazing(0,26,8,6,13,'left',upper);glazing(19,48,6,4,14,'front',upper);glazing(4,38,7,8,10.9,'front',upper);
glazing(30,41,3,7,10.9,'right',upper);glazing(16,42,3,7,10.9,'left',upper);
// Guardrails stay outside the usable patio surfaces.
function rail(x,z,w,d){
 if(w){box(x,z,w,.12,14.25,.14,trim,upper);for(let q=0;q<=w;q+=.65)box(x+q,z,.06,.08,10.95,3.3,trim,upper);}
 if(d){box(x,z,.12,d,14.25,.14,trim,upper);for(let q=0;q<=d;q+=.65)box(x,z+q,.08,.06,10.95,3.3,trim,upper);}
}
rail(0,48,16,0);rail(0,38,0,10);rail(30,48,14,0);rail(44,34,0,14);
// Selected A: flat roof slabs concealed by ivory parapets, restrained cornices.
for(const x of [.25,15.05]){
 box(x,47.2,.7,.7,10.9,9.4,wall,roofs);
 box(x-.14,47.06,.98,.98,10.9,.3,moulding,roofs);
 box(x-.14,47.06,.98,.98,19.85,.38,moulding,roofs);
}
box(-.3,-.3,44.6,34.6,20.2,.4,roofMat,roofs);
box(-.3,34,16.6,14.4,20.2,.4,roofMat,roofs);
box(15.7,33.8,14.6,14.6,20.2,.4,roofMat,roofs);
function edge(x,z,w,d,bottom,height=1.35){box(x,z,w,d,bottom,height,wall,roofs);box(x-.12,z-.12,w+.24,d+.24,bottom+height,.15,moulding,roofs);}
edge(0,0,44,.35,20.6);edge(0,0,.35,48,20.6);edge(43.65,0,.35,34,20.6);edge(30,33.65,14,.35,20.6);
edge(0,47.65,16,.35,20.6);edge(16,47.65,14,.35,20.6,1.85);
edge(29.65,34,.35,14,20.6,1.85);
// Narrow cornice bands, rather than heavy carved ornament.
function band(x,z,w,d,y,parent=upper){
 box(x,z,w,d,y,.16,moulding,parent);box(x-.12,z-.12,w+.24,d+.24,y+.18,.16,moulding,parent);
}
band(-.16,47.8,44.32,.3,10.15);band(-.16,-.16,.3,48.32,10.15);band(43.85,-.16,.3,48.32,10.15);band(-.16,-.16,44.32,.3,10.15);
band(-.2,47.8,30.4,.4,20.18,roofs);band(-.2,-.2,.4,48.4,20.18,roofs);band(-.2,-.2,44.4,.4,20.18,roofs);band(43.8,-.2,.4,34.4,20.18,roofs);band(30,33.8,14.2,.4,20.18,roofs);
// Plain shallow entrance arch and pilasters, matching the selected facade language.
box(17.4,48.03,1,.15,.65,8,entryStone,lower);box(23.6,48.03,1,.15,.65,8,entryStone,lower);
const arch=new THREE.Shape();arch.moveTo(17.4,8.2);arch.quadraticCurveTo(21,11.2,24.6,8.2);arch.lineTo(24,8.2);arch.quadraticCurveTo(21,10.3,18,8.2);arch.closePath();
const archMesh=new THREE.Mesh(new THREE.ExtrudeGeometry(arch,{depth:.2,bevelEnabled:false}),moulding);archMesh.position.set(-22,0,24.12);lower.add(archMesh);
box(20.96,48.34,.05,.08,.8,7.65,trim,lower);
for(const x of [20.55,21.35])box(x,48.39,.07,.12,3.2,1.7,M(0xa38a56),lower);
// Simple wall lanterns and modest column bases on the front sitting bay.
const lampMat=new THREE.MeshStandardMaterial({color:0xffe4ab,emissive:0xffbd59,emissiveIntensity:.35});
for(const x of [16.4,25.2,41.6]){box(x,48.19,.42,.35,5.4,1.1,trim,lower);box(x+.06,48.39,.30,.12,5.5,.85,lampMat,lower);}
// Simple furniture for the outdoor areas only.
function chair(x,z,level,parent=scene){box(x,z,2.1,2.1,level,.9,wood,parent);box(x,z,2.1,.3,level+.9,1.4,wall,parent);}
chair(3,50,.5);chair(9,50,.5);box(6,51,2,2,.5,1.2,wood);
chair(3,41,11,upper);chair(9,41,11,upper);box(6,42,2,2,11,1.2,wood,upper);
box(34,39,5,3,11,2.4,wood,upper);chair(33,42,11,upper);chair(39,42,11,upper);
box(16,-5,8,3,.5,2.4,wood);chair(14,-5,.5);chair(25,-5,.5);
const plantMat=M(0x6e8560);
for(const [x,z] of [[-2,48],[-2,35],[46,45],[46,33],[2,58],[13,58],[35,-10]]){
 box(x,z,1.7,1.7,0,1.5,stone);const m=new THREE.Mesh(new THREE.SphereGeometry(1.4,12,8),plantMat);m.position.set(x+.8-22,2.2,z+.8-24);m.castShadow=true;scene.add(m);
}
const views={front:[0,13,92],angle:[-63,33,78],left:[-96,17,0],right:[96,17,0],rear:[0,15,-94],top:[0,110,1]};
let previousFit=1;
function view(name){previousFit=1;container.hidden=false;document.getElementById('reference').hidden=true;camera.position.set(...views[name]);controls.target.set(0,10,0);controls.update();document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));document.getElementById('status').textContent='Selected A · '+name+' view · drag to rotate; scroll to zoom';resize();}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>view(b.dataset.view)));
document.getElementById('roof').addEventListener('change',e=>roofs.visible=e.target.checked&&upper.visible);
document.getElementById('upper').addEventListener('change',e=>{upper.visible=e.target.checked;roofs.visible=e.target.checked&&document.getElementById('roof').checked;});
document.getElementById('finish').addEventListener('change',e=>{const palette={ivory:[0xe6e0d0,0x374447],sage:[0xa4afa0,0x45534c],stone:[0xc7b89c,0x333c3e]}[e.target.value];wall.color.setHex(palette[0]);roofMat.color.setHex(palette[1]);document.getElementById('status').textContent='Exterior preview: '+e.target.selectedOptions[0].text+' · layout remains unchanged';});
function resize(){if(container.hidden||!container.clientWidth||!container.clientHeight)return;renderer.setSize(container.clientWidth,container.clientHeight);camera.aspect=container.clientWidth/container.clientHeight;const fit=Math.max(1,1.4/camera.aspect);camera.position.sub(controls.target).multiplyScalar(fit/previousFit).add(controls.target);previousFit=fit;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(container);resize();view('angle');
document.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>{container.hidden=true;const panel=document.getElementById('reference');panel.hidden=false;panel.querySelector('img').src=window.HMPhotos[b.dataset.photo];panel.querySelector('img').alt=b.textContent+' — appearance concept';document.getElementById('status').textContent=b.textContent+' · selected front reference / proposed matching elevation';}));
renderer.setAnimationLoop(()=>{if(!container.hidden){controls.update();renderer.render(scene,camera);}});
window.HMModel={scene,camera,views,view,upper,roofs,renderer};
