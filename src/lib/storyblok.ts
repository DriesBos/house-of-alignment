import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';

import Page from '@/components/storyblok/page';
import Pagehome from '@/components/storyblok/pagehome';
import IndexBlock from '@/components/storyblok/indexblock';

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
  components: {
    page: Page,
    pagehome: Pagehome,
    indexblock: IndexBlock,
  },
  use: [apiPlugin],
  apiOptions: {
    region: 'eu',
  },
});
