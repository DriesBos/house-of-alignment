import IndexTwoColumnTag from '@/components/index-two-column-tag/index-two-column-tag';

type Params = Promise<{ tag: string }>;

export default async function TagPage({ params }: { params: Params }) {
  const { tag } = await params;
  console.log('TagPage tag:', tag);

  return <IndexTwoColumnTag tag={tag} />;
}
