import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawSlug = searchParams.get('slug') || '/';
  const slug = rawSlug.startsWith('/') ? rawSlug : `/${rawSlug}`;

  (await draftMode()).disable();

  redirect(slug);
}
