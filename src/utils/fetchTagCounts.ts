interface StoryblokTag {
  name: string;
  taggings_count: number;
}

export const fetchTagCounts = async (
  version: 'draft' | 'published' = 'published'
): Promise<Record<string, number>> => {
  try {
    const token =
      version === 'published'
        ? process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
        : process.env.NEXT_PREVIEW_STORYBLOK_TOKEN;

    const response = await fetch(
      `https://api.storyblok.com/v2/cdn/tags?token=${token}`,
      {
        next: { tags: ['tags'], revalidate: 3600 },
        cache: version === 'published' ? 'force-cache' : 'no-store',
      }
    );

    if (!response.ok) {
      console.warn('Failed to fetch tag counts from Storyblok');
      return {};
    }

    const data = await response.json();
    const counts: Record<string, number> = {};
    data.tags?.forEach((tag: StoryblokTag) => {
      counts[tag.name] = tag.taggings_count;
    });

    return counts;
  } catch (error) {
    console.error('Error fetching tag counts:', error);
    return {};
  }
};
