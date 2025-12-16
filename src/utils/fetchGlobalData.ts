import { getStoryblokApi } from '@/lib/storyblok';

export interface SloganItem {
  _uid: string;
  slogan: string;
  component: string;
}

export interface GlobalData {
  name?: string;
  slogans?: SloganItem[];
  email?: string;
  instagram?: string;
}

/**
 * Fetch global data from Storyblok
 * This data is cached and reused across the application
 */
export const fetchGlobalData = async (
  version: 'draft' | 'published' = 'published'
): Promise<GlobalData> => {
  try {
    getStoryblokApi();

    const token =
      version === 'published'
        ? process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
        : process.env.NEXT_PREVIEW_STORYBLOK_TOKEN;

    const response = await fetch(
      `https://api.storyblok.com/v2/cdn/stories/global/globaldata?version=${version}&token=${token}`,
      {
        next: {
          tags: ['global-data'],
          revalidate: version === 'published' ? 3600 : 0, // Cache for 1 hour in production
        },
        cache: version === 'published' ? 'force-cache' : 'no-store',
      }
    );

    if (!response.ok) {
      console.warn('Failed to fetch global data from Storyblok');
      return {};
    }

    const data = await response.json();
    const globalContent = data.story?.content;

    return {
      name: globalContent?.companyname || '',
      slogans: globalContent?.slogans || [],
      email: globalContent?.email || '',
      instagram: globalContent?.instagram || '',
    };
  } catch (error) {
    console.error('Error fetching global data:', error);
    return {};
  }
};
