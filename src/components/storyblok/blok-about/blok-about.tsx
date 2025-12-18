import Link from 'next/link';
import styles from './blok-about.module.sass';

export default function BlokAbout() {
  return (
    <div className={styles.blokAbout}>
      <h1>
        Coaching,
        <br />
        Community,
        <br />
        Creative Tools
        <span>
          <Link className="cursorInteract" href="/about">
            ( about )
          </Link>
        </span>
      </h1>
    </div>
  );
}
