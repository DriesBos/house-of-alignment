'use client';

import Image from 'next/image';
import styles from './index-blok-general.module.sass';
import IconChair from '@/components/icons/chair';
import IconWrapper from '@/components/icons/icon-wrapper/icon-wrapper';
import Link from 'next/link';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import DateDisplay from '@/components/date-display/date-display';

interface IndexBlokGeneralProps {
  title?: string;
  image?: object & {
    filename: string;
    alt?: string;
  };
  link?: string;
  quote?: string;
  tags?: Array<string>;
  event_date?: string;
  seats?: number;
  isActive?: boolean;
  onImageLoad?: () => void;
}

export default function IndexBlokGeneral({
  title,
  image,
  link,
  quote,
  tags,
  event_date,
  seats,
  isActive,
  onImageLoad,
}: IndexBlokGeneralProps) {
  // Determine if event is in the future (not past)
  const isEventInFuture = event_date
    ? new Date(event_date) >= new Date(new Date().toDateString())
    : false;

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.opacity = '1';

    // Notify parent that image has loaded
    if (onImageLoad) {
      onImageLoad();
    }

    // Refresh ScrollTrigger after image loads to recalculate heights
    if (typeof window !== 'undefined' && ScrollTrigger) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }
  };

  return (
    <Link href={'/' + link}>
      <div className={styles.indexBlokGeneral}>
        <div className={styles.imageContainer}>
          {image && image.filename && !quote && (
            <Image
              src={`${image.filename}/m/filters:quality(60)`}
              alt={image.alt || title || 'Image'}
              width={800}
              height={600}
              unoptimized
              loading="eager"
              priority={true}
              className="imageLoad cursorInteract"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyDYRXGTkKoJHrWp2rStabOyBa1KvKw5YxJ7Sj5wJTnzuHQjdqMcvqEXsZqd/JZfLCqfz8t5rjjX9cfjVf0Jj/c8f8ACSkV4K1/pT9wR/lFaHCp9kqh6ZGC6Vd+lj1/rOAKfZe/w="
              style={{ width: '100%', height: 'auto' }}
              onLoad={handleImageLoad}
            />
          )}
          {quote && (
            <div className={`${styles.quoteBlok} quoteBlok cursorInteract`}>
              <span>&ldquo;{quote}&rdquo;</span>
            </div>
          )}
          {seats && isEventInFuture && (
            <Link
              className="cursorInteract"
              href={'/' + link + '#seats'}
              scroll={false}
            >
              <div className={styles.seats}>
                <IconWrapper>
                  <IconChair />
                </IconWrapper>
                <span>{seats}</span>
              </div>
            </Link>
          )}
          {(tags || isActive) && (
            <div className={styles.tags}>
              {isActive && (
                <div
                  className={`${styles.eventDateOpen} ${styles.tag} cursorInteract`}
                >
                  <span>RSVP</span>
                </div>
              )}

              {tags &&
                tags.map((tag) => (
                  <div className={styles.tag} key={tag}>
                    <Link
                      className="cursorInteract"
                      href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <span>{tag}</span>
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </div>
        <div className={`${styles.title} cursorInteract`}>
          {title}
          {event_date && <DateDisplay date={event_date} />}
        </div>
      </div>
    </Link>
  );
}
