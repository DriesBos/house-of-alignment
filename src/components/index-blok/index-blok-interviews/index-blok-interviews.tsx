'use client';

import Image from 'next/image';
import styles from './index-blok-interviews.module.sass';
import DateDisplay from '@/components/date-display/date-display';
import { useRouter } from 'next/navigation';

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
}: IndexBlokInterviewsProps) {
  const router = useRouter();

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push('/' + link);
      }}
      className={styles.indexBlokInterviews}
    >
      <div className={styles.aboveImage}>{title}</div>
      <div className={styles.imageContainer}>
        {image && image.filename && !quote && (
          <Image
            src={`${image.filename}/m/filters:quality(60)`}
            alt={image.alt || title || 'Image'}
            width={800}
            height={600}
            unoptimized
            loading="lazy"
            className="imageLoad cursorInteract"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyDYRXGTkKoJHrWp2rStabOyBa1KvKw5YxJ7Sj5wJTnzuHQjdqMcvqEXsZqd/JZfLCqfz8t5rjjX9cfjVf0Jj/c8f8ACSkV4K1/pT9wR/lFaHCp9kqh6ZGC6Vd+lj1/rOAKfZe/w="
            style={{ width: '100%', height: '100%' }}
            onLoad={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          />
        )}
        {quote && (
          <div className={`${styles.quoteBlok} quoteBlok cursorInteract`}>
            <span>&ldquo;{quote}&rdquo;</span>
          </div>
        )}
      </div>

      <div className={styles.belowImage}>
        <div className={`cursorInteract`}>
          <div>{event_date && <DateDisplay date={event_date} />}</div>
          <div>
            {(tags || isActive) && (
              <div>
                {isActive && (
                  <div className={`${styles.eventDateOpen} cursorInteract`}>
                    <span>Open</span>
                  </div>
                )}

                {tags &&
                  tags.map((tag) => (
                    <div
                      className={`${styles.tag} cursorInteract`}
                      key={tag}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(
                          `/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`,
                        );
                      }}
                    >
                      <span>#{tag}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
        <div className={`${styles.descr} cursorInteract`}>
          <p>{descr}</p>
        </div>
      </div>
    </div>
  );
}
