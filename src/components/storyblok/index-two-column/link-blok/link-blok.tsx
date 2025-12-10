import styles from './link-blok.module.sass';
import Link from 'next/link';

interface StoryLink {
  title: string;
  tags: string[];
  link: string;
}

interface LinkBlokProps {
  tag: string;
  stories: StoryLink[];
}
export default function LinkBlok({ tag, stories }: LinkBlokProps) {
  // If tag is "Dinner", show a list of all unique tags (excluding "Dinner")
  const isDinner = tag.toLowerCase() === 'dinner';

  // Get all unique tags from stories, excluding the current tag
  const uniqueTags = isDinner
    ? [...new Set(stories.flatMap((story) => story.tags))]
        .filter((t) => t.toLowerCase() !== 'dinner')
        .sort()
    : [];

  if (isDinner) {
    return (
      <div className={styles.linkBlok}>
        {uniqueTags.map((tagName) => (
          <Link
            key={tagName}
            href={`/tags/${tagName.toLowerCase().replace(/\s+/g, '-')}`}
            className={styles.linkBlok_Item}
          >
            <span className={styles.title}>{tagName}</span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.linkBlok}>
      {stories.map((story, index) => (
        <Link
          key={index}
          href={'/' + story.link}
          className={styles.linkBlok_Item}
        >
          <span className={styles.title}>{story.title}</span>
        </Link>
      ))}
    </div>
  );
}
