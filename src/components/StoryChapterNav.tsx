import React, { useState, useEffect } from 'react';
import { playPopSound } from '../utils/audio';
import { BookOpen } from 'lucide-react';

interface Chapter {
  id: string;
  act: string;
  title: string;
}

const CHAPTERS: Chapter[] = [
  { id: 'prologue', act: '00', title: 'PROLOGUE' },
  { id: 'terroir', act: '01', title: 'TERROIR' },
  { id: 'our-process', act: '02', title: 'OUR PROCESS' },
  { id: 'catalog', act: '03', title: 'JUICE MENU' },
  { id: 'horaires', act: '04', title: 'TIMINGS' },
  { id: 'cleanses', act: '05', title: 'PLANS' },
];

export const StoryChapterNav: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState('prologue');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(Math.min(100, Math.round((currentScroll / totalHeight) * 100)));

      // Detect active chapter based on section positions
      for (let i = CHAPTERS.length - 1; i >= 0; i--) {
        const el = document.getElementById(CHAPTERS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            setActiveChapter(CHAPTERS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToChapter = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      playPopSound();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentChap = CHAPTERS.find((c) => c.id === activeChapter) || CHAPTERS[0];

  return (
    <>
      {/* Floating Storyline Indicator (Desktop Right Side) */}
      <aside
        aria-label="Storyline Chapters"
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3 select-none"
      >
        {/* Progress Pill Header */}
        <div className="bg-brand-950/90 text-brand-cream border border-brand-800/80 px-3 py-1.5 rounded-full text-[10px] font-mono backdrop-blur-xl shadow-xl flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-pulse" />
          <span className="font-bold text-brand-gold">ACT {currentChap.act}</span>
          <span className="text-brand-500">/</span>
          <span className="text-brand-300 font-bold tracking-wider">{currentChap.title}</span>
          <span className="text-brand-500 font-mono text-[9px] pl-1">{scrollProgress}%</span>
        </div>

        {/* Vertical Timeline Track */}
        <div className="bg-white/85 backdrop-blur-2xl p-2 rounded-2xl border border-brand-950/15 shadow-2xl flex flex-col gap-1.5 items-end">
          {CHAPTERS.map((chap) => {
            const isActive = activeChapter === chap.id;
            return (
              <button
                key={chap.id}
                onClick={() => scrollToChapter(chap.id)}
                className={`group flex items-center gap-2.5 py-1 px-2 rounded-xl text-right transition-all duration-300 ${
                  isActive
                    ? 'bg-brand-950 text-brand-cream font-bold shadow-md scale-102'
                    : 'text-brand-800 hover:text-brand-950 hover:bg-brand-parchment'
                }`}
                title={`Jump to Act ${chap.act}: ${chap.title}`}
              >
                <span
                  className={`text-[10px] font-mono tracking-wider transition-opacity ${
                    isActive ? 'opacity-100 font-black text-brand-amber' : 'opacity-0 group-hover:opacity-100 text-brand-600'
                  }`}
                >
                  {chap.title}
                </span>

                <span
                  className={`text-[10px] font-mono font-black ${
                    isActive ? 'text-brand-gold' : 'text-brand-500 group-hover:text-brand-950'
                  }`}
                >
                  {chap.act}
                </span>

                <span
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    isActive
                      ? 'bg-brand-amber scale-150 ring-2 ring-brand-amber/40'
                      : 'bg-brand-950/25 group-hover:bg-brand-amber'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </aside>

      {/* Floating Story Trigger for Mobile / Tablet */}
      <div className="fixed bottom-4 right-4 z-40 xl:hidden">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            playPopSound();
          }}
          className="px-3.5 py-2 rounded-full bg-brand-950 text-brand-cream border border-brand-800 text-xs font-mono font-bold flex items-center gap-2 shadow-2xl backdrop-blur-xl"
        >
          <BookOpen className="w-3.5 h-3.5 text-brand-amber" />
          <span>STORY: ACT {currentChap.act}</span>
        </button>

        {isOpen && (
          <div className="absolute bottom-12 right-0 w-64 bg-white/95 backdrop-blur-2xl rounded-2xl p-3 border border-brand-950/15 shadow-2xl space-y-1 animate-in zoom-in-95 duration-200">
            <div className="text-[10px] font-mono uppercase text-brand-500 font-bold px-2 py-1 border-b border-brand-950/10">
              The 8 Chronicle Acts:
            </div>
            {CHAPTERS.map((chap) => (
              <button
                key={chap.id}
                onClick={() => {
                  scrollToChapter(chap.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-mono flex items-center justify-between ${
                  activeChapter === chap.id
                    ? 'bg-brand-950 text-brand-cream font-bold'
                    : 'text-brand-800 hover:bg-brand-parchment'
                }`}
              >
                <span>{chap.title}</span>
                <span className="text-[10px] text-brand-amber font-black">ACT {chap.act}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
