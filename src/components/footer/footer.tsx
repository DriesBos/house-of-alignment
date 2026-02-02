'use client';

import styles from './footer.module.sass';
import Link from 'next/link';
import { useGlobalData } from '@/providers/global-data-provider';
import { ThemeToggle } from '@/components/theme-toggle/theme-toggle';
import { SloganWrapper } from '@/components/slogan-wrapper/slogan-wrapper';

export function Footer() {
  const { globalData } = useGlobalData();

  return (
    <footer className={styles.footer} id="seats">
      <div className={styles.footer_content}>
        <div className={styles.footer_content_left}>
          <div className={styles.logo}>House of Alignment</div>
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
            <SloganWrapper />
            <ThemeToggle />
          </div>
          <div>
            <Link className="cursorInteract" href="/">
              Index
            </Link>
            <Link className="cursorInteract" href="/mentorship">
              Mentorship
            </Link>
            <Link className="cursorInteract" href="/tags/dinner">
              Events
            </Link>
            <Link className="cursorInteract" href="/tags/interview">
              Conversations
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
        </div>
      </div>
    </footer>
  );
}
export default Footer;
