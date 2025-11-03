import Image from 'next/image';
import styles from './index-blok.module.sass';

interface IndexBlokProps {
  title?: string;
  image?: {
    filename: string;
    alt: string;
  };
}

export default function IndexBlok({ title, image }: IndexBlokProps) {
  return (
    <div className={styles.indexBlok}>
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
      </div>
    </div>
  );
}
