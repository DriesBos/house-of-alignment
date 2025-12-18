import { StoryblokStory } from '@storyblok/react/rsc';
import { fetchStory } from '@/utils/fetchStory';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return [];
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
  const slug = (await params).slug;
  const pageData = await fetchStory('published', slug);

  return <StoryblokStory story={pageData.story} />;
}
