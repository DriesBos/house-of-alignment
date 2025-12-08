'use client';

import styles from './date-display.module.sass';

interface DateDisplayProps {
  date: string;
  className?: string;
}

export default function DateDisplay({ date, className }: DateDisplayProps) {
  const formatDate = (dateString: string): string => {
    const dateObj = new Date(dateString);

    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
    const year = dateObj.getFullYear();

    return `${day} ${month}, ${year}`;
  };

  if (!date) return null;

  return (
    <span className={`${styles.dateDisplay} ${className || ''}`}>
      {formatDate(date)}
    </span>
  );
}
