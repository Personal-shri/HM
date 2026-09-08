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
controls.maxPolarAngle=Math.PI*.49;controls.minDistance=35;controls.maxDistance=180;
controls.enableDamping=true;
scene.add(new THREE.HemisphereLight(0xf5f5ec,0x929b7e,2.6));
const sun=new THREE.DirectionalLight(0xfff2d6,3);sun.position.set(-40,70,35);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-70,right:70,top:70,bottom:-70,near:1,far:180});sun.shadow.bias=-.0008;scene.add(sun);
const M=(color,roughness=.7)=>new THREE.MeshStandardMaterial({color,roughness});
const wall=M(0xe6e0d0),roofMat=M(0x374447),wood=M(0xa78151),trim=M(0x333f3e),stone=M(0xb8ab94),glass=new THREE.MeshStandardMaterial({color:0x6e9ca7,metalness:.25,roughness:.2}),grass=M(0xb2bca3),pave=M(0xd4cfc1);
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
 }else{
  const plane=orientation==='right'?x+.075:x-.2;
  box(plane,z,depth,w,bottom,h,trim,parent);box(plane+(orientation==='right'?.05:-.05),z+frame,depth,w-2*frame,bottom+frame,h-2*frame,glass,parent);
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
for(const x of [.3,15.3])box(x,47.4,.4,.4,10.9,9.2,wall,roofs);
// Proposed roof shape: gabled rear main roof, front central gable, left canopy.
function gable(x,z,w,d,eave,rise){
 const shape=new THREE.Shape();shape.moveTo(0,0);shape.lineTo(w/2,rise);shape.lineTo(w,0);shape.closePath();
 const geo=new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:false});
 const m=new THREE.Mesh(geo,roofMat);m.position.set(x-22,eave,z-24);m.castShadow=true;roofs.add(m);
}
gable(-.7,-.7,45.4,35.4,20.3,6);gable(15.5,32,15,16.8,20.3,3.4);
box(-.4,33.7,16.8,14.8,20.1,.4,roofMat,roofs);
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
const views={front:[0,18,98],angle:[-68,47,86],rear:[55,38,-88],top:[0,115,1]};
function view(name){camera.position.set(...views[name]);controls.target.set(0,10,0);controls.update();document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>view(b.dataset.view)));
document.getElementById('roof').addEventListener('change',e=>roofs.visible=e.target.checked&&upper.visible);
document.getElementById('upper').addEventListener('change',e=>{upper.visible=e.target.checked;roofs.visible=e.target.checked&&document.getElementById('roof').checked;});
document.getElementById('finish').addEventListener('change',e=>{const palette={ivory:[0xe6e0d0,0x374447],sage:[0xa4afa0,0x45534c],stone:[0xc7b89c,0x333c3e]}[e.target.value];wall.color.setHex(palette[0]);roofMat.color.setHex(palette[1]);document.getElementById('status').textContent='Exterior preview: '+e.target.selectedOptions[0].text+' · layout remains unchanged';});
function resize(){renderer.setSize(container.clientWidth,container.clientHeight);camera.aspect=container.clientWidth/container.clientHeight;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(container);resize();view('angle');
renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera);});
window.HMModel={scene,camera,views,view,upper,roofs,renderer};
