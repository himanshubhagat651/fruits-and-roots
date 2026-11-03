import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { playPopSound, playChimeSound } from '../utils/audio';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0); // 0.00 to 1.00
  const [walkFrame, setWalkFrame] = useState(0); // 0, 1 alternating push stride
  const [isFinishing, setIsFinishing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentVal = 0;
    let stepCount = 0;

    // Smooth progressive counter from 0.00 to 1.00
    const interval = setInterval(() => {
      // Natural variable speed: quick start, steady effort, strong finish
      const increment = currentVal < 0.25 ? 0.022 : currentVal < 0.7 ? 0.015 : 0.024;
      currentVal = Math.min(1.0, currentVal + increment);
      setProgress(currentVal);

      stepCount++;
      if (stepCount % 3 === 0) {
        setWalkFrame((prev) => (prev === 0 ? 1 : 0));
        if (Math.random() > 0.65) {
          playPopSound();
        }
      }

      if (currentVal >= 1.0) {
        clearInterval(interval);
        setIsFinishing(true);
        playChimeSound();

        // Hold the completed 1.00 pose briefly (as seen in huyml.co screenshot),
        // then sweep the curtain fully open and fade out
        setTimeout(() => {
          if (!containerRef.current || !curtainRef.current || !characterRef.current) {
            onComplete();
            return;
          }

          const tl = gsap.timeline({
            onComplete: () => {
              onComplete();
            },
          });

          // Final heroic push: character drives curtain all the way off the right screen edge
          tl.to(
            curtainRef.current,
            {
              left: '105%',
              duration: 0.55,
              ease: 'power3.in',
            },
            0
          );

          tl.to(
            characterRef.current,
            {
              right: '-5%',
              duration: 0.55,
              ease: 'power3.in',
            },
            0
          );

          // Fade out the entire preloader canvas into the main site
          tl.to(
            containerRef.current,
            {
              opacity: 0,
              duration: 0.45,
              ease: 'power2.inOut',
            },
            0.35
          );
        }, 320);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Curtain split position:
  // Starts at ~16% (character enters from left) and pushes to 63% at 1.00 (matching exact huyml.co reference screenshot)
  const curtainPercent = isFinishing ? 63 : Math.min(63, 16 + progress * 47);

  // Allow clicking anywhere to skip if the user wishes
  const handleSkip = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.35,
        onComplete,
      });
    } else {
      onComplete();
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleSkip}
      className="fixed inset-0 z-50 overflow-hidden select-none bg-white font-sans cursor-pointer pointer-events-auto"
      title="Click anywhere to skip intro"
    >
      {/* ------------------------------------------------------------------- */}
      {/* 1. Top Left Minimalist Counter Pill (Exact Huyml.co 1.00 Badge)     */}
      {/* ------------------------------------------------------------------- */}
      <div className="fixed top-5 left-5 z-40">
        <div className="bg-black text-white font-mono text-xs font-semibold px-2.5 py-1 rounded shadow-sm select-none tracking-tight">
          {progress.toFixed(2)}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. White Underlayer with Giant Red Brand Typography                 */}
      {/* ------------------------------------------------------------------- */}
      <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-4 text-center z-10 pointer-events-none">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center">
          {/* Monumental Red Serif Display Typography matching Huy Phan's HUY PHAN */}
          <h1 className="font-serif font-black text-[#DE492A] uppercase tracking-[-0.035em] leading-[0.84] text-[20vw] sm:text-[15vw] md:text-[13vw] lg:text-[11.5vw]">
            <span className="block">FRUITS</span>
            <span className="block text-[#DE492A]">&amp; ROOTS</span>
          </h1>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Solid Black Sliding Curtain (Right Half of Viewport)             */}
      {/* ------------------------------------------------------------------- */}
      <div
        ref={curtainRef}
        className="absolute top-0 bottom-0 right-0 bg-black z-20 will-change-[left,width]"
        style={{
          left: `${curtainPercent}%`,
          width: `${Math.max(0, 100 - curtainPercent)}%`,
        }}
      />

      {/* ------------------------------------------------------------------- */}
      {/* 4. The Hand-Crafted Pushing Character (Direct huyml.co Homage)      */}
      {/* Pin-locked to the curtain's left edge using right: calc(100% - X%) */}
      {/* ------------------------------------------------------------------- */}
      <div
        ref={characterRef}
        className="absolute top-1/2 -translate-y-[45%] z-30 pointer-events-none will-change-transform w-[190px] sm:w-[230px] md:w-[260px]"
        style={{
          right: `calc(100% - ${curtainPercent}%)`,
        }}
      >
        <svg
          viewBox="0 0 240 320"
          className="w-full h-auto drop-shadow-xl"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Subtle Ground Contact Shadow */}
          <ellipse
            cx="115"
            cy="312"
            rx="75"
            ry="6"
            fill="rgba(0, 0, 0, 0.18)"
          />

          {/* Sweat Droplet flying from forehead (strenuous effort) */}
          <g className="animate-pulse">
            <path
              d="M 126 62 Q 116 56 112 64 Q 120 68 126 62 Z"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="2"
            />
            {/* Small motion lines */}
            <line x1="108" y1="60" x2="102" y2="56" stroke="#000000" strokeWidth="2" />
            <line x1="104" y1="68" x2="98" y2="68" stroke="#000000" strokeWidth="2" />
          </g>

          {/* ----------------------------------------------------------------- */}
          {/* Back Leg (Alternating stride in push cycle)                       */}
          {/* ----------------------------------------------------------------- */}
          {walkFrame === 0 ? (
            // Pose A: Back leg driving back with heel up and toes digging in
            <g>
              {/* Thigh */}
              <path d="M 102 195 L 68 238" stroke="#000000" strokeWidth="13" />
              {/* Calf */}
              <path d="M 68 238 L 44 282" stroke="#000000" strokeWidth="12" />
              {/* Crew Sock with Red Stripes */}
              <rect x="36" y="270" width="14" height="15" rx="2" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
              <line x1="36" y1="274" x2="50" y2="274" stroke="#DE492A" strokeWidth="2.5" />
              <line x1="36" y1="279" x2="50" y2="279" stroke="#DE492A" strokeWidth="2.5" />
              {/* Sneaker (Heel up, toe bent firmly on ground) */}
              <g transform="translate(24, 274) rotate(24)">
                <path
                  d="M 2 18 L 14 6 L 38 6 L 44 18 L 42 23 L 2 23 Z"
                  fill="#FFFFFF"
                  stroke="#000000"
                  strokeWidth="2.5"
                />
                <rect x="0" y="20" width="46" height="4.5" rx="1.5" fill="#000000" />
                {/* Nike-style swoosh */}
                <path d="M 14 14 Q 26 18 36 9" stroke="#000000" strokeWidth="3" fill="none" />
                <path d="M 38 6 Q 46 14 42 23" fill="#E5E5E5" stroke="#000000" strokeWidth="2" />
              </g>
            </g>
          ) : (
            // Pose B: Back leg stepping forward
            <g>
              <path d="M 102 195 L 86 242" stroke="#000000" strokeWidth="13" />
              <path d="M 86 242 L 82 284" stroke="#000000" strokeWidth="12" />
              <rect x="75" y="272" width="14" height="15" rx="2" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
              <line x1="75" y1="276" x2="89" y2="276" stroke="#DE492A" strokeWidth="2.5" />
              <line x1="75" y1="281" x2="89" y2="281" stroke="#DE492A" strokeWidth="2.5" />
              <g transform="translate(70, 285)">
                <path
                  d="M 2 16 L 14 6 L 38 6 L 44 16 L 42 21 L 2 21 Z"
                  fill="#FFFFFF"
                  stroke="#000000"
                  strokeWidth="2.5"
                />
                <rect x="0" y="19" width="46" height="4.5" rx="1.5" fill="#000000" />
                <path d="M 14 13 Q 26 16 36 8" stroke="#000000" strokeWidth="3" fill="none" />
              </g>
            </g>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* Front Leg (Planted firmly forward)                                */}
          {/* ----------------------------------------------------------------- */}
          {walkFrame === 0 ? (
            // Pose A: Front foot planted forward
            <g>
              <path d="M 125 195 L 152 238" stroke="#000000" strokeWidth="14" />
              <path d="M 152 238 L 148 285" stroke="#000000" strokeWidth="13" />
              <rect x="141" y="272" width="15" height="15" rx="2" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
              <line x1="141" y1="276" x2="156" y2="276" stroke="#DE492A" strokeWidth="2.5" />
              <line x1="141" y1="281" x2="156" y2="281" stroke="#DE492A" strokeWidth="2.5" />
              {/* Planted Sneaker */}
              <g transform="translate(134, 285)">
                <path
                  d="M 2 16 L 14 6 L 40 6 L 46 16 L 44 21 L 2 21 Z"
                  fill="#FFFFFF"
                  stroke="#000000"
                  strokeWidth="2.5"
                />
                <rect x="0" y="19" width="48" height="4.5" rx="1.5" fill="#000000" />
                <path d="M 14 13 Q 26 16 38 8" stroke="#000000" strokeWidth="3" fill="none" />
                <path d="M 40 6 Q 48 14 44 21" fill="#E5E5E5" stroke="#000000" strokeWidth="2" />
              </g>
            </g>
          ) : (
            // Pose B: Front leg driving backward
            <g>
              <path d="M 125 195 L 105 238" stroke="#000000" strokeWidth="14" />
              <path d="M 105 238 L 76 282" stroke="#000000" strokeWidth="13" />
              <rect x="68" y="270" width="15" height="15" rx="2" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
              <line x1="68" y1="274" x2="83" y2="274" stroke="#DE492A" strokeWidth="2.5" />
              <line x1="68" y1="279" x2="83" y2="279" stroke="#DE492A" strokeWidth="2.5" />
              <g transform="translate(56, 274) rotate(24)">
                <path
                  d="M 2 18 L 14 6 L 38 6 L 44 18 L 42 23 L 2 23 Z"
                  fill="#FFFFFF"
                  stroke="#000000"
                  strokeWidth="2.5"
                />
                <rect x="0" y="20" width="46" height="4.5" rx="1.5" fill="#000000" />
                <path d="M 14 14 Q 26 18 36 9" stroke="#000000" strokeWidth="3" fill="none" />
              </g>
            </g>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* Shorts (White casual athletic shorts)                             */}
          {/* ----------------------------------------------------------------- */}
          <path
            d="M 92 180 L 142 180 L 152 208 L 124 208 L 118 196 L 110 208 L 84 208 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="3.2"
          />
          {/* Seam line */}
          <line x1="118" y1="180" x2="118" y2="196" stroke="#000000" strokeWidth="2" />

          {/* ----------------------------------------------------------------- */}
          {/* Torso & Floral Pattern Shirt (Leaning forward with strain)        */}
          {/* ----------------------------------------------------------------- */}
          <g>
            <path
              d="M 88 102 L 146 112 L 152 184 L 90 180 Z"
              fill="#6B7280"
              stroke="#000000"
              strokeWidth="3.5"
            />
            {/* White 5-petal floral botanical blossoms (Matching Huy's shirt) */}
            <circle cx="104" cy="126" r="4" fill="#FFFFFF" />
            <circle cx="132" cy="136" r="4.5" fill="#FFFFFF" />
            <circle cx="112" cy="158" r="4" fill="#FFFFFF" />
            <circle cx="98" cy="168" r="3.5" fill="#FFFFFF" />
            <circle cx="138" cy="164" r="4" fill="#FFFFFF" />
            {/* Small leaf outlines */}
            <path d="M 104 126 Q 98 120 100 116" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
            <path d="M 132 136 Q 138 130 142 131" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
            <path d="M 112 158 Q 118 152 120 154" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
          </g>

          {/* ----------------------------------------------------------------- */}
          {/* Far Arm (Right Arm reaching out to curtain line at X = 240)        */}
          {/* ----------------------------------------------------------------- */}
          {/* Far Sleeve */}
          <path
            d="M 136 110 L 166 126 L 156 144 L 132 128 Z"
            fill="#4B5563"
            stroke="#000000"
            strokeWidth="3"
          />
          {/* Far Arm Path */}
          <path d="M 158 132 L 202 142 L 235 146" stroke="#000000" strokeWidth="10" />
          {/* Far Hand flat against X = 240 */}
          <path
            d="M 234 132 L 240 132 L 240 158 L 234 158 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="2.5"
          />

          {/* ----------------------------------------------------------------- */}
          {/* Near Arm (Left Arm bent, wristwatch on wrist, pushing X = 240)    */}
          {/* ----------------------------------------------------------------- */}
          {/* Near Sleeve */}
          <path
            d="M 120 110 L 156 124 L 148 146 L 115 130 Z"
            fill="#6B7280"
            stroke="#000000"
            strokeWidth="3.5"
          />
          {/* Forearm driving forward */}
          <path
            d="M 148 134 L 194 150 L 228 155"
            stroke="#000000"
            strokeWidth="12"
          />

          {/* Wristwatch on Left Wrist (Distinct Huy Phan Detail) */}
          <g>
            {/* Watch strap */}
            <rect x="220" y="148" width="7" height="15" rx="1.5" fill="#171412" stroke="#000000" strokeWidth="1.5" />
            {/* Watch face dial */}
            <circle cx="223.5" cy="155.5" r="4.5" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
            <line x1="223.5" y1="155.5" x2="225" y2="153" stroke="#000000" strokeWidth="1.5" />
          </g>

          {/* Near Hand flat on vertical curtain line (Exact touch at X = 240) */}
          <g>
            {/* Palm */}
            <rect
              x="233"
              y="140"
              width="7"
              height="35"
              rx="3"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="3"
            />
            {/* Finger notches pressed firmly against wall */}
            <line x1="233" y1="149" x2="240" y2="149" stroke="#000000" strokeWidth="2.2" />
            <line x1="233" y1="158" x2="240" y2="158" stroke="#000000" strokeWidth="2.2" />
            <line x1="233" y1="167" x2="240" y2="167" stroke="#000000" strokeWidth="2.2" />
          </g>

          {/* ----------------------------------------------------------------- */}
          {/* Head, Face, Glasses & Backward Baseball Cap                       */}
          {/* ----------------------------------------------------------------- */}
          {/* Neck */}
          <path d="M 116 92 L 130 106" stroke="#000000" strokeWidth="11" />

          {/* Head & Face Contour (Profile facing right) */}
          <path
            d="M 114 72 Q 124 52 144 58 Q 156 64 154 80 Q 162 84 158 90 Q 152 94 150 100 Q 138 106 124 100 Q 114 96 114 72 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="3"
          />

          {/* Ear */}
          <circle cx="128" cy="80" r="5.5" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />

          {/* Square Eyeglasses */}
          <rect
            x="142"
            y="72"
            width="13"
            height="12"
            rx="2.5"
            fill="none"
            stroke="#000000"
            strokeWidth="2.5"
          />
          {/* Glasses temple to ear */}
          <line x1="128" y1="78" x2="142" y2="76" stroke="#000000" strokeWidth="2.5" />
          {/* Focused Pupil */}
          <circle cx="150" cy="78" r="2.2" fill="#000000" />

          {/* Strained Concentrated Mouth (wavy '3' shape) */}
          <path d="M 148 92 Q 153 94 151 97" stroke="#000000" strokeWidth="2.5" fill="none" />

          {/* Backward Baseball Cap (Crown + Backward Brim pointing left) */}
          {/* Cap Crown */}
          <path
            d="M 116 68 Q 124 46 148 52 Q 154 62 150 70 Q 134 65 116 68 Z"
            fill="#171412"
            stroke="#000000"
            strokeWidth="3"
          />
          {/* Backward Brim projecting left */}
          <path
            d="M 120 64 Q 98 56 90 64 Q 106 72 122 69 Z"
            fill="#171412"
            stroke="#000000"
            strokeWidth="2.5"
          />
          {/* Cap top button */}
          <circle cx="138" cy="48" r="3" fill="#171412" stroke="#000000" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
};
