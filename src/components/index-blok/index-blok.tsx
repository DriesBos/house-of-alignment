import Image from 'next/image';
import styles from './index-blok.module.sass';
import IconChair from '@/components/icons/chair';
import IconWrapper from '@/components/icons/icon-wrapper/icon-wrapper';
import Link from 'next/link';

interface IndexBlokProps {
  title?: string;
  image?: {
    filename: string;
    alt: string;
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
  console.log('IndexBlok', { title, image, link, tags, seats });
  return (
    <div className={styles.indexBlok}>
      <Link href={'/' + link}>
        <div className={styles.title}>{title}</div>
        <div className={styles.imageContainer}>
          {image && (
            <Image
              src={image.filename}
              alt={image.alt}
              width={0}
              height={0}
              quality={40}
              loading="eager"
              priority={true}
              className="imageLoad"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyDYRXGTkKoJHrWp2rStabOyBa1KvKw5YxJ7Sj5wJTnzuHQjdqMcvqEXsZqd/JZfLCqfz8t5rjjX9cfjVf0Jj/c8f8ACSkV4K1/pT9wR/lFaHCp9kqh6ZGC6Vd+lj1/rOAKfZe/w="
              onLoad={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
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
                  <Link href={'/' + tag}>
                    <span>{tag}</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
