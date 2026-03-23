import { SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import { ImageSlider, type SliderImage } from '@/components/image-slider/image-slider';
import styles from './image-slider.module.sass';

type ImageFillOption = 'contain' | 'cover';
type SizingOption = '1:1' | '4:3' | '3:2' | '16:9' | '9:16' | 'fullscreen' | 'free';

interface StoryblokImage extends SliderImage {
  id?: string | null;
}

interface SbImageSliderData extends SbBlokData {
  images?: StoryblokImage[];
  image_fill?: ImageFillOption;
  sizing?: SizingOption;
}

interface StoryblokImageSliderProps {
  blok: SbImageSliderData;
}

export default function StoryblokImageSlider({ blok }: StoryblokImageSliderProps) {
  const images =
    blok.images?.filter((image): image is StoryblokImage => Boolean(image?.filename)) ?? [];
  const sizing = blok.sizing || '16:9';
  const imageFill = blok.image_fill || 'cover';
  const heightMode = sizing === 'free' ? 'auto' : 'fill';

  if (!images.length) return null;

  return (
    <div className={styles.imageSlider} {...storyblokEditable(blok)}>
      <div
        className={styles.sliderFrame}
        data-sizing={sizing}
      >
        <ImageSlider
          images={images}
          fit={imageFill}
          heightMode={heightMode}
          sizing={sizing}
        />
      </div>
    </div>
  );
}
