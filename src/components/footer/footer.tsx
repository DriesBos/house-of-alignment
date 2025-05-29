'use client';

import styles from './footer.module.sass';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_content}>
        <div>
          <Link href="/">Directory</Link>
          <Link href="/dashboard">About</Link>
          <Link href="/dashboard">One-on-one</Link>
        </div>
        <div className={styles.footer_content_right}>
          <div>
            <a
              href="www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              instagram
            </a>
            <br />
            <a
              href="mailt:info@houseofalignment.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              info@houseofalignment.com
            </a>
          </div>
          <div>
            <span>( MAKE ENERGY YOUR PRIORITY )</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
