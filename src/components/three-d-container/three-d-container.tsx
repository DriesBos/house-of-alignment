'use client';

import styles from './three-d-container.module.sass';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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
  const { gl } = useThree();

  useEffect(() => {
    if (gltf.scene && gl) {
      // Create environment map for reflections
      // Create a simple environment scene for reflections
      const envScene = new THREE.Scene();

      // Create a large sphere with gradient-like lighting for environment
      const envGeometry = new THREE.SphereGeometry(100, 32, 32);
      const envMaterial = new THREE.MeshBasicMaterial({
        color: 0x222222,
        side: THREE.BackSide,
      });
      const envMesh = new THREE.Mesh(envGeometry, envMaterial);
      envScene.add(envMesh);

      // Add directional lights to create interesting reflections
      const envLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
      envLight1.position.set(10, 10, 10);
      envScene.add(envLight1);

      const envLight2 = new THREE.DirectionalLight(0xaaaaaa, 0.4);
      envLight2.position.set(-10, -10, -10);
      envScene.add(envLight2);

      const envLight3 = new THREE.DirectionalLight(0xcccccc, 0.3);
      envLight3.position.set(0, 10, -10);
      envScene.add(envLight3);

      // Create cube render target for environment map
      const renderTarget = new THREE.WebGLCubeRenderTarget(256, {
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType,
      });

      const cubeCamera = new THREE.CubeCamera(0.1, 1000, renderTarget);
      cubeCamera.update(gl, envScene);

      // Use the cube texture as environment map for reflections
      const envMap = renderTarget.texture;

      // Create aluminum material with environment map
      const aluminumMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff, // Natural aluminum color (bright silver)
        metalness: 1, // High metalness for metallic look
        roughness: 0.33, // Slightly higher roughness for natural aluminum
        envMap: envMap, // Environment map for reflections
        envMapIntensity: 2, // Higher environment reflection for brightness
      });

      // Apply aluminum material to all meshes in the scene
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = aluminumMaterial;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Cleanup
      return () => {
        renderTarget.dispose();
        envMap.dispose();
        envGeometry.dispose();
        envMaterial.dispose();
      };
    }
  }, [gltf.scene, gl]);

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
