'use client';

import { useLayoutStore } from '@/providers/layout-store-provider';

export default function Layout() {
  const layout = useLayoutStore((state) => state.layout);

  return (
    <div className="layout" data-layout={layout}>
      <div />
      <div />
      <div />
    </div>
  );
}
