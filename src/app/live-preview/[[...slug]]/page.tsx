import { StoryblokStory } from '@storyblok/react/rsc';
import { getStoryblokApi } from '@/lib/storyblok';
import { fetchStory } from '@/utils/fetchStory';

type Params = Promise<{ slug?: string[] }>;

export default async function Home({ params }: { params: Params }) {
  getStoryblokApi();
  const slug = (await params).slug;
  const pageData = await fetchStory('draft', slug);

  return <StoryblokStory story={pageData.story} />;
}
