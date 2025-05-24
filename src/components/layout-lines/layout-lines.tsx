'use client';

import { useLayoutStore } from '@/providers/layout-store-provider';

export default function LayoutLines() {
  const layout = useLayoutStore((state) => state.layout);

  return (
    <div className="layoutLines" data-layout={layout}>
      <div />
      <div />
      <div />
    </div>
  );
}
