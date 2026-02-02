import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';

import Page from '@/components/storyblok/page/page';
import PageTwoColumn from '@/components/storyblok/page-two-column/page-two-column';
import IndexTwoColumn from '@/components/storyblok/index-two-column/index-two-column';
import IndexThreeColumn from '@/components/storyblok/index-three-column/index-three-column';
import ContentContainer from '@/components/storyblok/content-container/content-container';
import ContentBlok from '@/components/storyblok/content-blok/content-blok';
import GlobalData from '@/components/storyblok/globaldata/globaldata';
import DividerBlok from '@/components/storyblok/divider-blok/divider-blok';
import ContentData from '@/components/storyblok/content-data/content-data';
import ContentProfile from '@/components/storyblok/content-data/content-profile/content-profile';
import ContentInfo from '@/components/storyblok/content-data/content-info/content-info';
import ContentInfoItem from '@/components/storyblok/content-data/content-info/content-info-item/content-info-item';
import ContentRsvp from '@/components/storyblok/content-data/content-rsvp/content-rsvp';
import IndexTiles from '@/components/storyblok/index-tiles/index-tiles';

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
  components: {
    'global-data': GlobalData,
    page: Page,
    'index-two-column': IndexTwoColumn,
    'index-three-column': IndexThreeColumn,
    'index-tiles': IndexTiles,
    'page-two-column': PageTwoColumn,
    'content-container': ContentContainer,
    'content-blok': ContentBlok,
    'content-data': ContentData,
    'content-profile': ContentProfile,
    'content-info': ContentInfo,
    'content-info-item': ContentInfoItem,
    'content-rsvp': ContentRsvp,
    'divider-blok': DividerBlok,
  },
  use: [apiPlugin],
  apiOptions: {
    region: 'eu',
  },
});
