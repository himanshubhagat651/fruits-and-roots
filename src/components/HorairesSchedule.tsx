import React, { useState, useEffect, useRef } from 'react';
import { playPopSound, playChimeSound, playGlassClinkSound } from '../utils/audio';
import { Sparkles, ArrowRight, Clock } from 'lucide-react';

export const HorairesSchedule: React.FC = () => {
  // Live ticking clock for IST (Indian Standard Time)
  const [time, setTime] = useState<Date>(new Date());
  const [isClinking, setIsClinking] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Clock hand calculations
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6 + seconds * 0.1;

  // Determine if dispensary is currently active (6:30 AM to 10:30 PM IST)
  const isCurrentlyOpen = (hours > 6 || (hours === 6 && minutes >= 30)) && (hours < 22 || (hours === 22 && minutes <= 30));

  // Mouse move for 3D perspective parallax on the drink illustration
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  // Toast Clink interaction with authentic juice splash burst
  const triggerToast = () => {
    playGlassClinkSound();
    playPopSound();
    setIsClinking(true);
    setToastKey((k) => k + 1);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setIsClinking(false), 1200);
  };

  return (
    <section
      id="horaires"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative bg-[#F2EADF] text-[#8A1521] overflow-hidden select-none"
    >
      {/* 1. Bar Topas Signature Scalloped Awning Top Border */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
        <svg
          viewBox="0 0 1440 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-5 sm:h-7 block fill-[#FAF6EE]"
          preserveAspectRatio="none"
        >
          <path d="M0,0 L0,2 C24,20 48,20 72,2 C96,20 120,20 144,2 C168,20 192,20 216,2 C240,20 264,20 288,2 C312,20 336,20 360,2 C384,20 408,20 432,2 C456,20 480,20 504,2 C528,20 552,20 576,2 C600,20 624,20 648,2 C672,20 696,20 720,2 C744,20 768,20 792,2 C816,20 840,20 864,2 C888,20 912,20 936,2 C960,20 984,20 1008,2 C1032,20 1056,20 1080,2 C1104,20 1128,20 1152,2 C1176,20 1200,20 1224,2 C1248,20 1272,20 1296,2 C1320,20 1344,20 1368,2 C1392,20 1416,20 1440,2 L1440,0 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20 sm:pb-28 relative z-10">
        
        {/* 2. Top Header Navigation Bar (Direct Bar Topas Layout) */}
        <div className="flex items-center justify-between pb-10 sm:pb-14">
          
          {/* Oval Sticker Badge: TÒPAS / FRUITS & ROOTS */}
          <div className="relative group cursor-pointer" onClick={playPopSound}>
            <div className="px-5 py-2.5 rounded-full bg-[#FAF6EE] text-[#8A1521] border-2 border-[#8A1521]/15 shadow-md flex items-center gap-2 -rotate-3 group-hover:rotate-0 transition-transform duration-300">
              <span className="font-display font-black text-xs sm:text-sm uppercase tracking-wider">
                TÒPAS &bull; LIVING LAB
              </span>
            </div>
          </div>

          {/* Center Burgundy Capsule Badge (Matching MER DÈS 18H30) */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#8A1521] text-white font-mono text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C8741B] animate-pulse" />
            <span>DAILY FROM 6:30 A.M. IST</span>
          </div>

          {/* Right Pill Link (Matching BAR LE TOPAZE ↗) */}
          <a
            href="#catalog"
            onClick={playPopSound}
            className="hidden sm:inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white text-[#8A1521] border border-[#8A1521]/20 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#8A1521] hover:text-white transition-all shadow-xs hover:scale-105 active:scale-95"
          >
            <span>DISPENSARY MENU</span>
            <span className="text-sm font-sans font-bold">↗</span>
          </a>
        </div>

        {/* 3. Main Content: Grid with Text/Timings on Left, Giant Crimson Circle with Drinks on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Schedule & Typography */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Eyebrow with Working Analog Clock */}
            <div className="flex items-center gap-3">
              {/* Working SVG Analog Clock */}
              <div className="w-9 h-9 rounded-full bg-[#FAF6EE] border-2 border-[#C8741B] shadow-sm relative flex items-center justify-center shrink-0">
                {/* Clock Center Pin */}
                <div className="w-1.5 h-1.5 rounded-full bg-[#C8741B] z-10" />
                {/* Hour Hand */}
                <div
                  className="absolute w-0.5 h-2.5 bg-[#8A1521] origin-bottom rounded-full"
                  style={{
                    bottom: '50%',
                    transform: `rotate(${hourAngle}deg)`,
                    transition: 'transform 0.5s ease',
                  }}
                />
                {/* Minute Hand */}
                <div
                  className="absolute w-0.5 h-3.5 bg-[#C8741B] origin-bottom rounded-full"
                  style={{
                    bottom: '50%',
                    transform: `rotate(${minuteAngle}deg)`,
                    transition: 'transform 0.5s ease',
                  }}
                />
              </div>

              <div className="space-y-0.5">
                <span className="text-xs sm:text-sm font-display font-black uppercase tracking-[0.2em] text-[#C8741B] block">
                  THE PRESS ROOM IS OPEN
                </span>
                <span className="text-[10px] font-mono font-bold text-[#8A1521]/80 block">
                  BANDRA WEST, MUMBAI &bull; {isCurrentlyOpen ? '🟢 LIVE PRESSING ACTIVE' : '🟡 OVERNIGHT COLD CELL'}
                </span>
              </div>
            </div>

            {/* Giant Display Headline: HORAIRES */}
            <h2 className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[7.5rem] font-black text-[#8A1521] tracking-tight uppercase leading-[0.85] drop-shadow-xs">
              HORAIRES
            </h2>

            {/* Timings List */}
            <div className="space-y-6 pt-2">
              
              {/* Slot 1: SEA & GAME / DAILY COLD-PRESS */}
              <div className="space-y-1">
                <span className="text-sm sm:text-base font-display font-black text-[#C8741B] uppercase tracking-wider block">
                  SEA &amp; GAME &bull; FRESH DISPATCH
                </span>
                <div className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-[#8A1521] tracking-tight flex items-center gap-3 sm:gap-5 flex-wrap">
                  <span>6:30 P.M</span>
                  <span className="text-3xl sm:text-5xl text-[#C8741B] font-light">→</span>
                  <span>10:30 P.M</span>
                </div>
              </div>

              {/* Slot 2: FRI & WEEKENDS with Circle-Ring Arrow */}
              <div className="space-y-1">
                <span className="text-sm sm:text-base font-display font-black text-[#C8741B] uppercase tracking-wider block">
                  FRI &bull; WEEKEND CELLULAR RESET
                </span>
                <div className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-[#8A1521] tracking-tight flex items-center gap-3 sm:gap-5 flex-wrap">
                  <span>5:00 P.M</span>
                  {/* Signature Arrow with Circle Ring on Shaft (Direct Bar Topas Reference) */}
                  <span className="inline-flex items-center text-[#C8741B]">
                    <span className="w-8 sm:w-16 h-1 bg-[#C8741B] inline-block" />
                    <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 sm:border-3 border-[#C8741B] bg-[#FAF6EE] inline-block -mx-1 z-10" />
                    <span className="w-8 sm:w-14 h-1 bg-[#C8741B] inline-block" />
                    <span className="text-2xl sm:text-4xl -ml-2 font-bold leading-none">▶</span>
                  </span>
                  <span>10:30 P.M</span>
                </div>
              </div>

            </div>

            {/* Handwritten Signature Script: el gusto por lo bueno */}
            <div className="pt-4 sm:pt-6">
              <div
                onClick={triggerToast}
                className="inline-block group cursor-pointer"
                title="Click to salute living vitality"
              >
                <p className="font-script text-5xl sm:text-7xl md:text-8xl text-[#C8741B] -rotate-4 group-hover:rotate-0 transition-transform duration-300 drop-shadow-sm select-none">
                  el gusto por lo bueno
                </p>
                <span className="font-mono text-xs text-[#8A1521]/75 font-bold uppercase tracking-widest block pt-1">
                  &mdash; Pure living raw earth &bull; Handcrafted in Mumbai
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Giant Burgundy Circle with Clinking Cold-Pressed Juice Glasses & Dynamic Juice Splash */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-8 lg:pt-0">
            
            {/* Giant Wine Burgundy Backdrop Circle (Direct Bar Topas Reference) */}
            <div className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px] rounded-full bg-[#8A1521] shadow-2xl flex items-center justify-center overflow-visible">
              
              {/* Subtle ambient glow ring */}
              <div className="absolute inset-0 rounded-full border-4 border-[#FAF6EE]/15 scale-95 pointer-events-none" />

              {/* Parallax Container for Juice Glasses */}
              <div
                onClick={triggerToast}
                style={{
                  transform: `translate3d(${mousePos.x * 24}px, ${mousePos.y * 24}px, 0)`,
                  transition: 'transform 0.15s ease-out',
                }}
                className="relative z-10 cursor-pointer flex items-end justify-center gap-3 sm:gap-6 select-none"
              >
                {/* JUICE GLASS 1: Golden Roots Cold-Pressed Tumbler */}
                <div
                  className={`relative transition-all duration-300 origin-bottom-right ${
                    isClinking
                      ? 'rotate-[-16deg] translate-x-4 sm:translate-x-6'
                      : 'hover:rotate-[-5deg]'
                  }`}
                >
                  {/* Fresh Orange Wheel Garnish clipped to top-left rim */}
                  <div className="absolute -top-4 -left-3 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/90 bg-gradient-to-br from-[#FBBF24] via-[#F59E0B] to-[#D97706] shadow-lg z-30 flex items-center justify-center pointer-events-none">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/60 bg-[#F59E0B]/60 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#DE492A]" />
                    </div>
                  </div>

                  {/* Glass Outer Cylinder */}
                  <div className="w-28 sm:w-36 h-48 sm:h-64 rounded-b-2xl rounded-t-lg border-3 border-[#8A1521] bg-white/15 backdrop-blur-xs shadow-2xl relative overflow-hidden flex flex-col justify-end p-2.5">
                    
                    {/* Clear Glass Lip / Rim Reflection */}
                    <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-white/40 to-transparent border-b border-white/20 pointer-events-none" />

                    {/* Cold-Pressed Golden Juice Liquid Fill */}
                    <div
                      className={`relative w-full h-[85%] rounded-b-xl overflow-hidden bg-gradient-to-b from-[#FCD17A] via-[#F59E0B] to-[#D97706] shadow-inner flex flex-col justify-between p-2.5 ${
                        isClinking ? 'animate-liquid-slosh-l' : ''
                      }`}
                    >
                      {/* Juice Surface Ellipse Meniscus */}
                      <div className="absolute top-0 inset-x-0 h-3.5 bg-gradient-to-r from-[#FDE68A] via-[#FBBF24] to-[#F59E0B] rounded-full border-b border-white/30 shadow-xs" />

                      {/* Translucent Floating Ice Cubes */}
                      <div className="absolute top-4 left-3 w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-white/40 border border-white/60 shadow-inner -rotate-12 backdrop-blur-xs pointer-events-none">
                        <div className="w-2 h-2 border-t border-l border-white/80 m-1" />
                      </div>
                      <div className="absolute top-10 right-3 w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-white/35 border border-white/50 shadow-inner rotate-12 backdrop-blur-xs pointer-events-none">
                        <div className="w-1.5 h-1.5 border-t border-l border-white/80 m-1" />
                      </div>

                      {/* Natural Cold-Press Micro-Bubbles */}
                      <div className="absolute bottom-6 left-5 w-2 h-2 rounded-full bg-white/70 animate-bounce pointer-events-none" />
                      <div className="absolute bottom-12 right-6 w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse pointer-events-none" />
                      <div className="absolute bottom-20 left-7 w-1 h-1 rounded-full bg-white/80 pointer-events-none" />

                      {/* Glass Sheen / Reflection Streak */}
                      <div className="absolute top-0 left-2 w-2 h-full bg-white/35 rounded-full blur-[0.5px] pointer-events-none" />
                      <div className="absolute top-0 right-3 w-1 h-full bg-white/20 rounded-full pointer-events-none" />

                      {/* Juice Label Badge */}
                      <div className="mt-auto mx-auto px-2.5 py-0.5 rounded-md bg-[#8A1521] text-white font-mono text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-center shadow-xs">
                        GOLDEN JUICE &bull; 2.2°C
                      </div>
                    </div>

                    {/* Heavy Glass Sham Bottom Base */}
                    <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-white/40 via-white/20 to-transparent border-t border-white/30 rounded-b-xl pointer-events-none" />
                  </div>

                  {/* Golden Juice Splashes Erupting & Falling on Clink */}
                  {isClinking && (
                    <div key={`splash-l-${toastKey}`} className="pointer-events-none absolute inset-0 z-40 overflow-visible">
                      {/* Droplet 1: High arching golden drop falling right */}
                      <div className="absolute -top-3 right-0 w-3.5 h-4 sm:w-4 sm:h-5 rounded-full bg-[#F59E0B] border border-white/80 shadow-md animate-juice-splash-l1" />
                      
                      {/* Droplet 2: Higher arching golden drop falling down */}
                      <div className="absolute -top-6 right-4 w-3 h-3.5 sm:w-3.5 sm:h-4 rounded-full bg-[#FCD17A] border border-white/70 shadow-sm animate-juice-splash-l2" />
                      
                      {/* Droplet 3: Wide spray golden drop */}
                      <div className="absolute -top-2 right-8 w-2 h-2.5 sm:w-2.5 sm:h-3 rounded-full bg-[#D97706] shadow-xs animate-juice-splash-l3" />

                      {/* Droplet 4: Tiny micro-droplet falling down */}
                      <div className="absolute -top-4 right-2 w-2 h-2 rounded-full bg-[#FBBF24] animate-juice-splash-l1" style={{ animationDelay: '0.05s' }} />

                      {/* Juice Drip sliding down outer glass */}
                      <div className="absolute top-4 right-1 w-1.5 h-3 rounded-full bg-[#F59E0B]/80 animate-pulse" />
                    </div>
                  )}
                </div>

                {/* JUICE GLASS 2: Ruby Beet Vitality Tumbler */}
                <div
                  className={`relative transition-all duration-300 origin-bottom-left ${
                    isClinking
                      ? 'rotate-[16deg] -translate-x-4 sm:-translate-x-6'
                      : 'hover:rotate-[5deg]'
                  }`}
                >
                  {/* Fresh Mint & Lime Garnish perched on top-right rim */}
                  <div className="absolute -top-4 -right-3 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/90 bg-gradient-to-br from-[#4E7356] via-[#2E4733] to-[#1E3023] shadow-lg z-30 flex items-center justify-center pointer-events-none">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/60 bg-[#DE492A] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FAF6EE]" />
                    </div>
                  </div>

                  {/* Glass Outer Cylinder */}
                  <div className="w-28 sm:w-36 h-48 sm:h-64 rounded-b-2xl rounded-t-lg border-3 border-[#8A1521] bg-white/15 backdrop-blur-xs shadow-2xl relative overflow-hidden flex flex-col justify-end p-2.5">
                    
                    {/* Clear Glass Lip / Rim Reflection */}
                    <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-white/40 to-transparent border-b border-white/20 pointer-events-none" />

                    {/* Cold-Pressed Ruby Beet Juice Liquid Fill */}
                    <div
                      className={`relative w-full h-[85%] rounded-b-xl overflow-hidden bg-gradient-to-b from-[#F43F5E] via-[#BE123C] to-[#660C1D] shadow-inner flex flex-col justify-between p-2.5 ${
                        isClinking ? 'animate-liquid-slosh-r' : ''
                      }`}
                    >
                      {/* Juice Surface Ellipse Meniscus */}
                      <div className="absolute top-0 inset-x-0 h-3.5 bg-gradient-to-r from-[#FDA4AF] via-[#F43F5E] to-[#BE123C] rounded-full border-b border-white/30 shadow-xs" />

                      {/* Translucent Floating Ice Cubes */}
                      <div className="absolute top-5 right-3 w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-white/35 border border-white/60 shadow-inner rotate-12 backdrop-blur-xs pointer-events-none">
                        <div className="w-2 h-2 border-t border-r border-white/80 m-1" />
                      </div>
                      <div className="absolute top-12 left-3 w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-white/30 border border-white/50 shadow-inner -rotate-12 backdrop-blur-xs pointer-events-none">
                        <div className="w-1.5 h-1.5 border-t border-r border-white/80 m-1" />
                      </div>

                      {/* Natural Cold-Press Micro-Bubbles */}
                      <div className="absolute bottom-6 right-5 w-2 h-2 rounded-full bg-white/70 animate-bounce pointer-events-none" />
                      <div className="absolute bottom-12 left-6 w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse pointer-events-none" />
                      <div className="absolute bottom-20 right-7 w-1 h-1 rounded-full bg-white/80 pointer-events-none" />

                      {/* Glass Sheen / Reflection Streak */}
                      <div className="absolute top-0 right-2 w-2 h-full bg-white/35 rounded-full blur-[0.5px] pointer-events-none" />
                      <div className="absolute top-0 left-3 w-1 h-full bg-white/20 rounded-full pointer-events-none" />

                      {/* Juice Label Badge */}
                      <div className="mt-auto mx-auto px-2.5 py-0.5 rounded-md bg-white/25 text-white font-mono text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-center backdrop-blur-xs shadow-xs">
                        RUBY JUICE &bull; 2.2°C
                      </div>
                    </div>

                    {/* Heavy Glass Sham Bottom Base */}
                    <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-white/40 via-white/20 to-transparent border-t border-white/30 rounded-b-xl pointer-events-none" />
                  </div>

                  {/* Ruby Juice Splashes Erupting & Falling on Clink */}
                  {isClinking && (
                    <div key={`splash-r-${toastKey}`} className="pointer-events-none absolute inset-0 z-40 overflow-visible">
                      {/* Droplet 1: High arching ruby drop falling left */}
                      <div className="absolute -top-3 left-0 w-3.5 h-4 sm:w-4 sm:h-5 rounded-full bg-[#BE123C] border border-white/80 shadow-md animate-juice-splash-r1" />
                      
                      {/* Droplet 2: Higher arching ruby drop falling down */}
                      <div className="absolute -top-6 left-4 w-3 h-3.5 sm:w-3.5 sm:h-4 rounded-full bg-[#F43F5E] border border-white/70 shadow-sm animate-juice-splash-r2" />
                      
                      {/* Droplet 3: Wide spray ruby drop */}
                      <div className="absolute -top-2 left-8 w-2 h-2.5 sm:w-2.5 sm:h-3 rounded-full bg-[#881337] shadow-xs animate-juice-splash-r3" />

                      {/* Droplet 4: Tiny micro-droplet falling down */}
                      <div className="absolute -top-4 left-2 w-2 h-2 rounded-full bg-[#E11D48] animate-juice-splash-r1" style={{ animationDelay: '0.05s' }} />

                      {/* Juice Drip sliding down outer glass */}
                      <div className="absolute top-4 left-1 w-1.5 h-3 rounded-full bg-[#BE123C]/80 animate-pulse" />
                    </div>
                  )}
                </div>

              </div>

              {/* Toast Clink Celebration Juice Sparks & Cheers */}
              {isClinking && (
                <div key={`cheers-${toastKey}`} className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-50">
                  {/* Central colliding juice droplets */}
                  <div className="relative -top-16 flex items-center justify-center">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FBBF24] border border-white animate-ping absolute" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#F43F5E] border border-white animate-ping absolute" style={{ animationDelay: '0.1s' }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping absolute" style={{ animationDelay: '0.05s' }} />
                  </div>

                  <div className="bg-[#FAF6EE] text-[#8A1521] border-2 border-[#8A1521] px-4 py-1.5 rounded-full shadow-2xl font-display font-black text-xl sm:text-2xl tracking-tight -rotate-3 animate-in zoom-in-75 duration-200 flex items-center gap-2">
                    <span className="text-[#C8741B]">✦</span>
                    <span>CHEERS! 🥂</span>
                    <span className="text-[#C8741B]">✦</span>
                  </div>
                </div>
              )}

              {/* Interactive Prompt Badge below circle */}
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-[#8A1521] px-4 py-1.5 rounded-full border-2 border-[#8A1521] font-mono text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer" onClick={triggerToast}>
                <Sparkles className="w-3.5 h-3.5 text-[#C8741B]" />
                <span>TAP GLASSES TO TOAST 🥂</span>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Editorial Footnote */}
        <div className="mt-14 sm:mt-20 pt-8 border-t border-[#8A1521]/20 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#8A1521]/80 font-bold">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#C8741B] animate-ping" />
            <span>MUMBAI DISPENSARY NO. 01 &bull; 14TH ROAD, OFF WATERFIELD, BANDRA WEST</span>
          </div>
          <div className="flex items-center gap-6">
            <span>FSSAI LIC: 11524999000213</span>
            <span>HYDRAULIC COLD PRESSURE AT 2.2&deg;C</span>
          </div>
        </div>

      </div>

      {/* 4. Bottom Scalloped Awning Inverted Border */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none rotate-180">
        <svg
          viewBox="0 0 1440 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-5 sm:h-7 block fill-[#FAF6EE]"
          preserveAspectRatio="none"
        >
          <path d="M0,0 L0,2 C24,20 48,20 72,2 C96,20 120,20 144,2 C168,20 192,20 216,2 C240,20 264,20 288,2 C312,20 336,20 360,2 C384,20 408,20 432,2 C456,20 480,20 504,2 C528,20 552,20 576,2 C600,20 624,20 648,2 C672,20 696,20 720,2 C744,20 768,20 792,2 C816,20 840,20 864,2 C888,20 912,20 936,2 C960,20 984,20 1008,2 C1032,20 1056,20 1080,2 C1104,20 1128,20 1152,2 C1176,20 1200,20 1224,2 C1248,20 1272,20 1296,2 C1320,20 1344,20 1368,2 C1392,20 1416,20 1440,2 L1440,0 Z" />
        </svg>
      </div>
    </section>
  );
};
