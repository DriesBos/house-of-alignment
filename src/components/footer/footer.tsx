'use client';

import styles from './footer.module.sass';
import Link from 'next/link';
import { useGlobalData } from '@/providers/global-data-provider';

export function Footer() {
  const { globalData } = useGlobalData();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer_content}>
        <div className={styles.footer_content_left}>
          <p>House of Alignment</p>
          <p className="bradford">
            Home of visionary founders.
            <br />
            Where your next bold move begins.
            <br />
            Trust your vision. <Link href="/about"> (more)</Link>
          </p>
        </div>
        <div>
          <Link href="/">Archive</Link>
          <Link href="/about">Dinners</Link>
          <Link href="/one-on-one">Interviews</Link>
          <Link href="/one-on-one">About</Link>
        </div>
        <div className={styles.footer_content_right}>
          <div>
            <a
              href={globalData.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              instagram
            </a>
            <br />
            <a
              href={`mailto:${globalData.email}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {globalData.email}
            </a>
          </div>
          <div>
            <span>( {globalData.slogan} )</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
