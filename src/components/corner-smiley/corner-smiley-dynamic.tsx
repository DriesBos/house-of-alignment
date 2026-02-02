'use client';

import dynamic from 'next/dynamic';

const CornerSmiley = dynamic(
  () => import('./corner-smiley'),
  { ssr: false }
);

export default CornerSmiley;
