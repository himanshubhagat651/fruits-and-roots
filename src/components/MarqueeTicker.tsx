import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { playPopSound } from '../utils/audio';

export const MarqueeTicker: React.FC = () => {
  const { openProductModal } = useCart();
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const velocityRef = useRef(1);

  // Drag interaction state for manual touch/mouse scrubbing
  const [dragOffset1, setDragOffset1] = useState(0);
  const [dragOffset2, setDragOffset2] = useState(0);
  const isDragging1 = useRef(false);
  const isDragging2 = useRef(false);
  const startX1 = useRef(0);
  const startX2 = useRef(0);
  const initialOffset1 = useRef(0);
  const initialOffset2 = useRef(0);
  const hasMoved2 = useRef(false);

  const statements = [
    '100% FRESH ORGANIC INDIAN HARVEST',
    'COLD-PRESSED DAILY • ZERO HEAT',
    'ZERO ADDED SUGAR • NO PRESERVATIVES',
    'OVER 1.5 KG OF FRESH PRODUCE PER BOTTLE',
    'RETURN EMPTY GLASS BOTTLES (₹25 CASHBACK)',
    'FAST CHILLED DELIVERY IN MUMBAI',
    'DELIVERED FRESH AT 2.2°C TO YOUR DOOR',
    'SOURCED FROM LOCAL INDIAN FARMS: MEGHALAYA • WAYANAD • KASHMIR • RATNAGIRI',
  ];

  const formulas = [
    { name: 'GOLDEN ROOTS GLOW (WILD TURMERIC & VALENCIA ORANGE)', id: 'golden-roots-glow' },
    { name: 'EMERALD CANOPY (NILGIRI KALE & FRESH MINT)', id: 'emerald-canopy-detox' },
    { name: 'RUBY BEET VITALITY (OOTY BEETROOT & FRESH POMEGRANATE)', id: 'ruby-beet-vitality' },
    { name: 'DRAGON FRUIT SUNRISE (KUTCH PITAYA & RATNAGIRI MANGO)', id: 'pitaya-sunrise-velvet' },
    { name: 'BLUE SPIRULINA TONIC (TENDER COCONUT WATER)', id: 'blue-majik-cloud' },
    { name: 'PURE CELERY & FENNEL (CRISP HIMALAYAN STALKS)', id: 'raw-cacao-reishi-bliss' },
    { name: 'FIRE & GINGER SHOT (KERALA GINGER & FRESH LEMON)', id: 'fire-ginger-immunity-shot' },
    { name: 'ACTIVATED CHARCOAL ELIXIR (ORGANIC COCONUT & LIME)', id: 'activated-charcoal-zen' },
  ];

  // Quadruple items to guarantee infinite seamless wrap across all ultra-wide & 4K screens
  const repeatedStatements = [...statements, ...statements, ...statements, ...statements];
  const repeatedFormulas = [...formulas, ...formulas, ...formulas, ...formulas];

  // Dynamic velocity on scroll using Web Animations API (smooth 60fps/120fps hardware acceleration)
  useEffect(() => {
    let animationFrameId: number;
    let currentSpeed = 1;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY.current);
      lastScrollY.current = currentScrollY;

      velocityRef.current = Math.min(3.5, 1 + delta * 0.04);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const updateVelocity = () => {
      currentSpeed += (velocityRef.current - currentSpeed) * 0.08;
      velocityRef.current += (1 - velocityRef.current) * 0.05;

      // Update Web Animations API playbackRate for silky-smooth motion without CSS animation restarts
      if (track1Ref.current) {
        const anims = track1Ref.current.getAnimations();
        if (anims && anims.length > 0) {
          anims.forEach((anim) => {
            anim.playbackRate = currentSpeed;
          });
        } else {
          track1Ref.current.style.setProperty('--ticker-speed', `${28 / currentSpeed}s`);
        }
      }

      if (track2Ref.current) {
        const anims = track2Ref.current.getAnimations();
        if (anims && anims.length > 0) {
          anims.forEach((anim) => {
            anim.playbackRate = currentSpeed;
          });
        } else {
          track2Ref.current.style.setProperty('--ticker-speed', `${32 / currentSpeed}s`);
        }
      }

      animationFrameId = requestAnimationFrame(updateVelocity);
    };

    animationFrameId = requestAnimationFrame(updateVelocity);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Track 1 Drag Handlers
  const handlePointerDown1 = (e: React.PointerEvent) => {
    isDragging1.current = true;
    startX1.current = e.clientX;
    initialOffset1.current = dragOffset1;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove1 = (e: React.PointerEvent) => {
    if (!isDragging1.current) return;
    const delta = e.clientX - startX1.current;
    setDragOffset1(initialOffset1.current + delta);
  };

  const handlePointerUp1 = (e: React.PointerEvent) => {
    isDragging1.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  // Track 2 Drag Handlers
  const handlePointerDown2 = (e: React.PointerEvent) => {
    isDragging2.current = true;
    startX2.current = e.clientX;
    initialOffset2.current = dragOffset2;
    hasMoved2.current = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove2 = (e: React.PointerEvent) => {
    if (!isDragging2.current) return;
    const delta = e.clientX - startX2.current;
    if (Math.abs(delta) > 5) {
      hasMoved2.current = true;
    }
    setDragOffset2(initialOffset2.current + delta);
  };

  const handlePointerUp2 = (e: React.PointerEvent) => {
    isDragging2.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handleFormulaClick = (productId: string) => {
    // If the user was dragging/scrubbing, do not trigger modal
    if (hasMoved2.current) return;

    const found = PRODUCTS.find((p) => p.id === productId);
    if (found) {
      playPopSound();
      openProductModal(found);
    }
  };

  return (
    <section className="py-5 bg-cream-100 border-y border-brand-950/10 overflow-hidden select-none relative z-20 hover-pause">
      
      {/* Track 1: Archival Statements (Leftwards Forward Movement, Draggable) */}
      <div
        className="relative w-full overflow-hidden whitespace-nowrap mb-3 flex cursor-grab active:cursor-grabbing touch-pan-y"
        onPointerDown={handlePointerDown1}
        onPointerMove={handlePointerMove1}
        onPointerUp={handlePointerUp1}
        onPointerCancel={handlePointerUp1}
      >
        <div
          className="will-change-transform flex"
          style={{ transform: `translate3d(${dragOffset1}px, 0, 0)` }}
        >
          <div
            ref={track1Ref}
            className="inline-flex animate-ticker-forward will-change-transform"
          >
            {repeatedStatements.map((stmt, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-6 px-6 text-xs sm:text-sm font-mono font-bold text-brand-950 tracking-widest uppercase"
              >
                <span>{stmt}</span>
                <span className="text-brand-amber font-display text-base leading-none select-none">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Track 2: Interactive Botanical Formulas (Rightwards Reverse Movement, Draggable, Clickable) */}
      <div
        className="relative w-full overflow-hidden whitespace-nowrap flex cursor-grab active:cursor-grabbing touch-pan-y"
        onPointerDown={handlePointerDown2}
        onPointerMove={handlePointerMove2}
        onPointerUp={handlePointerUp2}
        onPointerCancel={handlePointerUp2}
      >
        <div
          className="will-change-transform flex"
          style={{ transform: `translate3d(${dragOffset2}px, 0, 0)` }}
        >
          <div
            ref={track2Ref}
            className="inline-flex animate-ticker-reverse will-change-transform"
          >
            {repeatedFormulas.map((form, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleFormulaClick(form.id)}
                className="inline-flex items-center gap-6 px-6 text-xs sm:text-sm font-serif italic font-medium tracking-wider uppercase text-brand-900/90 hover:text-brand-amber transition-colors group cursor-pointer"
              >
                <span className="group-hover:underline underline-offset-4 decoration-brand-amber/60">
                  {form.name}
                </span>
                <span className="text-brand-950/40 text-xs font-sans not-italic select-none">
                  •
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};