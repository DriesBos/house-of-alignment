import styles from './video.module.sass';

interface VideoProps {
  src?: string;
  title?: string;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
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
  className,
}: VideoProps) {
  if (!src) return null;

  const vimeoId = getVimeoId(src);
  const wrapperClassName = className
    ? `${styles.videoWrapper} ${className}`
    : styles.videoWrapper;

  if (vimeoId) {
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      controls: controls ? '1' : '0',
      loop: loop ? '1' : '0',
      muted: muted ? '1' : '0',
      title: '0',
      byline: '0',
      portrait: '0',
    });

    return (
      <div className={wrapperClassName}>
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

  const mimeType = getMimeType(src);

  return (
    <div className={wrapperClassName}>
      <video
        className={styles.video}
        controls={controls}
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
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
