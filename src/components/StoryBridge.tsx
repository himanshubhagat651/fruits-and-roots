import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';

interface StoryBridgeProps {
  quote: string;
  author: string;
  subtext: string;
  theme?: 'dark' | 'amber' | 'terracotta' | 'forest';
  actBadge?: string;
}

export const StoryBridge: React.FC<StoryBridgeProps> = ({
  quote,
  author,
  subtext,
  theme = 'dark',
  actBadge,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  const themeStyles = {
    dark: 'bg-brand-950 text-brand-cream border-brand-800',
    amber: 'bg-[#B45309] text-white border-amber-900',
    terracotta: 'bg-[#8A1521] text-white border-red-950',
    forest: 'bg-[#1E3023] text-white border-green-950',
  };

  // Split quote into words for Henrietta Said kinetic scroll mask reveal
  const words = quote.split(' ');

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordsRef.current,
        {
          yPercent: 110,
          opacity: 0,
          rotateZ: 2,
        },
        {
          yPercent: 0,
          opacity: 1,
          rotateZ: 0,
          duration: 0.85,
          stagger: 0.02,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [quote]);

  return (
    <section
      ref={containerRef}
      className={`py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-y select-none relative overflow-hidden ${themeStyles[theme]}`}
    >
      {/* Background Radial Ambient Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
        {actBadge && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold uppercase tracking-widest text-brand-gold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
            <span>{actBadge}</span>
          </div>
        )}

        {/* Word-by-Word Scroll Mask Reveal (Henrietta Said Signature) */}
        <blockquote className="font-serif italic text-2xl sm:text-4xl md:text-5xl leading-tight max-w-4xl mx-auto font-normal flex flex-wrap justify-center">
          &ldquo;
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.26em] py-0.5">
              <span
                ref={(el) => {
                  if (el) wordsRef.current[i] = el;
                }}
                className="inline-block will-change-transform"
              >
                {word}
              </span>
            </span>
          ))}
          &rdquo;
        </blockquote>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 font-mono text-xs text-white/70">
          <span className="font-black uppercase tracking-widest text-brand-gold">{author}</span>
          <span className="hidden sm:inline opacity-40">•</span>
          <span className="uppercase tracking-wider">{subtext}</span>
        </div>
      </div>
    </section>
  );
};
