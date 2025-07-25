import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';

import Page from '@/components/storyblok/page';
import Pagehome from '@/components/storyblok/pagehome';
import IndexBlock from '@/components/storyblok/indexblock';
import ContentBlock from '@/components/storyblok/contentblock';
import TextBlock from '@/components/storyblok/contentblock';
import GlobalData from '@/components/storyblok/globaldata/globaldata';

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
  components: {
    page: Page,
    pagehome: Pagehome,
    indexblock: IndexBlock,
    contentblock: ContentBlock,
    textblock: TextBlock,
    globaldata: GlobalData,
  },
  use: [apiPlugin],
  apiOptions: {
    region: 'eu',
  },
});
