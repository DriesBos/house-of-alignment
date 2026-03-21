import { SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import dynamic from 'next/dynamic';
import styles from './content-blok.module.sass';
import Image from 'next/image';
import { ImageSlider, type SliderImage } from '@/components/image-slider/image-slider';
import { Video } from '@/components/video/video';

const Markdown = dynamic(() => import('@/components/markdown/markdown'));

interface StoryblokImage extends SliderImage {
  id: string | null;
}

interface StoryblokLink {
  cached_url?: string;
  url?: string;
}

interface SbContentBlokData extends SbBlokData {
  background_image?: StoryblokImage;
  images?: StoryblokImage[];
  video?: string | StoryblokLink;
  video_url?: string;
  vimeo_link?: string;
  text_contrast?: boolean;
  image_size?: 'fullscreen' | 'large' | 'medium' | 'small';
  img_align?:
    | 'topleft'
    | 'left'
    | 'bottomleft'
    | 'topcenter'
    | 'center'
    | 'bottomcenter'
    | 'topright'
    | 'right'
    | 'bottomright';
  text: string;
  text_background?: boolean;
  text_top: string;
  text_bottom: string;
  text_align:
    | 'topleft'
    | 'left'
    | 'bottomleft'
    | 'topcenter'
    | 'center'
    | 'bottomcenter'
    | 'topright'
    | 'right'
    | 'bottomright';
  background?:
    | 'default'
    | 'accent'
    | 'white'
    | 'stone'
    | 'blue'
    | 'burgundy'
    | 'black';
  width?: 'full' | 'concise';
}

interface ContentBlokProps {
  blok: SbContentBlokData;
}

const getVideoSrc = (blok: SbContentBlokData) => {
  if (typeof blok.video === 'string' && blok.video) return blok.video;
  if (blok.video && typeof blok.video === 'object') {
    return blok.video.url || blok.video.cached_url || '';
  }

  return blok.video_url || blok.vimeo_link || '';
};

export default function ContentBlok({ blok }: ContentBlokProps) {
  const sliderImages =
    blok.images?.filter((image): image is StoryblokImage => Boolean(image?.filename)) ?? [];
  const hasSliderImages = sliderImages.length > 0;
  const videoSrc = getVideoSrc(blok);
  const hasVideo = Boolean(videoSrc);
  const hasBackgroundImage =
    Boolean(blok.background_image?.filename) && blok.background_image?.id !== null;
  const imageFit = blok.image_size === 'fullscreen' ? 'cover' : 'contain';

  return (
    <div
      className={styles.contentBlok}
      {...storyblokEditable(blok)}
      data-background={blok.background || 'default'}
    >
      {(hasSliderImages || hasVideo || hasBackgroundImage) && (
        <div
          className={styles.image}
          data-size={blok.image_size || 'medium'}
          data-align={blok.img_align || 'center'}
        >
          <div className={styles.imageContainer}>
            {hasSliderImages ? (
              <ImageSlider images={sliderImages} fit={imageFit} />
            ) : hasVideo ? (
              <Video
                src={videoSrc}
                className={styles.mediaVideo}
                title={blok.text_top || blok.text_bottom || 'Content video'}
              />
            ) : (
              blok.background_image && (
                <Image
                  src={`${blok.background_image.filename}/m/filters:quality(60)`}
                  alt={blok.background_image.alt ?? ''}
                  fill
                  sizes="100vw"
                  unoptimized
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  className={`${styles.backgroundImage} imageLoad`}
                  onLoad={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                />
              )
            )}
          </div>
        </div>
      )}
      <div
        className={styles.text}
        data-align={blok.text_align || 'center'}
        data-caption-top={blok.text_top ? true : false}
        data-caption-bottom={blok.text_bottom ? true : false}
      >
        {blok.text_top && (
          <div className={`${styles.textCaption} ${styles.textCaption_Top}`}>
            {blok.text_top}
          </div>
        )}
        <div
          className={styles.textMain}
          data-background={blok.text_background}
          data-contrast={blok.text_contrast || false}
        >
          {blok.text && (
            <Markdown content={blok.text} width={blok.width || 'full'} />
          )}
        </div>
        {blok.text_bottom && (
          <div className={`${styles.textCaption} ${styles.textCaption_Bottom}`}>
            {blok.text_bottom}
          </div>
        )}
      </div>
    </div>
  );
}
