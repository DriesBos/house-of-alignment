'use client';

import styles from './three-d-container.module.sass';
import {
  Canvas,
  useFrame,
  useThree as useThreeFiber,
} from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Suspense, useEffect, useMemo, useRef } from 'react';

// function Smiley() {
//   const { scene } = useGLTF('./scenes/HOA-blender-rotation.glb');
//   return <primitive object={scene} />;
// }

function Scene() {
  const meshRef = useRef<THREE.Group>(null);
  const gltf = useLoader(GLTFLoader, '/models/HOA-blender-rotation.glb');
  const { scene, gl } = useThreeFiber();
  const sceneInstance = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useEffect(() => {
    if (sceneInstance && gl) {
      // Set fog color (matching Material Browser)
      scene.fog = new THREE.Fog(0xffffff, 0, 1000);

      // Use RoomEnvironment like Material Browser does
      // This provides realistic indoor lighting environment with proper lighting setup
      const pmremGenerator = new THREE.PMREMGenerator(gl);
      pmremGenerator.compileEquirectangularShader();

      // Create RoomEnvironment (includes its own lighting setup)
      const roomEnvironment = new RoomEnvironment();
      const envMap = pmremGenerator.fromScene(roomEnvironment, 0.04).texture;

      // Set environment on scene (Material Browser does this)
      // This automatically provides environment lighting to all materials
      scene.environment = envMap;

      // Create material with enhanced settings for shiny aluminum
      // Based on MeshPhysicalMaterial documentation: https://threejs.org/docs/#MeshPhysicalMaterial
      const aluminumMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x949494,
        emissive: 0x000000,

        // Core metallic properties
        metalness: 1.0, // Fully metallic
        roughness: 0.05, // Lower roughness = more shiny (was 0.15)

        // Reflection properties
        reflectivity: 0.9, // Higher reflectivity for more shine (was 0.5)
        ior: 1.5, // Index of refraction

        // Clearcoat layer for extra shine (like polished aluminum)
        clearcoat: 1.0, // Full clearcoat layer for maximum shine
        clearcoatRoughness: 0.05, // Smooth clearcoat for mirror-like finish

        // Specular properties
        specularIntensity: 1.0,
        specularColor: 0xffffff,

        // Anisotropy for directional shine (optional, can enhance metallic look)
        anisotropy: 0.0, // Set to 0.1-0.5 for brushed aluminum effect, 0 for smooth
        anisotropyRotation: 0,

        // Sheen and iridescence (not needed for aluminum, but keeping for reference)
        sheen: 0,
        sheenColor: 0x000000,
        iridescence: 0,
        iridescenceIOR: 1.3,
        sheenRoughness: 1,

        // Environment map
        envMap: envMap,
        envMapIntensity: 2.0, // Higher intensity for stronger reflections (was 1.5)

        // Material properties
        fog: true,
        opacity: 0,
        alphaTest: 0,
        side: THREE.FrontSide,
      });

      // Apply material to all meshes in the scene
      sceneInstance.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = aluminumMaterial;
        }
      });

      // Cleanup
      return () => {
        pmremGenerator.dispose();
        envMap.dispose();
        aluminumMaterial.dispose();
      };
    }
  }, [sceneInstance, scene, gl]);

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
      <primitive ref={meshRef} object={sceneInstance} />
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
        style={{ touchAction: 'none' }}
      >
        {/* RoomEnvironment provides lighting, no additional lights needed */}
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeDContainer;
