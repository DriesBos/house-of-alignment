import { ISbStoryData } from '@storyblok/react/rsc';

export const fetchAllStories = async (
  version: 'draft' | 'published' = 'published'
): Promise<ISbStoryData[]> => {
  try {
    const token =
      version === 'published'
        ? process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
        : process.env.NEXT_PREVIEW_STORYBLOK_TOKEN;

    const response = await fetch(
      `https://api.storyblok.com/v2/cdn/stories?version=${version}&token=${token}&per_page=100`,
      {
        next: { tags: ['stories'], revalidate: 3600 },
        cache: version === 'published' ? 'force-cache' : 'no-store',
      }
    );

    if (!response.ok) {
      console.warn('Failed to fetch stories from Storyblok');
      return [];
    }

    const data = await response.json();
    return data.stories || [];
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
};

export const fetchStoriesByTag = async (
  version: 'draft' | 'published' = 'published',
  tag: string
): Promise<ISbStoryData[]> => {
  try {
    const token =
      version === 'published'
        ? process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
        : process.env.NEXT_PREVIEW_STORYBLOK_TOKEN;

    // Convert URL-friendly slug to properly formatted tag
    const tagName = tag
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    const response = await fetch(
      `https://api.storyblok.com/v2/cdn/stories?version=${version}&with_tag=${tagName}&token=${token}&per_page=100`,
      {
        next: { tags: ['stories'], revalidate: 3600 },
        cache: version === 'published' ? 'force-cache' : 'no-store',
      }
    );

    if (!response.ok) {
      console.warn(`Failed to fetch stories for tag "${tag}" from Storyblok`);
      return [];
    }

    const data = await response.json();
    return data.stories || [];
  } catch (error) {
    console.error(`Error fetching stories for tag "${tag}":`, error);
    return [];
  }
};
