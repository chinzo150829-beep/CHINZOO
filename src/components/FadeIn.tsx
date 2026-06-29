import { useState, useEffect, ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay: number;
  duration?: number;
  className?: string;
}

export default function FadeIn({ children, delay, duration = 1000, className = '' }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-opacity ease-out ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}
