import styles from './video.module.sass';

type VideoSizing = 'default' | 'free' | 'fullscreen_cover' | 'fullscreen_contain';

interface VideoProps {
  src?: string;
  title?: string;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  sizing?: VideoSizing;
  className?: string;
}

const MIME_TYPES: Record<string, string> = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  ogg: 'video/ogg',
  ogv: 'video/ogg',
  mov: 'video/quicktime',
  m4v: 'video/mp4',
};

const parseVideoTime = (value: string) => {
  if (/^\d+$/.test(value)) {
    return value;
  }

  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/i);

  if (!match) return null;

  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  return totalSeconds > 0 ? String(totalSeconds) : null;
};

const getVimeoId = (value: string) => {
  try {
    const url = new URL(value);
    const isVimeoHost =
      url.hostname === 'vimeo.com' ||
      url.hostname === 'www.vimeo.com' ||
      url.hostname === 'player.vimeo.com';

    if (!isVimeoHost) return null;

    const segments = url.pathname.split('/').filter(Boolean);
    const id = segments.find((segment) => /^\d+$/.test(segment));
    return id ?? null;
  } catch {
    return null;
  }
};

const getYouTubeEmbedData = (value: string) => {
  try {
    const url = new URL(value);
    const hostname = url.hostname.replace(/^www\./, '');

    let videoId: string | null = null;

    if (hostname === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0] ?? null;
    } else if (
      hostname === 'youtube.com' ||
      hostname === 'm.youtube.com' ||
      hostname === 'music.youtube.com' ||
      hostname === 'youtube-nocookie.com'
    ) {
      if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v');
      } else {
        const segments = url.pathname.split('/').filter(Boolean);
        const prefix = segments[0];

        if (prefix === 'embed' || prefix === 'shorts' || prefix === 'live') {
          videoId = segments[1] ?? null;
        }
      }
    }

    if (!videoId) return null;

    const start =
      parseVideoTime(url.searchParams.get('start') || '') ||
      parseVideoTime(url.searchParams.get('t') || '') ||
      parseVideoTime(url.hash.replace(/^#t=/, ''));

    return { videoId, start };
  } catch {
    return null;
  }
};

const getMimeType = (value: string) => {
  try {
    const pathname = new URL(value, 'https://houseofalignment.local').pathname;
    const extension = pathname.split('.').pop()?.toLowerCase();
    return extension ? MIME_TYPES[extension] : undefined;
  } catch {
    return undefined;
  }
};

export function Video({
  src,
  title = 'Embedded video',
  poster,
  autoplay = true,
  controls = true,
  loop = false,
  muted = true,
  playsInline = true,
  sizing = 'default',
  className,
}: VideoProps) {
  if (!src) return null;

  const shouldAutoplay = autoplay;
  const shouldMute = shouldAutoplay || muted;
  const vimeoId = getVimeoId(src);
  const youTubeEmbedData = getYouTubeEmbedData(src);
  const wrapperClassName = className
    ? `${styles.videoWrapper} ${className}`
    : styles.videoWrapper;

  if (vimeoId) {
    const params = new URLSearchParams({
      autoplay: shouldAutoplay ? '1' : '0',
      controls: controls ? '1' : '0',
      loop: loop ? '1' : '0',
      muted: shouldMute ? '1' : '0',
      title: '0',
      byline: '0',
      portrait: '0',
    });

    return (
      <div className={wrapperClassName} data-sizing={sizing}>
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?${params.toString()}`}
          title={title}
          className={styles.iframe}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  if (youTubeEmbedData) {
    const params = new URLSearchParams({
      autoplay: shouldAutoplay ? '1' : '0',
      controls: controls ? '1' : '0',
      loop: loop ? '1' : '0',
      mute: shouldMute ? '1' : '0',
      playsinline: playsInline ? '1' : '0',
      rel: '0',
      modestbranding: '1',
    });

    if (loop) {
      params.set('playlist', youTubeEmbedData.videoId);
    }

    if (youTubeEmbedData.start) {
      params.set('start', youTubeEmbedData.start);
    }

    return (
      <div className={wrapperClassName} data-sizing={sizing}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youTubeEmbedData.videoId}?${params.toString()}`}
          title={title}
          className={styles.iframe}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  const mimeType = getMimeType(src);

  return (
    <div className={wrapperClassName} data-sizing={sizing}>
      <video
        className={styles.video}
        controls={controls}
        autoPlay={shouldAutoplay}
        loop={loop}
        muted={shouldMute}
        playsInline={playsInline}
        poster={poster}
        preload="metadata"
      >
        <source src={src} type={mimeType} />
        <a href={src}>View video</a>
      </video>
    </div>
  );
}
