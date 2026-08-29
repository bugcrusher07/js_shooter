import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color('grey');
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.05, 1000 );
camera.position.set(0,0,5);


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

const light = new THREE.HemisphereLight(0xffffff, 0x444444, 3);
scene.add(light);

const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

let fire = null;
let mixer = null;
let reload = null

const loader = new GLTFLoader();

async function loadGLTF(){

const gltf = await loader.load(
    'scifi_pistol.glb',

    function (gltf) {

	let model = gltf.scene;
	model.scale.set(0.006,0.006,0.006);
	model.position.set(camera.position.x+0.3,camera.position.y-0.23,camera.position.z-0.5);
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
loadGLTF();

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
})


const timer= new THREE.Timer();
function animate( time ) {
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



