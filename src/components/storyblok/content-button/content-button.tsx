import Link from 'next/link';
import { SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import styles from './content-button.module.sass';

interface StoryblokLink {
  cached_url?: string;
  url?: string;
  target?: '_blank' | '_self' | '_parent' | '_top' | string;
}

interface SbContentButtonData extends SbBlokData {
  'button-title'?: string;
  'button-link'?: StoryblokLink;
  button_title?: string;
  button_link?: StoryblokLink;
  fullscreen?: boolean;
}

interface ContentButtonProps {
  blok: SbContentButtonData;
}

const EXTERNAL_PROTOCOL_PATTERN = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i;
const SPECIAL_LINK_PATTERN = /^(?:mailto:|tel:|#)/i;
const DOMAIN_PATTERN = /^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:[/?#]|$)/i;

const getHref = (rawHref?: string, target?: string) => {
  if (!rawHref) return '';

  if (EXTERNAL_PROTOCOL_PATTERN.test(rawHref) || SPECIAL_LINK_PATTERN.test(rawHref)) {
    return rawHref;
  }

  if (target === '_blank' && DOMAIN_PATTERN.test(rawHref)) {
    return `https://${rawHref}`;
  }

  return rawHref.startsWith('/') ? rawHref : `/${rawHref}`;
};

const isExternalHref = (href: string, target?: string) =>
  target === '_blank' || EXTERNAL_PROTOCOL_PATTERN.test(href) || SPECIAL_LINK_PATTERN.test(href);

export default function ContentButton({ blok }: ContentButtonProps) {
  const buttonTitle = blok.button_title || blok['button-title'];
  const buttonLink = blok.button_link || blok['button-link'];
  const { url, cached_url: cachedUrl, target } = buttonLink || {};
  const href = getHref(url || cachedUrl, target);
  const isExternal = isExternalHref(href, target);
  const className = `${styles.button} cursorInteract`;

  return (
    <div
      className={styles.contentButton}
      {...storyblokEditable(blok)}
      data-fullscreen={blok.fullscreen || false}
    >
      {buttonTitle && href && (
        isExternal ? (
          <a
            href={href}
            target={target || '_self'}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            className={className}
          >
            {buttonTitle}
          </a>
        ) : (
          <Link href={href} className={className}>
            {buttonTitle}
          </Link>
        )
      )}
    </div>
  );
}
