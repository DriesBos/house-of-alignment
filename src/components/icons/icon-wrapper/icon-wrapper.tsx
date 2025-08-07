import { ReactNode } from 'react';
import styles from './icon-wrapper.module.sass';

interface IconWrapperProps {
  children: ReactNode;
}

export default function IconWrapper({ children }: IconWrapperProps) {
  return <div className={styles.iconWrapper}>{children}</div>;
}
