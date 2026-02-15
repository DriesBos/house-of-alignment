import { draftMode } from 'next/headers';
import IndexTwoColumn from '@/components/storyblok/index-two-column/index-two-column';
import { fetchStoriesByTag } from '@/utils/fetchStories';
import type { Metadata } from 'next';

type Params = Promise<{ tag: string }>;

export function generateStaticParams() {
  return [{ tag: 'gatherings' }, { tag: 'founderstories' }];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { tag } = await params;

  // Convert dashes to spaces and capitalize each word
  const formattedTag = tag
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `House of Alignment — ${formattedTag}`,
    description: 'Make energy your priority',
  };
}

export default async function TagPage({ params }: { params: Params }) {
  const { tag } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const version = isDraft ? 'draft' : 'published';
  const stories = await fetchStoriesByTag(version, tag);

  return <IndexTwoColumn tag={tag} stories={stories} />;
}
