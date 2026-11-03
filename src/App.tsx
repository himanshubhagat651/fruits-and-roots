import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CartProvider, useCart } from './context/CartContext';

// Register GSAP ScrollTrigger plugin globally
gsap.registerPlugin(ScrollTrigger);
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { NoiseOverlay } from './components/NoiseOverlay';
import { StoryBridge } from './components/StoryBridge';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MarqueeTicker } from './components/MarqueeTicker';
import { BentoGrid } from './components/BentoGrid';
import { BottleLiquidSimulator } from './components/BottleLiquidSimulator';
import { PinnedBottleJourney } from './components/PinnedBottleJourney';
import { ProductCatalog } from './components/ProductCatalog';
import { HorairesSchedule } from './components/HorairesSchedule';
import { SubscriptionSection } from './components/SubscriptionSection';
import { CraftFaqAccordion } from './components/CraftFaqAccordion';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { CheckCircle2 } from 'lucide-react';

const MainApp: React.FC = () => {
  const { toast } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPreloaded, setIsPreloaded] = useState(false);

  // Initialize Lenis Smooth Momentum Scrolling synchronized with GSAP ScrollTrigger (Henrietta Said architecture)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // Synchronize Lenis scroll with GSAP ScrollTrigger, update global progress & velocity skew
    let skewTimeout: ReturnType<typeof setTimeout>;
    lenis.on('scroll', (e: any) => {
      ScrollTrigger.update();

      // Update global scroll progress bar
      const progressEl = document.getElementById('global-scroll-progress');
      if (progressEl) {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, e.scroll / total)) : 0;
        progressEl.style.transform = `scaleX(${p})`;
      }

      // Henrietta Said dynamic scroll velocity skew (-2deg to +2deg)
      const velocity = e.velocity || 0;
      const skew = Math.max(-2.2, Math.min(2.2, velocity * 0.08));
      document.documentElement.style.setProperty('--scroll-velocity-skew', `${skew}deg`);

      clearTimeout(skewTimeout);
      skewTimeout = setTimeout(() => {
        document.documentElement.style.setProperty('--scroll-velocity-skew', '0deg');
      }, 100);
    });

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-brand-amber/25 selection:text-brand-950">
      
      {/* Henrietta Said Ultra-Fine Global Scroll Progress Indicator */}
      <div
        id="global-scroll-progress"
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#8A1521] via-[#C8741B] to-[#DDA74F] z-50 origin-left pointer-events-none transition-transform duration-75"
        style={{ transform: 'scaleX(0)' }}
      />
      
      {/* Awwwards Film Grain / Noise Overlay Shader */}
      <NoiseOverlay />

      {/* Awwwards Kinetic Preloader Intro */}
      {!isPreloaded && <Preloader onComplete={() => setIsPreloaded(true)} />}

      {/* Custom Precision Organic Trailing Cursor */}
      <CustomCursor />

      {/* Toast Feedback Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-950 text-brand-cream px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-4 h-4 text-brand-amber shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Archival Announcement Bar */}
      <AnnouncementBar />

      {/* Navigation */}
      <Navbar onSearchOpen={() => setIsSearchOpen(true)} />

      {/* Main Theatrical Storyline Flow */}
      <main className="flex-1">
        {/* PROLOGUE /00 • The Conviction of Raw Botany (Hero 3D Canvas) */}
        <Hero />

        {/* Velocity Dual-Direction Marquee Ribbon */}
        <MarqueeTicker />

        {/* Story Bridge 1: Our Cold-Press Philosophy */}
        <StoryBridge
          actBadge="OUR CRAFT PROMISE"
          quote="No fast blades. No heat. Just pure, slow cold-pressing. Regular juicers use spinning blades that heat up and ruin fresh vitamins. We gently squeeze whole fresh fruits and greens cold—keeping every drop naturally fresh, delicious, and full of honest nutrition."
          author="GENTLE COLD-PRESS METHOD"
          subtext="ZERO HEAT • 100% PURE JUICE • NOTHING ARTIFICIAL"
          theme="terracotta"
        />

        {/* ACT I /01 • Sourced from Organic Indian Farms */}
        <BentoGrid />

        {/* ACT II /02 • Interactive 3D Bottle Lab */}
        <BottleLiquidSimulator />

        {/* ACT III /03 • From Fresh Farm Harvest to Glass Bottle */}
        <PinnedBottleJourney />

        {/* Story Bridge 2: Real Fresh Ingredients */}
        <StoryBridge
          actBadge="FRESH FROM THE FARM"
          quote="Real fruits and plants speak for themselves. Golden turmeric brings warmth and natural balance. Crisp green leaves nourish and hydrate. Sweet red beetroot fuels your day with natural energy."
          author="100% NATURAL HARVEST"
          subtext="ZERO PRESERVATIVES • ZERO ADDED SUGAR • RAW & COLD-PRESSED"
          theme="amber"
        />

        {/* ACT IV /04 • The Single Living Cold-Pressed Juice Compendium (Unified Masterpiece) */}
        <ProductCatalog />

        {/* Bar Tòpas Signature "HORAIRES" Dispensary Schedule & Living Harvest Hours */}
        <HorairesSchedule />

        {/* ACT VII /07 • Targeted Cellular Reset Protocols (Multi-Day Schedules) */}
        <SubscriptionSection />

        {/* Craft Archives & Frequently Asked Questions */}
        <CraftFaqAccordion />

        {/* EPILOGUE • Verified Living Community & Editorial Acclaim */}
        <ReviewsSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Interactive Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}
