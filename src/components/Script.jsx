import {useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let currentMount = null;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75,100/100, 0.1, 1000)
camera.position.z = 5;
scene.add(camera);

const textureLoader = new THREE.TextureLoader();
const matcap = textureLoader.load('../src/img/matcap.jpg');
const brick = textureLoader.load('../src/img/textures/red_brick_diff_4k.jpg');
const brickDisp = textureLoader.load('../src/img/textures/red_brick_disp_4k.jpg')
const gltfLoader = new GLTFLoader();
gltfLoader.load('../amongus.gltf',
    (gltf)=>{
        scene.add(gltf.scene);
    },
    ()=>{},
    ()=>{}
)

const cubeMap = new THREE.CubeTextureLoader();
const envMap = cubeMap.load([
    '../src/img/px.png',
    '../src/img/nx.png',
    '../src/img/py.png',
    '../src/img/ny.png',
    '../src/img/pz.png',
    '../src/img/nz.png',
]
);
scene.environment = envMap;
scene.background = envMap;

const ambientLight = new THREE.AmbientLight( 0x404040, 0 );
const light = new THREE.PointLight( 0xffffff, 10, 100 );
light.position.set(0,2, 2);
scene.add(ambientLight, light);

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshStandardMaterial({
        map: brick,
        displacementMap: brickDisp
})
)
cube.position.x = -1;
//scene.add(cube);

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 16),
    new THREE.MeshMatcapMaterial({matcap: matcap})
)
sphere.position.x = 1;
//scene.add(sphere);

const torusKnot = new THREE.Mesh( 
    new THREE.TorusKnotGeometry(  10, 3, 100, 16 ), 
    new THREE.MeshMatcapMaterial({matcap: matcap})
); 
torusKnot.position.y = -1;
torusKnot.scale.set(0.03,0.03,0.03);
//scene.add( torusKnot );


const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.y = 1;

const resize = () => {
    renderer.setSize(
        currentMount.clientWidth,
        currentMount.clientHeight
    )
    camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);


const animate = () => {
//    cube.rotation.y += 0.01;
//    torusKnot.rotation.y += 0.01;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();


export const mountScene = (mountRef) => {
    currentMount = mountRef.current;
    resize()
    currentMount.appendChild(renderer.domElement);
}

export const cleanScene = () => {
    //scene.dispose();
    currentMount.removeChild(renderer.domElement);
}

