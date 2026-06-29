import { useState, useEffect } from 'react';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  letterSpacing?: string;
}

export default function AnimatedHeading({ text, className = '', letterSpacing = '-0.04em' }: AnimatedHeadingProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Reset animate first to allow transition to replay if text changes
    setAnimate(false);
    const renderTick = setTimeout(() => {
      const timer = setTimeout(() => {
        setAnimate(true);
      }, 200);
      return () => clearTimeout(timer);
    }, 20);
    return () => clearTimeout(renderTick);
  }, [text]);

  const lines = text.split('\n');

  return (
    <h1 className={className} style={{ letterSpacing }}>
      {lines.map((line, lineIndex) => {
        const lineLength = line.length;
        const charDelay = 30; // 30ms

        return (
          <span key={lineIndex} className="block py-1">
            {line.split('').map((char, charIndex) => {
              const delay = (lineIndex * lineLength * charDelay) + (charIndex * charDelay);
              const isSpace = char === ' ';

              return (
                <span
                  key={charIndex}
                  className="inline-block transition-all ease-out"
                  style={{
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateX(0)' : 'translateX(-18px)',
                    transitionDuration: '500ms',
                    transitionDelay: `${delay}ms`,
                    whiteSpace: 'pre',
                  }}
                >
                  {isSpace ? '\u00A0' : char}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
}
