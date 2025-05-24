import { storyblokInit } from '@storyblok/react/rsc';

import Page from '@/components/storyblok/page/page';
import Teaser from '@/components/storyblok/teaser/teaser';

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
  components: {
    page: Page,
    teaser: Teaser,
  },
});
