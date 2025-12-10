import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';

import Page from '@/components/storyblok/page/page';
import PageTwoColumn from '@/components/storyblok/page-two-column/page-two-column';
import PageThreeColumn from '@/components/storyblok/page-three-column/page-three-column';
import IndexTwoColumn from '@/components/storyblok/index-two-column/index-two-column';
import IndexThreeColumn from '@/components/storyblok/index-three-column/index-three-column';
import ContentContainer from '@/components/storyblok/content-container/content-container';
import ContentBlok from '@/components/storyblok/content-blok/content-blok';
import TextBlok from '@/components/storyblok/text-blok/text-blok';
import ImageBlok from '@/components/storyblok/image-blok/image-blok';
import GlobalData from '@/components/storyblok/globaldata/globaldata';
import DividerBlok from '@/components/storyblok/divider-blok/divider-blok';
import ContentData from '@/components/storyblok/content-data/content-data';
import ContentProfile from '@/components/storyblok/content-data/content-profile/content-profile';
import ContentInfo from '@/components/storyblok/content-data/content-info/content-info';
import ContentInfoItem from '@/components/storyblok/content-data/content-info/content-info-item/content-info-item';
import ContentRsvp from '@/components/storyblok/content-data/content-rsvp/content-rsvp';

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
  components: {
    'global-data': GlobalData,
    page: Page,
    'index-two-column': IndexTwoColumn,
    'index-three-column': IndexThreeColumn,
    'page-two-column': PageTwoColumn,
    'page-three-column': PageThreeColumn,
    'content-container': ContentContainer,
    'content-blok': ContentBlok,
    'content-data': ContentData,
    'content-profile': ContentProfile,
    'content-info': ContentInfo,
    'content-info-item': ContentInfoItem,
    'content-rsvp': ContentRsvp,
    'text-blok': TextBlok,
    'image-blok': ImageBlok,
    'divider-blok': DividerBlok,
  },
  use: [apiPlugin],
  apiOptions: {
    region: 'eu',
  },
});
