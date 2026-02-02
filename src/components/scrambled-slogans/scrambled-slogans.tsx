'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { SloganItem } from '@/utils/fetchGlobalData';

interface ScrambledSlogansProps {
  slogans: SloganItem[];
  className?: string;
}

export function ScrambledSlogans({
  slogans,
  className = '',
}: ScrambledSlogansProps) {
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);
  const sloganRef = useRef<HTMLDivElement>(null);
  const scrambleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Configuration constants
  const CYCLE_DURATION = 10000; // Total duration for one cycle (scramble + display)
  const SCRAMBLE_DURATION = 6000; // Duration of scramble animation (slower for better visibility)
  const ITERATIONS = 6; // Number of scramble iterations per character (more iterations = slower reveal)

  // Function to perform scramble animation
  const performScramble = useCallback(
    (slogan: string, onComplete?: () => void) => {
      if (!sloganRef.current) return;

      // Clear any existing scramble animation
      if (scrambleIntervalRef.current) {
        clearInterval(scrambleIntervalRef.current);
        scrambleIntervalRef.current = null;
      }

      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const totalIterations = slogan.length * ITERATIONS;
      const interval = SCRAMBLE_DURATION / totalIterations;

      let iteration = 0;
      scrambleIntervalRef.current = setInterval(() => {
        if (sloganRef.current) {
          const scrambledText = slogan
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (index < (iteration / ITERATIONS) * slogan.length) {
                return slogan[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
          sloganRef.current.textContent = `( ${scrambledText} )`;
        }

        iteration++;

        if (iteration > totalIterations) {
          if (scrambleIntervalRef.current) {
            clearInterval(scrambleIntervalRef.current);
            scrambleIntervalRef.current = null;
          }
          if (sloganRef.current) {
            sloganRef.current.textContent = `( ${slogan} )`;
          }
          if (onComplete) {
            onComplete();
          }
        }
      }, interval);
    },
    []
  );

  // Handle hover - scramble only (don't advance to keep sync between header/footer)
  const handleMouseEnter = useCallback(() => {
    if (!slogans || slogans.length === 0) return;

    const currentSlogan = slogans[currentSloganIndex]?.slogan || '';

    // Perform scramble animation only, don't advance
    performScramble(currentSlogan);
  }, [slogans, currentSloganIndex, performScramble]);

  // Cycle through slogans
  useEffect(() => {
    if (!slogans || !Array.isArray(slogans) || slogans.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentSloganIndex((prevIndex) => (prevIndex + 1) % slogans.length);
    }, CYCLE_DURATION);

    return () => clearInterval(interval);
  }, [slogans]);

  // Scramble animation on index change
  useEffect(() => {
    if (sloganRef.current && slogans && slogans.length > 0) {
      const currentSlogan = slogans[currentSloganIndex]?.slogan || '';
      performScramble(currentSlogan);
    }
  }, [currentSloganIndex, slogans, performScramble]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrambleIntervalRef.current) {
        clearInterval(scrambleIntervalRef.current);
      }
    };
  }, []);

  if (!slogans || !Array.isArray(slogans) || slogans.length === 0) {
    return null;
  }

  return (
    <div className={className} ref={sloganRef} onMouseEnter={handleMouseEnter}>
      ( {slogans[currentSloganIndex]?.slogan} )
    </div>
  );
}
