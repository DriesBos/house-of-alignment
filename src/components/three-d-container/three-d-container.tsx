'use client';

import styles from './three-d-container.module.sass';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useRef, useEffect } from 'react';

// function Smiley() {
//   const { scene } = useGLTF('./scenes/HOA-blender-rotation.glb');
//   return <primitive object={scene} />;
// }

function Scene() {
  const meshRef = useRef<THREE.Group>(null);
  const gltf = useLoader(GLTFLoader, '/models/HOA-blender-rotation.glb');

  useEffect(() => {
    if (gltf.scene) {
      // Create aluminum material
      const aluminumMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff, // Natural aluminum color (bright silver)
        metalness: 0.85, // High metalness for metallic look
        roughness: 0.15, // Slightly higher roughness for natural aluminum
        envMapIntensity: 1.5, // Higher environment reflection for brightness
      });

      // Apply aluminum material to all meshes in the scene
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = aluminumMaterial;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [gltf.scene]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate around Y-axis (vertical) - complete rotation in 10 seconds
      meshRef.current.rotation.y += (Math.PI * 2 * delta) / 10;
    }
  });

  return (
    <>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
      />
      <primitive ref={meshRef} object={gltf.scene} />
    </>
  );
}

interface ThreeDContainerProps {
  className?: string;
}

const ThreeDContainer: React.FC<ThreeDContainerProps> = ({
  className,
}: ThreeDContainerProps) => {
  return (
    <div className={`${styles.threeDContainer} ${className}`}>
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.NoToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          powerPreference: 'high-performance',
          // alpha: true,
          preserveDrawingBuffer: true,
          premultipliedAlpha: true,
        }}
        camera={{ fov: 35, near: 0.1, far: 200, position: [0, 0, 15] }}
        linear
        flat
      >
        {/* Enhanced lighting for bright metallic material */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[-10, 10, 5]} intensity={2.5} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={1.2} />
        <hemisphereLight args={[0xffffff, 0x444444, 0.6]} />
        <Scene />
      </Canvas>
    </div>
  );
};

export default ThreeDContainer;
