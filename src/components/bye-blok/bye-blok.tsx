import ThreeDContainer from '../three-d-container/three-d-container';
import styles from './bye-blok.module.sass';

const ByeBlok = () => {
  return (
    <div className={`${styles.byeBlok} cursorInteract`}>
      <ThreeDContainer />
    </div>
  );
};

export default ByeBlok;
