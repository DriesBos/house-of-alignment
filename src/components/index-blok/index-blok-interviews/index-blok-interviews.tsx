'use client';

import Image from 'next/image';
import styles from './index-blok-interviews.module.sass';
import Link from 'next/link';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import DateDisplay from '@/components/date-display/date-display';

interface IndexBlokInterviewsProps {
  title?: string;
  descr?: string;
  image?: object & {
    filename: string;
    alt?: string;
  };
  link?: string;
  quote?: string;
  tags?: Array<string>;
  event_date?: string;
  isActive?: boolean;
  onImageLoad?: () => void;
}

export default function IndexBlokInterviews({
  title,
  descr,
  image,
  link,
  quote,
  tags,
  event_date,
  isActive,
  onImageLoad,
}: IndexBlokInterviewsProps) {
  // Determine if event is active (in the future)

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
    <div className={styles.indexBlokInterviews}>
      <div className={styles.imageContainer}>
        {image && image.filename && !quote && (
          <Image
            src={image.filename}
            alt={image.alt || title || 'Image'}
            width={800}
            height={600}
            quality={33}
            loading="eager"
            priority={true}
            className="imageLoad"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyDYRXGTkKoJHrWp2rStabOyBa1KvKw5YxJ7Sj5wJTnzuHQjdqMcvqEXsZqd/JZfLCqfz8t5rjjX9cfjVf0Jj/c8f8ACSkV4K1/pT9wR/lFaHCp9kqh6ZGC6Vd+lj1/rOAKfZe/w="
            style={{ width: '100%', height: 'auto' }}
            onLoad={handleImageLoad}
          />
        )}
        {quote && (
          <div className={`${styles.quoteBlok} quoteBlok`}>
            <span>"{quote}"</span>
          </div>
        )}
        {(tags || isActive) && (
          <div className={styles.tags}>
            {isActive && (
              <div className={`${styles.eventDateOpen} ${styles.tag}`}>
                <span>Open</span>
              </div>
            )}

            {tags &&
              tags.map((tag) => (
                <div className={styles.tag} key={tag}>
                  <Link
                    href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <span>{tag}</span>
                  </Link>
                </div>
              ))}
          </div>
        )}
      </div>
      <div className={styles.bottom}>
        <div className={styles.title}>
          <Link href={'/' + link}>{title}</Link>
          {event_date && <DateDisplay date={event_date} />}
        </div>
        <div className={styles.descr}>
          <p>{descr}</p>
        </div>
      </div>
    </div>
  );
}
