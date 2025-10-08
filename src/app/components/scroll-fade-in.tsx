"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type ScrollFadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
};

export function ScrollFadeIn({ children, className, delay = 0, yOffset = 50 }: ScrollFadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const variants = {
    hidden: { opacity: 0, y: yOffset },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
