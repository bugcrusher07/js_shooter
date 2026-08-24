import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color('grey');

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.05, 1000 );
camera.position.set(0.0,0,5);


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

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



function animate( time ) {
  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );
