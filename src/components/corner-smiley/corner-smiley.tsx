import ThreeDContainer from '../three-d-container/three-d-container';
import styles from './corner-smiley.module.sass';

const CornerSmiley = () => {
  return (
    <div className={`${styles.cornerSmiley} cornerSmiley cursorInteract`}>
      <ThreeDContainer />
    </div>
  );
};

export default CornerSmiley;
