import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const rawSlug = searchParams.get('slug') || '/';
  const slug = rawSlug.startsWith('/') ? rawSlug : `/${rawSlug}`;

  if (secret !== process.env.STORYBLOK_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  (await draftMode()).enable();

  redirect(slug);
}
