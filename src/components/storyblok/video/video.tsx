import { SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import { Video } from '@/components/video/video';
import styles from './video.module.sass';

type VideoSizing = 'free' | 'fullscreen_cover' | 'fullscreen_contain';

interface StoryblokAsset {
  filename?: string;
  url?: string;
  cached_url?: string;
}

interface StoryblokLink {
  url?: string;
  cached_url?: string;
}

interface SbVideoData extends SbBlokData {
  title?: string;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  plays_inline?: boolean;
  sizing?: VideoSizing;
  video_address?: string;
  src?: string;
  video?: string | StoryblokLink;
  video_url?: string;
  youtube_link?: string;
  vimeo_link?: string;
  poster?: string | StoryblokAsset;
}

interface StoryblokVideoProps {
  blok: SbVideoData;
}

const getUrl = (value?: string | StoryblokLink | StoryblokAsset) => {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';

  if ('filename' in value && value.filename) return value.filename;

  return value.url || value.cached_url || '';
};

const getVideoSrc = (blok: SbVideoData) =>
  blok.video_address ||
  getUrl(blok.video) ||
  blok.src ||
  blok.video_url ||
  blok.youtube_link ||
  blok.vimeo_link ||
  '';

export default function StoryblokVideo({ blok }: StoryblokVideoProps) {
  const videoSrc = getVideoSrc(blok);

  if (!videoSrc) return null;

  return (
    <div
      className={styles.videoBlok}
      {...storyblokEditable(blok)}
      data-sizing={blok.sizing || 'default'}
      data-autoplay={Boolean(blok.autoplay)}
    >
      <div className={styles.videoFrame} data-sizing={blok.sizing || 'default'}>
        <Video
          src={videoSrc}
          title={blok.title || 'Embedded video'}
          autoplay={Boolean(blok.autoplay)}
          controls={blok.controls ?? true}
          loop={Boolean(blok.loop)}
          muted={blok.autoplay ? true : Boolean(blok.muted)}
          playsInline={blok.plays_inline ?? true}
          sizing={blok.sizing}
          poster={getUrl(blok.poster) || undefined}
          className={styles.videoRoot}
        />
      </div>
    </div>
  );
}
