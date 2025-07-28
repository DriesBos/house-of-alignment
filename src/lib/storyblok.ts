import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';

import Page from '@/components/storyblok/page/page';
import PageTwoColumn from '@/components/storyblok/page-two-column/page-two-column';
import PageThreeColumn from '@/components/storyblok/page-three-column/page-three-column';
import IndexBlock from '@/components/storyblok/indexblock';
import ContentBlock from '@/components/storyblok/contentblock';
import TextBlock from '@/components/storyblok/contentblock';
import GlobalData from '@/components/storyblok/globaldata/globaldata';

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
  components: {
    page: Page,
    'page-two-column': PageTwoColumn,
    'page-three-column': PageThreeColumn,
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
