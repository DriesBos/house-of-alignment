'use client';

import styles from './footer.module.sass';
import Link from 'next/link';
import { useGlobalData } from '@/providers/global-data-provider';

export function Footer() {
  const { globalData } = useGlobalData();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer_content}>
        <div>
          <Link href="/">Directory</Link>
          <Link href="/about">About</Link>
          <Link href="/one-on-one">One-on-one</Link>
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
