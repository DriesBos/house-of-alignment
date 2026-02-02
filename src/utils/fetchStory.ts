import { ISbResponse } from '@storyblok/react/rsc';

export const fetchStory = async (
  version: 'draft' | 'published',
  slug?: string[]
) => {
  const correctSlug = `/${slug ? slug.join('/') : 'home'}`;

  return fetch(
    `
    https://api.storyblok.com/v2/cdn/stories${correctSlug}?version=${version}&token=${
      version === 'published'
        ? process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
        : process.env.NEXT_PREVIEW_STORYBLOK_TOKEN
    }`,
    {
      next: { tags: ['cms'] },
      cache: version === 'published' ? 'default' : 'no-store',
    }
  ).then((res) => res.json()) as Promise<{ story: ISbResponse }>;
};
