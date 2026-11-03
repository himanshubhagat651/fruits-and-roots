import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { playChimeSound } from '../utils/audio';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const poseARef = useRef<SVGGElement>(null);
  const poseBRef = useRef<SVGGElement>(null);
  const torsoRef = useRef<SVGGElement>(null);
  const masterTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const slider = sliderRef.current;
    if (!container || !slider) return;

    const w = window.innerWidth;
    const isMobile = w < 640;
    const charWidth = isMobile ? 190 : 250;

    // Contact line geometry:
    // Starts at ~18% across viewport, pushes to ~63% at 1.00 (matching exact huyml.co screenshot)
    const startX = Math.max(0, 0.18 * w - charWidth);
    const midX = Math.max(0, 0.63 * w - charWidth);
    const endX = w + 80;

    // Set initial position via hardware-accelerated transform
    gsap.set(slider, {
      x: startX,
      force3D: true,
    });

    let lastStrideTime = 0;
    let currentPose = 0;

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });
    masterTimelineRef.current = tl;

    // -----------------------------------------------------------------------
    // Stage 1: Silky-smooth GPU transform push from startX to midX
    // Synchronized with counter going from 0.00 to 1.00
    // -----------------------------------------------------------------------
    tl.to(slider, {
      x: midX,
      duration: 2.1,
      ease: 'power1.inOut',
      force3D: true,
      onUpdate: function () {
        // High-performance stride toggle on SVG groups (zero reflow)
        const now = Date.now();
        if (now - lastStrideTime > 155) {
          lastStrideTime = now;
          currentPose = currentPose === 0 ? 1 : 0;

          if (poseARef.current && poseBRef.current) {
            poseARef.current.style.display = currentPose === 0 ? 'block' : 'none';
            poseBRef.current.style.display = currentPose === 1 ? 'block' : 'none';
          }
          if (torsoRef.current) {
            torsoRef.current.style.transform = `translateY(${currentPose === 0 ? 0 : 2.5}px)`;
          }
        }
      },
    });

    // -----------------------------------------------------------------------
    // Stage 2: Brief triumphant hold at 1.00 (matches huyml.co pose hold)
    // -----------------------------------------------------------------------
    tl.to({}, { duration: 0.22 });

    // -----------------------------------------------------------------------
    // Stage 3: Final sweep offscreen + container fade out
    // -----------------------------------------------------------------------
    tl.to(
      slider,
      {
        x: endX,
        duration: 0.48,
        ease: 'power2.in',
        force3D: true,
        onStart: () => {
          playChimeSound();
        },
      },
      '+=0.05'
    );

    tl.to(
      container,
      {
        opacity: 0,
        duration: 0.38,
        ease: 'power2.inOut',
      },
      '-=0.25'
    );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  // Click anywhere to instantly skip with smooth fade
  const handleSkip = () => {
    if (masterTimelineRef.current) {
      masterTimelineRef.current.kill();
    }
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.inOut',
        onComplete,
      });
    } else {
      onComplete();
    }
  };

  const charWidth = typeof window !== 'undefined' && window.innerWidth < 640 ? 190 : 250;

  return (
    <div
      id="huyml-preloader"
      ref={containerRef}
      onClick={handleSkip}
      className="fixed inset-0 z-[99999] overflow-hidden select-none bg-white font-sans cursor-pointer pointer-events-auto"
      title="Click anywhere to skip intro"
    >
      {/* ------------------------------------------------------------------- */}
      {/* White Underlayer with Giant Red Brand Typography                    */}
      {/* ------------------------------------------------------------------- */}
      <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-4 text-center z-10 pointer-events-none">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center">
          <h1 className="font-serif font-black text-[#DE492A] uppercase tracking-[-0.035em] leading-[0.84] text-[20vw] sm:text-[15vw] md:text-[13vw] lg:text-[11.5vw]">
            <span className="block">FRUITS</span>
            <span className="block text-[#DE492A]">&amp; ROOTS</span>
          </h1>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Unified GPU Slider: Character Box + Solid Black Curtain          */}
      {/* Moves as a single composited layer with ZERO layout reflow          */}
      {/* ------------------------------------------------------------------- */}
      <div
        ref={sliderRef}
        className="absolute inset-y-0 flex pointer-events-none will-change-transform z-20"
        style={{
          left: 0,
          width: '240vw',
          transform: 'translate3d(0, 0, 0)',
        }}
      >
        {/* Character container: hands touch the right boundary with 100% precision */}
        <div
          className="relative shrink-0 flex items-center justify-end"
          style={{
            width: `${charWidth}px`,
            height: '100%',
          }}
        >
          <div className="w-[190px] sm:w-[230px] md:w-[250px]">
            <svg
              viewBox="0 0 240 320"
              className="w-full h-auto drop-shadow-xl"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Subtle Ground Contact Shadow */}
              <ellipse cx="115" cy="312" rx="75" ry="6" fill="rgba(0, 0, 0, 0.18)" />

              {/* Upper Body Group with subtle walking cadence bob */}
              <g ref={torsoRef} className="will-change-transform">
                {/* Sweat Droplet flying from forehead */}
                <g className="animate-pulse">
                  <path
                    d="M 126 62 Q 116 56 112 64 Q 120 68 126 62 Z"
                    fill="#FFFFFF"
                    stroke="#000000"
                    strokeWidth="2"
                  />
                  <line x1="108" y1="60" x2="102" y2="56" stroke="#000000" strokeWidth="2" />
                  <line x1="104" y1="68" x2="98" y2="68" stroke="#000000" strokeWidth="2" />
                </g>

                {/* Shorts */}
                <path
                  d="M 92 180 L 142 180 L 152 208 L 124 208 L 118 196 L 110 208 L 84 208 Z"
                  fill="#FFFFFF"
                  stroke="#000000"
                  strokeWidth="3.2"
                />
                <line x1="118" y1="180" x2="118" y2="196" stroke="#000000" strokeWidth="2" />

                {/* Torso & Floral Pattern Shirt */}
                <g>
                  <path
                    d="M 88 102 L 146 112 L 152 184 L 90 180 Z"
                    fill="#6B7280"
                    stroke="#000000"
                    strokeWidth="3.5"
                  />
                  <circle cx="104" cy="126" r="4" fill="#FFFFFF" />
                  <circle cx="132" cy="136" r="4.5" fill="#FFFFFF" />
                  <circle cx="112" cy="158" r="4" fill="#FFFFFF" />
                  <circle cx="98" cy="168" r="3.5" fill="#FFFFFF" />
                  <circle cx="138" cy="164" r="4" fill="#FFFFFF" />
                  <path d="M 104 126 Q 98 120 100 116" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
                  <path d="M 132 136 Q 138 130 142 131" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
                  <path d="M 112 158 Q 118 152 120 154" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
                </g>

                {/* Far Arm reaching to touch curtain line at X = 240 */}
                <path d="M 136 110 L 166 126 L 156 144 L 132 128 Z" fill="#4B5563" stroke="#000000" strokeWidth="3" />
                <path d="M 158 132 L 202 142 L 235 146" stroke="#000000" strokeWidth="10" />
                <path d="M 234 132 L 240 132 L 240 158 L 234 158 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />

                {/* Near Arm bent forward */}
                <path d="M 120 110 L 156 124 L 148 146 L 115 130 Z" fill="#6B7280" stroke="#000000" strokeWidth="3.5" />
                <path d="M 148 134 L 194 150 L 228 155" stroke="#000000" strokeWidth="12" />

                {/* Round Wristwatch on Left Wrist */}
                <g>
                  <rect x="220" y="148" width="7" height="15" rx="1.5" fill="#171412" stroke="#000000" strokeWidth="1.5" />
                  <circle cx="223.5" cy="155.5" r="4.5" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
                  <line x1="223.5" y1="155.5" x2="225" y2="153" stroke="#000000" strokeWidth="1.5" />
                </g>

                {/* Near Hand flat on vertical curtain line at X = 240 */}
                <g>
                  <rect x="233" y="140" width="7" height="35" rx="3" fill="#FFFFFF" stroke="#000000" strokeWidth="3" />
                  <line x1="233" y1="149" x2="240" y2="149" stroke="#000000" strokeWidth="2.2" />
                  <line x1="233" y1="158" x2="240" y2="158" stroke="#000000" strokeWidth="2.2" />
                  <line x1="233" y1="167" x2="240" y2="167" stroke="#000000" strokeWidth="2.2" />
                </g>

                {/* Head, Glasses & Backward Baseball Cap */}
                <path d="M 116 92 L 130 106" stroke="#000000" strokeWidth="11" />
                <path
                  d="M 114 72 Q 124 52 144 58 Q 156 64 154 80 Q 162 84 158 90 Q 152 94 150 100 Q 138 106 124 100 Q 114 96 114 72 Z"
                  fill="#FFFFFF"
                  stroke="#000000"
                  strokeWidth="3"
                />
                <circle cx="128" cy="80" r="5.5" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
                <rect x="142" y="72" width="13" height="12" rx="2.5" fill="none" stroke="#000000" strokeWidth="2.5" />
                <line x1="128" y1="78" x2="142" y2="76" stroke="#000000" strokeWidth="2.5" />
                <circle cx="150" cy="78" r="2.2" fill="#000000" />
                <path d="M 148 92 Q 153 94 151 97" stroke="#000000" strokeWidth="2.5" fill="none" />
                <path d="M 116 68 Q 124 46 148 52 Q 154 62 150 70 Q 134 65 116 68 Z" fill="#171412" stroke="#000000" strokeWidth="3" />
                <path d="M 120 64 Q 98 56 90 64 Q 106 72 122 69 Z" fill="#171412" stroke="#000000" strokeWidth="2.5" />
                <circle cx="138" cy="48" r="3" fill="#171412" stroke="#000000" strokeWidth="2" />
              </g>

              {/* Legs: Pose A */}
              <g ref={poseARef}>
                {/* Back Leg driving back */}
                <path d="M 102 195 L 68 238" stroke="#000000" strokeWidth="13" />
                <path d="M 68 238 L 44 282" stroke="#000000" strokeWidth="12" />
                <rect x="36" y="270" width="14" height="15" rx="2" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
                <line x1="36" y1="274" x2="50" y2="274" stroke="#DE492A" strokeWidth="2.5" />
                <line x1="36" y1="279" x2="50" y2="279" stroke="#DE492A" strokeWidth="2.5" />
                <g transform="translate(24, 274) rotate(24)">
                  <path d="M 2 18 L 14 6 L 38 6 L 44 18 L 42 23 L 2 23 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
                  <rect x="0" y="20" width="46" height="4.5" rx="1.5" fill="#000000" />
                  <path d="M 14 14 Q 26 18 36 9" stroke="#000000" strokeWidth="3" fill="none" />
                  <path d="M 38 6 Q 46 14 42 23" fill="#E5E5E5" stroke="#000000" strokeWidth="2" />
                </g>

                {/* Front Leg planted forward */}
                <path d="M 125 195 L 152 238" stroke="#000000" strokeWidth="14" />
                <path d="M 152 238 L 148 285" stroke="#000000" strokeWidth="13" />
                <rect x="141" y="272" width="15" height="15" rx="2" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
                <line x1="141" y1="276" x2="156" y2="276" stroke="#DE492A" strokeWidth="2.5" />
                <line x1="141" y1="281" x2="156" y2="281" stroke="#DE492A" strokeWidth="2.5" />
                <g transform="translate(134, 285)">
                  <path d="M 2 16 L 14 6 L 40 6 L 46 16 L 44 21 L 2 21 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
                  <rect x="0" y="19" width="48" height="4.5" rx="1.5" fill="#000000" />
                  <path d="M 14 13 Q 26 16 38 8" stroke="#000000" strokeWidth="3" fill="none" />
                  <path d="M 40 6 Q 48 14 44 21" fill="#E5E5E5" stroke="#000000" strokeWidth="2" />
                </g>
              </g>

              {/* Legs: Pose B */}
              <g ref={poseBRef} style={{ display: 'none' }}>
                {/* Back Leg stepping forward */}
                <path d="M 102 195 L 86 242" stroke="#000000" strokeWidth="13" />
                <path d="M 86 242 L 82 284" stroke="#000000" strokeWidth="12" />
                <rect x="75" y="272" width="14" height="15" rx="2" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
                <line x1="75" y1="276" x2="89" y2="276" stroke="#DE492A" strokeWidth="2.5" />
                <line x1="75" y1="281" x2="89" y2="281" stroke="#DE492A" strokeWidth="2.5" />
                <g transform="translate(70, 285)">
                  <path d="M 2 16 L 14 6 L 38 6 L 44 16 L 42 21 L 2 21 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
                  <rect x="0" y="19" width="46" height="4.5" rx="1.5" fill="#000000" />
                  <path d="M 14 13 Q 26 16 36 8" stroke="#000000" strokeWidth="3" fill="none" />
                </g>

                {/* Front Leg driving back */}
                <path d="M 125 195 L 105 238" stroke="#000000" strokeWidth="14" />
                <path d="M 105 238 L 76 282" stroke="#000000" strokeWidth="13" />
                <rect x="68" y="270" width="15" height="15" rx="2" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
                <line x1="68" y1="274" x2="83" y2="274" stroke="#DE492A" strokeWidth="2.5" />
                <line x1="68" y1="279" x2="83" y2="279" stroke="#DE492A" strokeWidth="2.5" />
                <g transform="translate(56, 274) rotate(24)">
                  <path d="M 2 18 L 14 6 L 38 6 L 44 18 L 42 23 L 2 23 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
                  <rect x="0" y="20" width="46" height="4.5" rx="1.5" fill="#000000" />
                  <path d="M 14 14 Q 26 18 36 9" stroke="#000000" strokeWidth="3" fill="none" />
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* Solid Pure Pitch Black Curtain */}
        <div className="flex-1 bg-black h-full" />
      </div>
    </div>
  );
};
