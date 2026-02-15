import { ISbStoryData } from '@storyblok/react/rsc';

const normalizeTagKey = (value: string): string =>
  value.replace(/[\s_-]+/g, '').toLowerCase();

const TAG_ROUTE_ALIASES: Record<string, string[]> = {
  founderstories: ['Interview', 'Interviews'],
  gatherings: ['Dinner', 'Dinners'],
};

const TAG_ROUTE_SLUG_PREFIX_ALIASES: Record<string, string[]> = {
  founderstories: ['founderstories/', 'interviews/'],
  gatherings: ['gatherings/', 'dinners/'],
};

const filterStoriesByTagKeys = (
  stories: ISbStoryData[],
  allowedTagKeys: Set<string>,
): ISbStoryData[] =>
  stories.filter((story) =>
    story.tag_list?.some((storyTag) =>
      allowedTagKeys.has(normalizeTagKey(storyTag)),
    ),
  );

const filterStoriesBySlugPrefix = (
  stories: ISbStoryData[],
  prefixes: string[],
): ISbStoryData[] => {
  const normalizedPrefixes = prefixes
    .map((prefix) => prefix.toLowerCase())
    .filter(Boolean);

  if (normalizedPrefixes.length === 0) return [];

  return stories.filter((story) => {
    const slug = story.full_slug?.toLowerCase();
    if (!slug) return false;
    return normalizedPrefixes.some((prefix) => slug.startsWith(prefix));
  });
};

const buildTagCandidates = (tag: string, resolvedTagName: string): string[] => {
  const normalizedTag = normalizeTagKey(tag);
  const candidates = new Set<string>([
    resolvedTagName,
    tag,
    tag
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
    tag
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' '),
    tag
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, '')
      .trim(),
  ]);

  TAG_ROUTE_ALIASES[normalizedTag]?.forEach((alias) => candidates.add(alias));

  return [...candidates].filter(Boolean);
};

const resolveStoryblokTagName = async (
  token: string | undefined,
  version: 'draft' | 'published',
  tag: string,
): Promise<string> => {
  if (!token) return tag;

  try {
    const response = await fetch(
      `https://api.storyblok.com/v2/cdn/tags?token=${token}`,
      {
        next: { tags: ['tags'], revalidate: 3600 },
        cache: version === 'published' ? 'force-cache' : 'no-store',
      },
    );

    if (!response.ok) return tag;

    const data = await response.json();
    const requestedTagKey = normalizeTagKey(tag);
    const matchingTag = data.tags?.find(
      (storyblokTag: { name?: string }) =>
        typeof storyblokTag.name === 'string' &&
        normalizeTagKey(storyblokTag.name) === requestedTagKey,
    );

    return matchingTag?.name || tag;
  } catch (error) {
    console.warn(`Failed to resolve canonical Storyblok tag for "${tag}"`, error);
    return tag;
  }
};

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

    const tagName = await resolveStoryblokTagName(token, version, tag);
    const candidateTags = buildTagCandidates(tag, tagName);

    for (const candidateTag of candidateTags) {
      const response = await fetch(
        `https://api.storyblok.com/v2/cdn/stories?version=${version}&with_tag=${encodeURIComponent(candidateTag)}&token=${token}&per_page=100`,
        {
          next: { tags: ['stories'], revalidate: 3600 },
          cache: version === 'published' ? 'force-cache' : 'no-store',
        }
      );

      if (!response.ok) continue;

      const data = await response.json();
      const stories = data.stories || [];
      if (stories.length > 0) {
        return stories;
      }
    }

    // Final fallback: fetch all stories and filter locally by normalized tag.
    // This covers route/tag rename transitions where Storyblok's with_tag doesn't match yet.
    const allStories = await fetchAllStories(version);
    const allowedTagKeys = new Set<string>([
      normalizeTagKey(tag),
      normalizeTagKey(tagName),
      ...((TAG_ROUTE_ALIASES[normalizeTagKey(tag)] || []).map((alias) =>
        normalizeTagKey(alias),
      )),
    ]);

    const filteredStories = filterStoriesByTagKeys(allStories, allowedTagKeys);
    if (filteredStories.length > 0) return filteredStories;

    const slugPrefixFallbackStories = filterStoriesBySlugPrefix(
      allStories,
      TAG_ROUTE_SLUG_PREFIX_ALIASES[normalizeTagKey(tag)] || [],
    );
    if (slugPrefixFallbackStories.length > 0) return slugPrefixFallbackStories;

    console.warn(`Failed to fetch stories for tag "${tag}" from Storyblok`);
    return [];
  } catch (error) {
    console.error(`Error fetching stories for tag "${tag}":`, error);
    return [];
  }
};
