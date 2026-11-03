import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';

interface StoryBridgeProps {
  quote: string;
  author: string;
  subtext: string;
  theme?: 'dark' | 'amber' | 'terracotta' | 'forest' | 'parchment';
  actBadge?: string;
}

export const StoryBridge: React.FC<StoryBridgeProps> = ({
  quote,
  author,
  subtext,
  theme = 'terracotta',
  actBadge,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  // Bespoke botanical palette tailored to Fruits & Roots visual identity
  const themeStyles = {
    terracotta: {
      section: 'bg-gradient-to-b from-[#750E1A] via-[#8A1521] to-[#6E0B16] text-[#FAF6EE] border-[#5A0811]',
      flare: 'bg-amber-400/12',
      badge: 'bg-white/12 border-white/25 text-[#FFD166]',
      quoteText: 'text-[#FAF6EE]',
      author: 'text-[#FFD166]',
      subtext: 'text-white/80',
      sparkle: 'text-[#FFD166]',
      borderTop: 'border-t border-[#A82030]/40',
      borderBottom: 'border-b border-[#5A0811]',
    },
    amber: {
      section: 'bg-gradient-to-b from-[#9A4204] via-[#B45309] to-[#8C3A03] text-white border-[#732E02]',
      flare: 'bg-yellow-300/15',
      badge: 'bg-white/15 border-white/25 text-[#FFE6A7]',
      quoteText: 'text-[#FFFDF7]',
      author: 'text-[#FFE6A7]',
      subtext: 'text-white/80',
      sparkle: 'text-[#FFE6A7]',
      borderTop: 'border-t border-[#D97706]/40',
      borderBottom: 'border-b border-[#732E02]',
    },
    forest: {
      section: 'bg-gradient-to-b from-[#16291B] via-[#1E3825] to-[#132317] text-[#FAF6EE] border-[#0E1A11]',
      flare: 'bg-emerald-400/12',
      badge: 'bg-white/12 border-white/25 text-[#95D5B2]',
      quoteText: 'text-[#FAF6EE]',
      author: 'text-[#95D5B2]',
      subtext: 'text-white/80',
      sparkle: 'text-[#95D5B2]',
      borderTop: 'border-t border-[#2D5A3A]/40',
      borderBottom: 'border-b border-[#0E1A11]',
    },
    parchment: {
      section: 'bg-gradient-to-b from-[#F7F2E8] via-[#EFE7D8] to-[#E8DFC9] text-brand-950 border-[#D8CDB6]',
      flare: 'bg-amber-500/8',
      badge: 'bg-brand-950/8 border-brand-950/15 text-[#8A1521]',
      quoteText: 'text-brand-950',
      author: 'text-[#8A1521]',
      subtext: 'text-brand-800/80',
      sparkle: 'text-[#8A1521]',
      borderTop: 'border-t border-[#E2D6BE]',
      borderBottom: 'border-b border-[#D8CDB6]',
    },
    dark: {
      section: 'bg-gradient-to-b from-[#1C1513] via-[#241B18] to-[#181210] text-[#FAF6EE] border-[#2A201C]',
      flare: 'bg-amber-500/10',
      badge: 'bg-white/10 border-white/20 text-brand-gold',
      quoteText: 'text-[#FAF6EE]',
      author: 'text-brand-gold',
      subtext: 'text-white/70',
      sparkle: 'text-brand-amber',
      borderTop: 'border-t border-white/10',
      borderBottom: 'border-b border-black/40',
    },
  };

  const style = themeStyles[theme] || themeStyles.terracotta;

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
      className={`py-20 sm:py-28 px-4 sm:px-6 lg:px-8 select-none relative overflow-hidden ${style.section} ${style.borderTop} ${style.borderBottom}`}
    >
      {/* Background Radial Ambient Flare */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[350px] rounded-full blur-3xl pointer-events-none ${style.flare}`} />

      {/* Subtle organic texture dots */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
        {actBadge && (
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono font-bold uppercase tracking-widest shadow-sm backdrop-blur-sm ${style.badge}`}>
            <Sparkles className={`w-3.5 h-3.5 ${style.sparkle}`} />
            <span>{actBadge}</span>
          </div>
        )}

        {/* Word-by-Word Scroll Mask Reveal */}
        <blockquote className={`font-serif italic text-2xl sm:text-4xl md:text-5xl leading-tight max-w-4xl mx-auto font-normal flex flex-wrap justify-center drop-shadow-sm ${style.quoteText}`}>
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

        <div className={`pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 font-mono text-xs ${style.subtext}`}>
          <span className={`font-black uppercase tracking-widest ${style.author}`}>{author}</span>
          <span className="hidden sm:inline opacity-40">◆</span>
          <span className="uppercase tracking-wider">{subtext}</span>
        </div>
      </div>
    </section>
  );
};
