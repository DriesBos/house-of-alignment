import IndexTwoColumn from '@/components/storyblok/index-two-column/index-two-column';

type Params = Promise<{ tag: string }>;

export default async function TagPage({ params }: { params: Params }) {
  const { tag } = await params;

  return <IndexTwoColumn tag={tag} />;
}
