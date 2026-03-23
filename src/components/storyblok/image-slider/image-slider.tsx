import { SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import { ImageSlider, type SliderImage } from '@/components/image-slider/image-slider';
import styles from './image-slider.module.sass';

type AspectRatioOption = '1:1' | '4:3' | '3:2' | '16:9' | '9:16' | 'free';

interface StoryblokImage extends SliderImage {
  id?: string | null;
}

interface SbImageSliderData extends SbBlokData {
  images?: StoryblokImage[];
  aspect_ratio?: AspectRatioOption;
}

interface StoryblokImageSliderProps {
  blok: SbImageSliderData;
}

export default function StoryblokImageSlider({ blok }: StoryblokImageSliderProps) {
  const images =
    blok.images?.filter((image): image is StoryblokImage => Boolean(image?.filename)) ?? [];
  const aspectRatio = blok.aspect_ratio || '16:9';
  const heightMode = aspectRatio === 'free' ? 'auto' : 'fill';

  if (!images.length) return null;

  return (
    <div className={styles.imageSlider} {...storyblokEditable(blok)}>
      <div
        className={styles.sliderFrame}
        data-aspect-ratio={aspectRatio}
      >
        <ImageSlider images={images} fit="cover" heightMode={heightMode} />
      </div>
    </div>
  );
}
