import { ISbResponse } from '@storyblok/react/rsc';

export const fetchStory = async (
  version: 'draft' | 'published',
  slug?: string[]
) => {
  const correctSlug = `/${slug ? slug.join('/') : 'home'}`;

  const token =
    version === 'published'
      ? process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
      : process.env.NEXT_PREVIEW_STORYBLOK_TOKEN;

  const res = await fetch(
    `https://api.storyblok.com/v2/cdn/stories${correctSlug}?version=${version}&token=${token}`,
    {
      next: { tags: ['cms'] },
      cache: version === 'published' ? 'default' : 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch story "${correctSlug}" (${res.status})`);
  }

  return res.json() as Promise<{ story: ISbResponse }>;
};
