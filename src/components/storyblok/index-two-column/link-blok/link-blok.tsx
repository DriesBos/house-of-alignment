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
  // If tag is "Dinners", show a list of all unique tags (excluding "Dinners")
  const isDinners = tag.toLowerCase() === 'dinners';

  // Get all unique tags from stories, excluding the current tag
  const uniqueTags = isDinners
    ? [...new Set(stories.flatMap((story) => story.tags))]
        .filter((t) => t.toLowerCase() !== 'dinners')
        .sort()
    : [];

  if (isDinners) {
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
