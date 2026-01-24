'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './cursor.module.sass';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHidden, setIsHidden] = useState(true);
  const [isClicking, setIsClicking] = useState(false);
  const [isHoveringInteract, setIsHoveringInteract] = useState(false);
  const [isHoveringAccent, setIsHoveringAccent] = useState(false);
  const [hasPointer, setHasPointer] = useState(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });

  // Detect if device has a fine pointer (mouse/trackpad/stylus) using matchMedia API
  useEffect(() => {
    // Check for fine pointer capability - this is a JavaScript browser API
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    // Exit early if no pointer device - saves resources on mobile
    if (!hasFinePointer) {
      setHasPointer(false);
      return;
    }

    setHasPointer(true);

    // Optional: Listen for pointer device changes (e.g., plugging in a mouse)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const handleChange = (e: MediaQueryListEvent) => {
      setHasPointer(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Set up cursor listeners only when pointer device exists
  useEffect(() => {
    if (!hasPointer) return;

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

    // Function to check if we're interacting with 3D content
    const isOver3DContent = (x: number, y: number) => {
      const elements = document.elementsFromPoint(x, y);
      return elements.some(
        (el) => el.tagName === 'CANVAS' || el.closest('.cornerSmiley')
      );
    };

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      setIsHidden(false);

      // Store position for MutationObserver
      lastPositionRef.current = { x: e.clientX, y: e.clientY };

      // Check hover state using elementsFromPoint
      checkHoverState(e.clientX, e.clientY);

      // Check if hovering over accent background container
      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      const hasAccentBg = elements.some(
        (el) => el.getAttribute('data-background') === 'accent'
      );
      setIsHoveringAccent(hasAccentBg);
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
      setIsHoveringAccent(false);
    };

    const handleMouseEnter = () => {
      setIsHidden(false);
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Don't interfere with 3D content interactions
      if (isOver3DContent(e.clientX, e.clientY)) {
        return;
      }
      setIsClicking(true);
    };

    const handleMouseUp = (e: MouseEvent) => {
      // Don't interfere with 3D content interactions
      if (isOver3DContent(e.clientX, e.clientY)) {
        return;
      }
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
  }, [hasPointer]);

  // Don't render anything if no pointer device detected - saves all resources
  if (!hasPointer) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className={styles.cursor}
      data-hidden={isHidden.toString()}
      data-clicking={isClicking.toString()}
      data-hovering-interact={isHoveringInteract.toString()}
      data-hovering-accent={isHoveringAccent.toString()}
    />
  );
}
