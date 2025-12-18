'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './cursor.module.sass';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHidden, setIsHidden] = useState(true);
  const [isClicking, setIsClicking] = useState(false);
  const [isHoveringInteract, setIsHoveringInteract] = useState(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Function to check if cursor is over a cursorInteract element
    const checkHoverState = (x: number, y: number) => {
      // Get all elements at the cursor position
      const elements = document.elementsFromPoint(x, y);

      // Check if any element has the cursorInteract class
      const hasInteractElement = elements.some((el) =>
        el.classList.contains('cursorInteract')
      );

      setIsHoveringInteract(hasInteractElement);
    };

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      setIsHidden(false);

      // Store position for MutationObserver
      lastPositionRef.current = { x: e.clientX, y: e.clientY };

      // Check hover state using elementsFromPoint
      checkHoverState(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
    };

    const handleMouseEnter = () => {
      setIsHidden(false);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    // Set up MutationObserver to watch for DOM changes
    const observer = new MutationObserver(() => {
      // Re-check hover state when DOM changes occur
      const { x, y } = lastPositionRef.current;
      if (x !== 0 || y !== 0) {
        checkHoverState(x, y);
      }
    });

    // Observe the entire document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    });

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      observer.disconnect();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={styles.cursor}
      data-hidden={isHidden.toString()}
      data-clicking={isClicking.toString()}
      data-hovering-interact={isHoveringInteract.toString()}
    />
  );
}
