'use client';

import styles from './index-three-column.module.sass';
import React, { useRef, useEffect, useState } from 'react';
import { ISbStoryData } from '@storyblok/react/rsc';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ContentColumn from '@/components/content-column/content-column';
import IndexBlok from '@/components/index-blok/index-blok';
import { useLayoutStore } from '@/providers/layout-store-provider';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

const IndexThreeColumn = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const column1Ref = useRef<HTMLDivElement>(null);
  const column2Ref = useRef<HTMLDivElement>(null);
  const column3Ref = useRef<HTMLDivElement>(null);
  const layout = useLayoutStore((state) => state.layout);
  const setLayout = useLayoutStore((state) => state.setLayout);
  const [filteredStories, setFilteredStories] = useState<ISbStoryData[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<ISbStoryData[]>(
    []
  );

  // Set layout to 'three' when component mounts
  useEffect(() => {
    setLayout('three');
  }, [setLayout]);

  // Fetch stories from the 'dinners' folder
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(
          `https://api.storyblok.com/v2/cdn/stories?version=published&starts_with=dinners/&token=${process.env.NEXT_PUBLIC_STORYBLOK_TOKEN}`
        );
        const data = await response.json();

        // Remove the first entry if it's called 'index'
        let filteredStories = data.stories;

        filteredStories = data.stories.slice(1);
        setFilteredStories(filteredStories);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, []);

  // Fetch stories from the 'interviews' folder
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch(
          `https://api.storyblok.com/v2/cdn/stories?version=published&starts_with=interviews/&token=${process.env.NEXT_PUBLIC_STORYBLOK_TOKEN}`
        );
        const data = await response.json();

        // Remove the first entry if it's called 'index'
        let filteredInterviews = data.stories;

        filteredInterviews = data.stories.slice(1);
        setFilteredInterviews(filteredInterviews);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      }
    };

    fetchInterviews();
  }, []);

  useGSAP(
    () => {
      // Wait for content to be rendered
      if (
        !containerRef.current ||
        filteredStories.length === 0 ||
        filteredInterviews.length === 0
      )
        return;

      // Use requestAnimationFrame to ensure DOM is fully updated
      requestAnimationFrame(() => {
        // Set up ScrollTrigger default configuration
        ScrollTrigger.defaults({
          scroller: '.storeDataWrapper',
        });

        // Get all column references and their heights
        const columnData = [
          {
            ref: column1Ref.current,
            height: column1Ref.current?.offsetHeight || 0,
          },
          {
            ref: column2Ref.current,
            height: column2Ref.current?.offsetHeight || 0,
          },
          {
            ref: column3Ref.current,
            height: column3Ref.current?.offsetHeight || 0,
          },
        ];

        // Validate that columns have height before creating animations
        if (columnData.some((col) => col.height === 0)) return;

        // Find the longest column
        const maxHeight = Math.max(...columnData.map((col) => col.height));
        const longestColumnIndex = columnData.findIndex(
          (col) => col.height === maxHeight
        );

        // Apply animations to columns, skipping the longest one
        columnData.forEach((col, index) => {
          if (!col.ref || index === longestColumnIndex) return;

          // Calculate how many pixels this column should move
          const pixelsToMove = maxHeight - col.height;

          gsap.to(col.ref, {
            y: pixelsToMove,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        });
      });
    },
    {
      scope: containerRef,
      dependencies: [layout, filteredStories, filteredInterviews],
      revertOnUpdate: true,
    }
  );

  return (
    <div className={styles.indexThreeColumn} ref={containerRef}>
      <div ref={column1Ref}>
        <ContentColumn>
          {filteredStories.map((item) => (
            <IndexBlok
              key={item.uuid}
              title={item.content.page_title}
              image={item.content.page_image}
              tags={item.tag_list}
              seats={item.content.chairs}
              link={item.full_slug}
            />
          ))}
        </ContentColumn>
      </div>
      <div ref={column2Ref}>
        <ContentColumn>
          {filteredInterviews.map((item) => (
            <IndexBlok
              key={item.uuid}
              title={item.content.page_title}
              image={item.content.page_image}
              tags={item.tag_list}
              seats={item.content.chairs}
              link={item.full_slug}
            />
          ))}
        </ContentColumn>
      </div>
      <div ref={column3Ref}>
        <ContentColumn>
          {filteredStories.map((item) => (
            <IndexBlok
              key={item.uuid}
              title={item.content.page_title}
              image={item.content.page_image}
              tags={item.tag_list}
              seats={item.content.chairs}
              link={item.full_slug}
            />
          ))}
        </ContentColumn>
      </div>
    </div>
  );
};

export default IndexThreeColumn;
