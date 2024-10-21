import {useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { cleanScene, mountScene } from './Script';

const Scene = () => {
    const mountRef = useRef(null);
    
    useEffect( () => {
    mountScene(mountRef)

        // Cleanup para evitar que se generen múltiples canvas
    return () => {
    // Eliminar el canvas del DOM
    //currentMount.removeChild(renderer.domElement);
        cleanScene();
    };

    }, [])
    

  return (
    <div
        className='componente3D'
        ref={mountRef}
        style={{width: '100%', height: '100vh'}}
    >
    </div>
  )
}

export default Scene
