'use client';

import Image from 'next/image';
import styles from './index-blok.module.sass';
import IconChair from '@/components/icons/chair';
import IconWrapper from '@/components/icons/icon-wrapper/icon-wrapper';
import Link from 'next/link';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

interface IndexBlokProps {
  title?: string;
  image?: object & {
    filename: string;
    alt?: string;
  };
  link?: string;
  tags?: Array<string>;
  seats?: number;
}

export default function IndexBlok({
  title,
  image,
  link,
  tags,
  seats,
}: IndexBlokProps) {
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.opacity = '1';

    // Refresh ScrollTrigger after image loads to recalculate heights
    if (typeof window !== 'undefined' && ScrollTrigger) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }
  };

  return (
    <div className={styles.indexBlok}>
      <div className={styles.title}>
        <Link href={'/' + link}>{title}</Link>
      </div>
      <div className={styles.imageContainer}>
        {image && image.filename && (
          <Image
            src={image.filename}
            alt={image.alt || title || 'Image'}
            width={800}
            height={600}
            quality={40}
            loading="eager"
            priority={true}
            className="imageLoad"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyDYRXGTkKoJHrWp2rStabOyBa1KvKw5YxJ7Sj5wJTnzuHQjdqMcvqEXsZqd/JZfLCqfz8t5rjjX9cfjVf0Jj/c8f8ACSkV4K1/pT9wR/lFaHCp9kqh6ZGC6Vd+lj1/rOAKfZe/w="
            style={{ width: '100%', height: 'auto' }}
            onLoad={handleImageLoad}
          />
        )}
        {seats && (
          <div className={styles.seats}>
            <IconWrapper>
              <IconChair />
            </IconWrapper>
            <span>{seats}</span>
          </div>
        )}
        {tags && (
          <div className={styles.tags}>
            {tags.map((tag) => (
              <div className={styles.tag} key={tag}>
                <Link href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                  <span>{tag}</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
