'use client';

import styles from './content-column.module.sass';
import { useRef, Children, isValidElement, useCallback } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useLayoutStore } from '@/providers/layout-store-provider';

export default function ContentColumn({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const layout = useLayoutStore((state) => state.layout);
  const containerRef = useRef<HTMLDivElement>(null);

  const animateChildren = useCallback(() => {
    const elements = containerRef.current?.children;
    if (!elements) return;
    const elementArray = Array.from(elements);
    if (elementArray.length === 0) return;

    // Reset elements to initial state
    gsap.set(elementArray, {
      opacity: 0,
    });

    // Animate each child sequentially
    gsap.to(elementArray, {
      opacity: 1,
      ease: 'power1.inOut',
      duration: 0.33,
      delay: 0.33,
      stagger: {
        amount: 0.66,
        from: 'start',
      },
    });
  }, []);

  useGSAP(
    () => {
      animateChildren();
    },
    { scope: containerRef, dependencies: [layout] }
  );

  // Wrap each child in a div to ensure consistent animation targets
  const wrappedChildren = Children.map(children, (child, index) => {
    if (isValidElement(child)) {
      return (
        <div key={index} className={styles.contentColumn_Item}>
          {child}
        </div>
      );
    }
    return child;
  });

  return (
    <div
      ref={containerRef}
      className={`${styles.contentColumn} ${className && className}`}
    >
      {wrappedChildren}
    </div>
  );
}
