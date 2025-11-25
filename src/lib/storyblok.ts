import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';

import Page from '@/components/storyblok/page/page';
import PageTwoColumn from '@/components/storyblok/page-two-column/page-two-column';
import PageThreeColumn from '@/components/storyblok/page-three-column/page-three-column';
import IndexBlok from '@/components/storyblok/index-blok/index-blok';
import IndexTwoColumn from '@/components/storyblok/index-two-column/index-two-column';
import IndexThreeColumn from '@/components/storyblok/index-three-column/index-three-column';
import ContentContainer from '@/components/storyblok/content-container/content-container';
import ContentBlok from '@/components/storyblok/content-blok/content-blok';
import TextBlok from '@/components/storyblok/text-blok/text-blok';
import ImageBlok from '@/components/storyblok/image-blok/image-blok';
import GlobalData from '@/components/storyblok/globaldata/globaldata';
import DividerBlok from '@/components/storyblok/divider-blok/divider-blok';

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
  components: {
    'global-data': GlobalData,
    page: Page,
    'index-two-column': IndexTwoColumn,
    'index-three-column': IndexThreeColumn,
    'page-two-column': PageTwoColumn,
    'page-three-column': PageThreeColumn,
    'index-blok': IndexBlok,
    'content-container': ContentContainer,
    'content-blok': ContentBlok,
    'text-blok': TextBlok,
    'image-blok': ImageBlok,
    'divider-blok': DividerBlok,
  },
  use: [apiPlugin],
  apiOptions: {
    region: 'eu',
  },
});
