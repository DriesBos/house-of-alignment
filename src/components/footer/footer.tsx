'use client';

import styles from './footer.module.sass';
import Link from 'next/link';
import { useGlobalData } from '@/providers/global-data-provider';
import { ScrambledSlogans } from '@/components/scrambled-slogans/scrambled-slogans';

export function Footer() {
  const { globalData } = useGlobalData();

  return (
    <footer className={styles.footer} id="seats">
      <div className={styles.footer_content}>
        <div className={styles.footer_content_left}>
          <p className={styles.logo}>House of Alignment</p>
          <p className="bradford">
            Home of visionary founders.
            <br />
            Where your next bold move begins.
            <br />
            Trust your vision. <Link href="/about"> (more)</Link>
          </p>
        </div>
        <div className={styles.footer_content_center}>
          <Link href="/">Archive</Link>
          <Link href="/tags/dinner">Dinners</Link>
          <Link href="/tags/interview">Interviews</Link>
          <Link href="/about">About</Link>
        </div>
        <div className={styles.footer_content_right}>
          <div className={styles.slogan}>
            {globalData.slogans &&
              Array.isArray(globalData.slogans) &&
              globalData.slogans.length > 0 && (
                <ScrambledSlogans slogans={globalData.slogans} />
              )}
          </div>
          <a
            href={globalData.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            instagram
          </a>
          <a
            href={`mailto:${globalData.email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {globalData.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
