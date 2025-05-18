'use client';

import styles from './three-d-container.module.sass';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import DragonScene from './scenes/dragon';

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
        camera={{ fov: 45, near: 0.1, far: 200, position: [0, 0, 5] }}
        linear
        flat
      >
        <DragonScene />
      </Canvas>
    </div>
  );
};

export default ThreeDContainer;
