import { StoryblokStory } from '@storyblok/react/rsc';
import { getStoryblokApi } from '@/lib/storyblok';
import { fetchStory } from '@/utils/fetchStory';
import { fetchAllStories } from '@/utils/fetchStories';
import { StoriesProvider } from '@/providers/stories-provider';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const stories = await fetchAllStories('published');
  return stories
    .filter((story) => story.full_slug && story.full_slug !== 'home')
    .map((story) => ({
      slug: story.full_slug.split('/'),
    }));
}

type Params = Promise<{ slug?: string[] }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const slug = (await params).slug;
  
  // If no slug (homepage), return default title
  if (!slug || slug.length === 0) {
    return {
      title: 'House of Alignment',
      description: 'Make energy your priority',
    };
  }
  
  // Get the last part of the slug
  const lastPart = slug[slug.length - 1];
  
  // Convert dashes to spaces and capitalize each word
  const formattedTitle = lastPart
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return {
    title: `House of Alignment — ${formattedTitle}`,
    description: 'Make energy your priority',
  };
}

export default async function Home({ params }: { params: Params }) {
  getStoryblokApi();
  const slug = (await params).slug;
  const [pageData, allStories] = await Promise.all([
    fetchStory('published', slug),
    fetchAllStories('published'),
  ]);

  return (
    <StoriesProvider stories={allStories}>
      <StoryblokStory story={pageData.story} />
    </StoriesProvider>
  );
}
