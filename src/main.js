import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color('grey');
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.05, 1000 );
camera.position.set(0,0,5);


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//const controls = new OrbitControls( camera, renderer.domElement );
//controls.update();

const light = new THREE.HemisphereLight(0xffffff, 0x444444, 3);
scene.add(light);

const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

let fire = null;
let mixer = null;
let reload = null

const loader = new GLTFLoader();

async function loadGun()
{
const gltf = await loader.load(
    'scifi_pistol.glb',

    function (gltf) {

	let model = gltf.scene;
	model.scale.set(0.006,0.006,0.006);
	model.position.set(camera.position.x+0.2,camera.position.y-0.23,camera.position.z-0.5);
	model.rotateY(Math.PI);

        scene.add(model);

	const animations = gltf.animations;
	mixer = new THREE.AnimationMixer(model);
	//const animationAction = new THREE.AnimationAction(mixer,animations[0],
	fire = mixer.clipAction(animations[0]);

	reload = mixer.clipAction(THREE.AnimationUtils.subclip(animations[0],'reload',19,50,30));

	reload.setLoop(THREE.LoopOnce);

	fire._clip.duration = 0.55
	fire.setLoop(THREE.LoopOnce);
	fire.clampWhenFinished = true;
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error happened', error);
    }
);
}

async function loadZombie(position,scale)
{
const gltf = await loader.load(
    'zombie.glb',

    function (gltf) {
	let model = gltf.scene;
	if ( position && scale ){
		model.position.set(position);
		model.scale.set(scale);
	}
	model.position.set(camera.position.x+4,camera.position.y-0.23,camera.position.z-0.5);
	model.rotateY(Math.PI);
	console.log(model);
        scene.add(model);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error happened', error);
    }
);
}

async function loadSmiley()
{
const gltf = await loader.load(
    'smiley.glb',
    function (gltf) {
	let model = gltf.scene;
	console.log('smiley loaded');
	model.scale.set(0.006,0.006,0.006);
	model.position.set(camera.position.x+0.3,camera.position.y-0.23,camera.position.z-0.5);
	model.rotateY(Math.PI);

	console.log('smiley model',model.animations);
        scene.add(model);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error happened', error);
    }
);
}


//loadSmiley();
loadGun();
//loadZombie();

//black wall
const backWallGeometry = new THREE.BoxGeometry( 5,1,.05);
const backWallMaterial = new THREE.MeshBasicMaterial( { color: 0x2D63F7} );
const backWall= new THREE.Mesh( backWallGeometry, backWallMaterial );
const edges = new THREE.EdgesGeometry( backWallGeometry );
//const line = new THREE.LineSegments( edges );
const backBox = new THREE.BoxHelper( backWall, 0x000000 );
scene.add(backBox);
scene.add( backWall);

//left wall
const leftWallGeometry = new THREE.BoxGeometry(5,1,0.1);
const leftWallMaterial = new THREE.MeshBasicMaterial( { color: 0xF7BB2D} );
const leftWall= new THREE.Mesh( leftWallGeometry, leftWallMaterial );
leftWall.position.set(-2.5,0,2.5);
leftWall.rotateY(Math.PI/2);
scene.add( leftWall);
const leftBox = new THREE.BoxHelper( leftWall, 0x000000 );
scene.add(leftBox);

//right wall
const rightWallGeometry = new THREE.BoxGeometry( 5,1,0.1);
const rightWallMaterial = new THREE.MeshBasicMaterial( { color: 0xF7BB2D} );
const rightWall= new THREE.Mesh( rightWallGeometry, rightWallMaterial );
rightWall.position.set(2.5,0,2.5);
rightWall.rotateY(Math.PI/2);
scene.add( rightWall);
const rightBox = new THREE.BoxHelper( rightWall, 0x000000 );
scene.add(rightBox);

//ground wall
const groundGeometry = new THREE.BoxGeometry( 5,0.1,5);
const groundMaterial = new THREE.MeshBasicMaterial( { color: 0x664905} );
const ground= new THREE.Mesh( groundGeometry, groundMaterial );
ground.position.set(0,-0.5,2.5);
ground.rotateY(Math.PI/2);
scene.add( ground);

//separating beams
const leftBeamGeometry = new THREE.BoxGeometry( 4.5,.3,0.01);
const leftBeamMaterial = new THREE.MeshBasicMaterial( { color: 0x000000} );
const leftBeam= new THREE.Mesh( leftBeamGeometry, leftBeamMaterial );
leftBeam.position.set(1,-.3,1.9);
leftBeam.rotateY(Math.PI/2);
scene.add( leftBeam);

const rightBeamGeometry = new THREE.BoxGeometry( 4.5,.3,0.01);
const rightBeamMaterial = new THREE.MeshBasicMaterial( { color: 0x000000} );
const rightBeam= new THREE.Mesh( rightBeamGeometry, rightBeamMaterial );
rightBeam.position.set(-1,-.3,1.9);
rightBeam.rotateY(Math.PI/2);
scene.add( rightBeam);

//crosshair
const planeGeometry = new THREE.BoxGeometry( .1,.01,.01 );
const planeMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.position.set(0,0,2);
plane.setRotationFromEuler(camera.rotation);
scene.add( plane );

const crossGeometry = new THREE.BoxGeometry( 0.1,.01,.01 );
const crossMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00} );
const cross = new THREE.Mesh( crossGeometry, crossMaterial );
cross.position.set(0,0,2);
cross.setRotationFromEuler(camera.rotation);
cross.rotateZ(Math.PI/2);
scene.add(cross);


//clamp function
function clamp(val,min,max){
	return Math.min(Math.max(min,val),max);
}

// player controller fps

//left right movement
document.addEventListener('keydown',(e)=>{
	if ( e.code === 'KeyA'){
		camera.position.set( clamp((camera.position.x -0.1),-2.3,2.3),camera.position.y,camera.position.z);
	}
	if ( e.code === 'KeyD'){
		camera.position.set( clamp((camera.position.x +0.1),-2.3,2.3),camera.position.y,camera.position.z);
	}
})

/*
let mouseRotationMovement= null;
if ( window.innerWidth){
mouseRotationMovement= window.innerWidth / 180;
}
*/
//mousemove input


// Initialize controls
const controls = new PointerLockControls(camera, document.body);
controls.maxPolarAngle = Math.PI;
controls.minPolarAngle = -Math.PI;
console.log(controls.minPolarAngle);


//input delay
let fireCooldown = 1;
let reloadCooldown = 1;
let fireActive = false;
let reloadActive = false;

// input for shooting
document.addEventListener('click',(e)=>{
	if ( fireActive  === false ){
	fire.play();
	fire.reset(); 
	fireActive = true;
	}
})
//input for reload 
document.addEventListener('keydown',(e)=>{
	if ( e.code === 'KeyR'){
		if ( reloadActive=== false){
		console.log(reload);
		reload.play();
		reload.reset();
		reloadActive = true;
		}
	}
	if ( e.code === 'KeyY'){
		controls.lock(true);
	}
})

const timer= new THREE.Timer();
function animate( time ) { 

	camera.rotation.x = THREE.MathUtils.clamp(camera.rotation.x,THREE.MathUtils.degToRad(-20), THREE.MathUtils.degToRad(20))
	camera.rotation.z = THREE.MathUtils.degToRad(0);

	if ( fireActive === true){
		fireCooldown-= timer.getDelta()*3;
	}
	if ( fireCooldown< 0) 
	{ fireActive = false; fireCooldown = 1;}

	if ( reloadActive === true){
		reloadCooldown-= timer.getDelta();
	}
	if ( reloadCooldown< 0) 
	{ reloadActive = false; reloadCooldown= 1;}


	if ( mixer ){
		timer.update();
		mixer.update(timer.getDelta());
	}

  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );



