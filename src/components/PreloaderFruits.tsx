import React from 'react';

export type PreloaderFruitType =
  // Red
  | 'red-pomegranate'
  | 'pomegranate-arils'
  | 'beet-wheel'
  | 'red-apple'
  | 'strawberry'
  // Orange
  | 'orange-slice'
  | 'orange-wedge'
  | 'whole-orange'
  | 'turmeric-root'
  | 'carrot-wheel'
  // Yellow
  | 'lemon-wheel'
  | 'pineapple-slice'
  | 'lemon-wedge'
  | 'golden-turmeric'
  | 'banana-slice'
  // Cream / Green / Botanical
  | 'green-apple'
  | 'cucumber-wheel'
  | 'mint-leaf'
  | 'coconut-half'
  | 'celery-stalk'
  // Dark / Obsidian
  | 'blackberry'
  | 'dark-grapes'
  | 'purple-plum'
  | 'blueberries'
  | 'dark-leaf';

interface FruitSvgProps {
  type: PreloaderFruitType;
  size?: number;
}

export const PreloaderFruitSvg: React.FC<FruitSvgProps> = ({ type, size = 64 }) => {
  const uid = React.useId().replace(/:/g, '');

  switch (type) {
    // ----------------------------------------------------
    // 1. RED FRUITS (Strip 1)
    // ----------------------------------------------------
    case 'red-pomegranate':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <defs>
            <radialGradient id={`pom-body-${uid}`} cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="40%" stopColor="#E11D48" />
              <stop offset="85%" stopColor="#9F1239" />
              <stop offset="100%" stopColor="#4C0519" />
            </radialGradient>
          </defs>
          {/* Calyx Crown */}
          <path d="M42,16 L46,6 L50,14 L54,6 L58,16 Z" fill="#9F1239" stroke="#4C0519" strokeWidth="1.5" />
          {/* Pomegranate Body */}
          <circle cx="50" cy="54" r="38" fill={`url(#pom-body-${uid})`} stroke="#4C0519" strokeWidth="2.5" />
          {/* Cut Window Revealing Glistening Seeds */}
          <path d="M36,46 C36,38 48,34 58,40 C66,46 64,62 54,66 C42,70 36,58 36,46 Z" fill="#4C0519" />
          <path d="M38,48 C38,40 48,36 56,42 C64,48 62,60 52,64 C44,68 38,58 38,48 Z" fill="#881337" />
          {/* Seeds */}
          {[
            [44, 46], [50, 44], [54, 50], [46, 52], [42, 58], [48, 60], [54, 58]
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill="#F43F5E" stroke="#FFE4E6" strokeWidth="0.8" />
          ))}
          {/* Glossy Sheen */}
          <ellipse cx="32" cy="36" rx="9" ry="5" fill="white" fillOpacity="0.45" transform="rotate(-30 32 36)" />
        </svg>
      );

    case 'pomegranate-arils':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <defs>
            <linearGradient id={`aril-grad-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="60%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>
          </defs>
          <path d="M30,32 C18,44 22,64 36,66 C48,68 54,52 46,36 C40,26 34,26 30,32 Z" fill={`url(#aril-grad-${uid})`} stroke="#4C0519" strokeWidth="2" />
          <circle cx="34" cy="44" r="3" fill="white" fillOpacity="0.85" />
          <path d="M54,42 C44,52 48,72 62,74 C72,76 80,62 74,46 C68,36 60,36 54,42 Z" fill={`url(#aril-grad-${uid})`} stroke="#4C0519" strokeWidth="2" />
          <circle cx="60" cy="54" r="3" fill="white" fillOpacity="0.85" />
          <path d="M46,18 C38,26 42,42 52,44 C60,46 66,34 60,22 C56,14 50,12 46,18 Z" fill={`url(#aril-grad-${uid})`} stroke="#4C0519" strokeWidth="1.8" />
          <circle cx="50" cy="26" r="2.5" fill="white" fillOpacity="0.85" />
        </svg>
      );

    case 'beet-wheel':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <defs>
            <linearGradient id={`beet-grad-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E11D48" />
              <stop offset="50%" stopColor="#BE123C" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill="#4C0519" stroke="#881337" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="41" fill={`url(#beet-grad-${uid})`} />
          <circle cx="50" cy="50" r="34" stroke="#FDA4AF" strokeWidth="2.5" fill="#9F1239" strokeDasharray="6 3" strokeOpacity="0.85" />
          <circle cx="50" cy="50" r="25" stroke="#FECDD3" strokeWidth="2" fill="#BE123C" strokeDasharray="4 2" strokeOpacity="0.75" />
          <circle cx="50" cy="50" r="16" stroke="#FDA4AF" strokeWidth="2.5" fill="#E11D48" strokeOpacity="0.9" />
          <circle cx="50" cy="50" r="7" fill="#FDA4AF" />
          <ellipse cx="38" cy="36" rx="14" ry="6" fill="white" fillOpacity="0.3" transform="rotate(-25 38 36)" />
        </svg>
      );

    case 'red-apple':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <defs>
            <radialGradient id={`apple-red-${uid}`} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#F87171" />
              <stop offset="40%" stopColor="#EF4444" />
              <stop offset="85%" stopColor="#B91C1C" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </radialGradient>
          </defs>
          {/* Stem & Leaf */}
          <path d="M50,22 Q52,10 60,8" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <path d="M52,14 Q66,12 68,22 Q56,22 52,14 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1" />
          {/* Apple Heart Silhouette */}
          <path
            d="M50,26 C42,16 22,18 16,34 C10,50 20,74 44,88 C48,90 52,90 56,88 C80,74 90,50 84,34 C78,18 58,16 50,26 Z"
            fill={`url(#apple-red-${uid})`}
            stroke="#7F1D1D"
            strokeWidth="2.5"
          />
          <ellipse cx="32" cy="40" rx="9" ry="16" fill="white" fillOpacity="0.4" transform="rotate(-25 32 40)" />
        </svg>
      );

    case 'strawberry':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <defs>
            <radialGradient id={`straw-red-${uid}`} cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="50%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#9F1239" />
            </radialGradient>
          </defs>
          {/* Berry Body */}
          <path
            d="M50,90 C34,74 20,54 20,38 C20,24 34,22 50,26 C66,22 80,24 80,38 C80,54 66,74 50,90 Z"
            fill={`url(#straw-red-${uid})`}
            stroke="#881337"
            strokeWidth="2"
          />
          {/* Yellow Achene Seeds */}
          {[
            [35, 38], [50, 36], [65, 38],
            [30, 50], [44, 48], [58, 48], [70, 50],
            [38, 62], [50, 60], [62, 62],
            [44, 74], [56, 74]
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.5" />
          ))}
          {/* Leafy Calyx Cap */}
          <path d="M50,26 L42,16 L50,20 L58,16 Z" fill="#15803D" />
          <path d="M36,26 L26,18 L34,24 Z" fill="#16A34A" />
          <path d="M64,26 L74,18 L66,24 Z" fill="#16A34A" />
        </svg>
      );

    // ----------------------------------------------------
    // 2. ORANGE FRUITS (Strip 2)
    // ----------------------------------------------------
    case 'orange-slice':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <defs>
            <linearGradient id={`rind-orange-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id={`pulp-orange-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill={`url(#rind-orange-${uid})`} stroke="#B45309" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="40" fill="#FFFBEB" />
          <circle cx="50" cy="50" r="36" fill="#F59E0B" fillOpacity="0.25" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => {
            const rad = (ang * Math.PI) / 180;
            const radNext = ((ang + 38) * Math.PI) / 180;
            const rIn = 6;
            const rOut = 36;
            const x1 = 50 + rIn * Math.cos(rad);
            const y1 = 50 + rIn * Math.sin(rad);
            const x2 = 50 + rOut * Math.cos(rad);
            const y2 = 50 + rOut * Math.sin(rad);
            const x3 = 50 + rOut * Math.cos(radNext);
            const y3 = 50 + rOut * Math.sin(radNext);
            const x4 = 50 + rIn * Math.cos(radNext);
            const y4 = 50 + rIn * Math.sin(radNext);
            return (
              <path
                key={ang}
                d={`M ${x1} ${y1} L ${x2} ${y2} A ${rOut} ${rOut} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${rIn} ${rIn} 0 0 0 ${x1} ${y1} Z`}
                fill={`url(#pulp-orange-${uid})`}
                stroke="#FFFBEB"
                strokeWidth="1.5"
              />
            );
          })}
          <circle cx="50" cy="50" r="5" fill="#FFFBEB" />
          <ellipse cx="40" cy="36" rx="14" ry="7" fill="white" fillOpacity="0.4" transform="rotate(-30 40 36)" />
        </svg>
      );

    case 'orange-wedge':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <path d="M14,50 A42,42 0 0,0 86,50 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
          <path d="M18,50 A38,38 0 0,0 82,50 Z" fill="#FFFBEB" />
          <path d="M22,50 A34,34 0 0,0 78,50 Z" fill="#F97316" />
          <line x1="50" y1="50" x2="30" y2="72" stroke="#FFFBEB" strokeWidth="2" />
          <line x1="50" y1="50" x2="50" y2="82" stroke="#FFFBEB" strokeWidth="2" />
          <line x1="50" y1="50" x2="70" y2="72" stroke="#FFFBEB" strokeWidth="2" />
          <ellipse cx="44" cy="58" rx="4" ry="2.5" fill="#FFFBEB" />
        </svg>
      );

    case 'whole-orange':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <defs>
            <radialGradient id={`whole-org-${uid}`} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="45%" stopColor="#FB923C" />
              <stop offset="85%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#9A3412" />
            </radialGradient>
          </defs>
          <path d="M50,18 Q54,8 60,6" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <path d="M52,12 Q64,8 68,16 Q58,18 52,12 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1" />
          <circle cx="50" cy="54" r="38" fill={`url(#whole-org-${uid})`} stroke="#9A3412" strokeWidth="2.5" />
          <ellipse cx="36" cy="38" rx="12" ry="7" fill="white" fillOpacity="0.45" transform="rotate(-30 36 38)" />
        </svg>
      );

    case 'turmeric-root':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <path
            d="M24,32 Q34,18 56,22 Q76,26 84,42 Q86,62 72,76 Q50,86 32,78 Q16,70 18,48 Q18,38 24,32 Z"
            fill="#B45309"
            stroke="#451A03"
            strokeWidth="2.5"
          />
          <path d="M64,30 Q82,18 90,26 Q94,36 80,44 Z" fill="#92400E" stroke="#451A03" strokeWidth="2" />
          <path d="M28,42 Q44,38 58,44" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
          <path d="M26,54 Q44,50 64,56" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="26" cy="38" rx="8" ry="12" fill="#EA580C" stroke="#F97316" strokeWidth="2" transform="rotate(-20 26 38)" />
          <circle cx="26" cy="38" r="4" fill="#FBBF24" />
        </svg>
      );

    case 'carrot-wheel':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" fill="#C2410C" stroke="#7C2D12" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="39" fill="#EA580C" />
          <circle cx="50" cy="50" r="30" stroke="#FDBA74" strokeWidth="2" fill="#F97316" strokeDasharray="5 3" />
          <circle cx="50" cy="50" r="18" fill="#FDBA74" stroke="#EA580C" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="8" fill="#FEF08A" />
        </svg>
      );

    // ----------------------------------------------------
    // 3. YELLOW / GOLD FRUITS (Strip 3)
    // ----------------------------------------------------
    case 'lemon-wheel':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="46" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="40" fill="#FEFCE8" />
          <circle cx="50" cy="50" r="36" fill="#FDE047" fillOpacity="0.3" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => {
            const rad = (ang * Math.PI) / 180;
            const radNext = ((ang + 38) * Math.PI) / 180;
            const rIn = 6;
            const rOut = 36;
            const x1 = 50 + rIn * Math.cos(rad);
            const y1 = 50 + rIn * Math.sin(rad);
            const x2 = 50 + rOut * Math.cos(rad);
            const y2 = 50 + rOut * Math.sin(rad);
            const x3 = 50 + rOut * Math.cos(radNext);
            const y3 = 50 + rOut * Math.sin(radNext);
            const x4 = 50 + rIn * Math.cos(radNext);
            const y4 = 50 + rIn * Math.sin(radNext);
            return (
              <path
                key={ang}
                d={`M ${x1} ${y1} L ${x2} ${y2} A ${rOut} ${rOut} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${rIn} ${rIn} 0 0 0 ${x1} ${y1} Z`}
                fill="#FEF08A"
                stroke="#FEFCE8"
                strokeWidth="1.5"
              />
            );
          })}
          <circle cx="50" cy="50" r="5" fill="#FEFCE8" />
          <ellipse cx="40" cy="38" rx="13" ry="6" fill="white" fillOpacity="0.45" transform="rotate(-30 40 38)" />
        </svg>
      );

    case 'pineapple-slice':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          {/* Spiky Rind */}
          <circle cx="50" cy="50" r="45" fill="#EAB308" stroke="#A16207" strokeWidth="2.5" />
          {/* Outer yellow pulp */}
          <circle cx="50" cy="50" r="39" fill="#FACC15" />
          {/* Radiating Pineapple Fibers */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="50"
              y1="50"
              x2={50 + 38 * Math.cos((deg * Math.PI) / 180)}
              y2={50 + 38 * Math.sin((deg * Math.PI) / 180)}
              stroke="#CA8A04"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
          ))}
          {/* Core Hole */}
          <circle cx="50" cy="50" r="14" fill="#FEFCE8" stroke="#CA8A04" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="9" fill="#DDA74F" fillOpacity="0.25" />
        </svg>
      );

    case 'lemon-wedge':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <path d="M14,50 A42,42 0 0,0 86,50 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
          <path d="M18,50 A38,38 0 0,0 82,50 Z" fill="#FEFCE8" />
          <path d="M22,50 A34,34 0 0,0 78,50 Z" fill="#FDE047" />
          <line x1="50" y1="50" x2="30" y2="72" stroke="#FEFCE8" strokeWidth="2" />
          <line x1="50" y1="50" x2="50" y2="82" stroke="#FEFCE8" strokeWidth="2" />
          <line x1="50" y1="50" x2="70" y2="72" stroke="#FEFCE8" strokeWidth="2" />
        </svg>
      );

    case 'golden-turmeric':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <path d="M26,30 Q44,22 66,28 Q82,34 84,52 Q82,72 64,78 Q42,82 28,70 Q18,58 26,30 Z" fill="#EAB308" stroke="#A16207" strokeWidth="2" />
          <ellipse cx="36" cy="46" rx="8" ry="12" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
          <circle cx="36" cy="46" r="4" fill="#FEF08A" />
        </svg>
      );

    case 'banana-slice':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="42" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
          <circle cx="50" cy="50" r="37" fill="#FEF9C3" />
          <circle cx="48" cy="48" r="1.5" fill="#713F12" />
          <circle cx="52" cy="48" r="1.5" fill="#713F12" />
          <circle cx="50" cy="52" r="1.5" fill="#713F12" />
        </svg>
      );

    // ----------------------------------------------------
    // 4. CREAM / BOTANICAL LINEN FRUITS (Strip 4)
    // ----------------------------------------------------
    case 'green-apple':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <defs>
            <radialGradient id={`apple-green-${uid}`} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="40%" stopColor="#22C55E" />
              <stop offset="85%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#14532D" />
            </radialGradient>
          </defs>
          <path d="M50,22 Q52,10 60,8" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <path d="M52,14 Q66,12 68,22 Q56,22 52,14 Z" fill="#4ADE80" stroke="#15803D" strokeWidth="1" />
          <path
            d="M50,26 C42,16 22,18 16,34 C10,50 20,74 44,88 C48,90 52,90 56,88 C80,74 90,50 84,34 C78,18 58,16 50,26 Z"
            fill={`url(#apple-green-${uid})`}
            stroke="#14532D"
            strokeWidth="2.5"
          />
          <ellipse cx="32" cy="40" rx="9" ry="16" fill="white" fillOpacity="0.4" transform="rotate(-25 32 40)" />
        </svg>
      );

    case 'cucumber-wheel':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          {/* Dark Green Peel */}
          <circle cx="50" cy="50" r="46" fill="#15803D" stroke="#052E16" strokeWidth="2.5" />
          {/* Light Translucent Pulp */}
          <circle cx="50" cy="50" r="41" fill="#DCFCE7" />
          {/* Inner Seed Ring */}
          <circle cx="50" cy="50" r="28" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="1.5" strokeDasharray="3 3" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse
              key={deg}
              cx={50 + 16 * Math.cos((deg * Math.PI) / 180)}
              cy={50 + 16 * Math.sin((deg * Math.PI) / 180)}
              rx="2"
              ry="4.5"
              fill="#BBF7D0"
              stroke="#16A34A"
              strokeWidth="0.8"
              transform={`rotate(${deg + 90} ${50 + 16 * Math.cos((deg * Math.PI) / 180)} ${50 + 16 * Math.sin((deg * Math.PI) / 180)})`}
            />
          ))}
          <ellipse cx="38" cy="38" rx="10" ry="5" fill="white" fillOpacity="0.45" transform="rotate(-30 38 38)" />
        </svg>
      );

    case 'mint-leaf':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <path
            d="M16,84 C16,84 14,48 44,20 C74,-4 86,16 82,46 C78,74 50,88 16,84 Z"
            fill="#16A34A"
            stroke="#14532D"
            strokeWidth="2.5"
          />
          <path d="M16,84 Q44,56 74,28" stroke="#86EFAC" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M28,70 Q38,65 46,73" stroke="#86EFAC" strokeWidth="1.5" />
          <path d="M38,60 Q50,54 58,64" stroke="#86EFAC" strokeWidth="1.5" />
          <path d="M48,48 Q60,44 68,52" stroke="#86EFAC" strokeWidth="1.5" />
          <circle cx="56" cy="42" r="3.5" fill="white" fillOpacity="0.85" />
        </svg>
      );

    case 'coconut-half':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          {/* Brown Textured Husk */}
          <circle cx="50" cy="50" r="46" fill="#78350F" stroke="#451A03" strokeWidth="2.5" />
          {/* Pure White Coconut Flesh */}
          <circle cx="50" cy="50" r="38" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          {/* Water Cavity */}
          <circle cx="50" cy="50" r="26" fill="#F1F5F9" fillOpacity="0.8" />
          <ellipse cx="42" cy="42" rx="12" ry="6" fill="white" fillOpacity="0.5" transform="rotate(-30 42 42)" />
        </svg>
      );

    case 'celery-stalk':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <path d="M42,88 L46,24 Q50,14 62,12 L56,88 Z" fill="#4ADE80" stroke="#16A34A" strokeWidth="2" />
          <line x1="48" y1="88" x2="52" y2="20" stroke="#86EFAC" strokeWidth="2" />
          <path d="M58,16 Q68,6 74,14 Q68,22 58,16 Z" fill="#22C55E" />
        </svg>
      );

    // ----------------------------------------------------
    // 5. OBSIDIAN / MIDNIGHT BOTANICALS (Strip 5)
    // ----------------------------------------------------
    case 'blackberry':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          {/* Cluster of Dark Glossy Drupelets */}
          {[
            [50, 30],
            [40, 40], [50, 42], [60, 40],
            [34, 54], [46, 56], [58, 54], [68, 54],
            [40, 68], [50, 70], [60, 68],
            [50, 80]
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="8.5" fill="#1E1B4B" stroke="#4C1D95" strokeWidth="1.5" />
              <circle cx={x - 2} cy={y - 2} r="2.5" fill="#C084FC" fillOpacity="0.65" />
            </g>
          ))}
          {/* Top Leaf */}
          <path d="M50,22 Q54,10 60,12" stroke="#16A34A" strokeWidth="2" />
        </svg>
      );

    case 'dark-grapes':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          {/* Grape Bunch */}
          {[
            [42, 28], [56, 28],
            [36, 40], [48, 42], [62, 40],
            [40, 54], [54, 56],
            [44, 68], [52, 68],
            [48, 80]
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="8" fill="#2E1065" stroke="#581C87" strokeWidth="1.5" />
              <ellipse cx={x - 2} cy={y - 2} rx="2" ry="1.2" fill="#E9D5FF" fillOpacity="0.5" />
            </g>
          ))}
        </svg>
      );

    case 'purple-plum':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="52" r="38" fill="#3B0764" stroke="#581C87" strokeWidth="2" />
          <path d="M50,14 C50,14 42,40 50,88" stroke="#581C87" strokeWidth="2" />
          <ellipse cx="36" cy="38" rx="10" ry="16" fill="#C084FC" fillOpacity="0.3" transform="rotate(-25 36 38)" />
        </svg>
      );

    case 'blueberries':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="40" cy="56" r="22" fill="#1E3A8A" stroke="#172554" strokeWidth="2" />
          <circle cx="62" cy="46" r="18" fill="#1D4ED8" stroke="#172554" strokeWidth="2" />
          <circle cx="48" cy="36" r="15" fill="#2563EB" stroke="#172554" strokeWidth="2" />
          <circle cx="36" cy="50" r="4" fill="#93C5FD" fillOpacity="0.6" />
          <circle cx="60" cy="40" r="3" fill="#93C5FD" fillOpacity="0.6" />
        </svg>
      );

    case 'dark-leaf':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <path d="M50,8 C68,22 84,48 78,86 C62,90 38,90 22,86 C16,48 32,22 50,8 Z" fill="#064E3B" stroke="#022C22" strokeWidth="2" />
          <path d="M50,12 L50,86" stroke="#34D399" strokeWidth="2" />
        </svg>
      );
  }
};
