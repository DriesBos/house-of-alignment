'use client';

import dynamic from 'next/dynamic';
import styles from './bye-blok.module.sass';

const ThreeDContainer = dynamic(
  () => import('../three-d-container/three-d-container'),
  { ssr: false }
);

const ByeBlok = () => {
  return (
    <div className={`${styles.byeBlok} cursorInteract`}>
      <ThreeDContainer className={styles.threeDContainerByeBlok} />
    </div>
  );
};

export default ByeBlok;
