'use client';

import styles from './footer.module.sass';
import Link from 'next/link';
import { useGlobalData } from '@/providers/global-data-provider';
import { ThemeToggle } from '@/components/theme-toggle/theme-toggle';

export function Footer() {
  const { globalData } = useGlobalData();

  return (
    <footer className={styles.footer} id="seats">
      <div className={styles.footer_content}>
        <div className={styles.footer_content_left}>
          <div className={styles.logo}>H.O.A.</div>
          <p>
            Home of visionary founders.
            <br />
            Where your next bold move begins.
            <br />
            Trust your vision.{' '}
            <Link className="cursorInteract" href="/about">
              {' '}
              (more)
            </Link>
          </p>
        </div>
        <div className={styles.footer_content_right}>
          <div>
            <Link className="cursorInteract" href="/">
              Home
            </Link>
            <Link className="cursorInteract" href="/tags/gatherings">
              Gatherings
            </Link>
            <Link className="cursorInteract" href="/programmes">
              Our Programmes
            </Link>
            <Link className="cursorInteract" href="/tags/founderstories">
              Founder Stories
            </Link>
            <Link className="cursorInteract" href="/about">
              About
            </Link>
          </div>
          <div>
            <a
              href={globalData.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="cursorInteract"
            >
              instagram
            </a>
            <a
              href={`mailto:${globalData.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cursorInteract"
            >
              {globalData.email}
            </a>
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
