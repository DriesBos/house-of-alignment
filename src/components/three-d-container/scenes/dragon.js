'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

export default function ThreeContainer() {
  const modelRef = useRef(null);
  const { camera, gl } = useThree();
  const model = useGLTF('/models/dragon.gltf');

  useEffect(() => {
    if (model.scene) {
      model.scene.traverse((child) => {
        if (child.isMesh && child.material) {
          // child.material.transparent = true;
          // child.material.depthWrite = false;
          // child.material.depthTest = true;
          // child.material.side = 2; // THREE.DoubleSide
          // child.material.alphaToCoverage = true;
          // child.material.needsUpdate = true;
        }
      });
    }
  }, [model]);

  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta;
    }
  });

  return (
    <>
      <ambientLight intensity={1.0} />
      <directionalLight
        position={[-5, 3, 5]}
        intensity={2}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <OrbitControls
        args={[camera, gl.domElement]}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
      />

      <primitive
        ref={modelRef}
        object={model.scene}
        position={[0, -1.5, 0]}
        scale={1}
      />
    </>
  );
}
