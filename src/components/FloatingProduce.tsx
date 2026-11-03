import React, { useEffect, useState, useRef } from 'react';

interface BotanicalElement {
  id: number;
  type:
    | 'orange-slice'
    | 'orange-wedge'
    | 'lemon-wheel'
    | 'mint-leaf'
    | 'tropical-leaf'
    | 'beet-wheel'
    | 'turmeric-root'
    | 'pomegranate-arils'
    | 'dragonfruit-wheel'
    | 'dew-leaf';
  x: number; // percentage from left
  y: number; // percentage from top
  size: number; // pixel width/height
  depth: number; // parallax factor
  rotation: number;
  speed: number;
  opacity?: number;
}

export const FloatingProduce: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  // Carefully curated botanical produce distributed across the Hero canvas
  const elementsRef = useRef<BotanicalElement[]>([
    // Top-Left Cluster (Framing "COLD-")
    { id: 1, type: 'orange-slice', x: 6, y: 10, size: 78, depth: 0.12, rotation: 18, speed: 1.1, opacity: 0.9 },
    { id: 2, type: 'mint-leaf', x: 15, y: 7, size: 62, depth: 0.16, rotation: -32, speed: 1.3, opacity: 0.88 },
    { id: 3, type: 'pomegranate-arils', x: 23, y: 14, size: 48, depth: 0.08, rotation: 14, speed: 0.9, opacity: 0.85 },

    // Top-Center & Top-Right (Framing "PRESSED." and "RAW.")
    { id: 4, type: 'tropical-leaf', x: 73, y: 6, size: 76, depth: 0.14, rotation: 26, speed: 1.4, opacity: 0.88 },
    { id: 5, type: 'orange-wedge', x: 86, y: 11, size: 72, depth: 0.11, rotation: -22, speed: 1.0, opacity: 0.92 },
    { id: 6, type: 'mint-leaf', x: 92, y: 22, size: 58, depth: 0.15, rotation: 42, speed: 1.2, opacity: 0.85 },
    { id: 7, type: 'lemon-wheel', x: 80, y: 24, size: 60, depth: 0.09, rotation: -15, speed: 1.1, opacity: 0.88 },

    // Middle-Left (Flanking Headline & Bottle)
    { id: 8, type: 'beet-wheel', x: 4, y: 34, size: 82, depth: 0.13, rotation: -12, speed: 1.2, opacity: 0.92 },
    { id: 9, type: 'dew-leaf', x: 12, y: 44, size: 54, depth: 0.18, rotation: 28, speed: 1.5, opacity: 0.88 },
    { id: 10, type: 'turmeric-root', x: 6, y: 58, size: 76, depth: 0.10, rotation: -36, speed: 0.95, opacity: 0.9 },
    { id: 11, type: 'orange-wedge', x: 16, y: 68, size: 66, depth: 0.15, rotation: 35, speed: 1.3, opacity: 0.88 },

    // Middle-Right (Flanking Headline & Bottle)
    { id: 12, type: 'dragonfruit-wheel', x: 90, y: 42, size: 78, depth: 0.13, rotation: -18, speed: 1.1, opacity: 0.92 },
    { id: 13, type: 'mint-leaf', x: 84, y: 54, size: 64, depth: 0.17, rotation: -40, speed: 1.4, opacity: 0.88 },
    { id: 14, type: 'beet-wheel', x: 92, y: 66, size: 70, depth: 0.11, rotation: 22, speed: 1.0, opacity: 0.9 },
    { id: 15, type: 'dew-leaf', x: 82, y: 72, size: 50, depth: 0.16, rotation: 18, speed: 1.2, opacity: 0.85 },

    // Lower-Left & Lower-Right Framing
    { id: 16, type: 'pomegranate-arils', x: 8, y: 80, size: 54, depth: 0.07, rotation: -15, speed: 0.85, opacity: 0.85 },
    { id: 17, type: 'tropical-leaf', x: 18, y: 86, size: 74, depth: 0.14, rotation: 48, speed: 1.3, opacity: 0.88 },
    { id: 18, type: 'orange-slice', x: 76, y: 84, size: 74, depth: 0.12, rotation: -28, speed: 1.1, opacity: 0.9 },
    { id: 19, type: 'lemon-wheel', x: 88, y: 88, size: 64, depth: 0.09, rotation: 16, speed: 1.0, opacity: 0.88 },

    // Subtle Subtle Floating accents near center edges
    { id: 20, type: 'dew-leaf', x: 26, y: 30, size: 42, depth: 0.06, rotation: -18, speed: 1.1, opacity: 0.75 },
    { id: 21, type: 'mint-leaf', x: 72, y: 38, size: 44, depth: 0.07, rotation: 24, speed: 1.2, opacity: 0.75 },
  ]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;
      setMousePos({ x, y });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const renderProduceSvg = (type: BotanicalElement['type'], size: number, id: number) => {
    const gradId = `prod-grad-${id}`;

    switch (type) {
      case 'orange-slice':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id={`${gradId}-rind`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="60%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <linearGradient id={`${gradId}-pulp`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            {/* Outer Rind */}
            <circle cx="50" cy="50" r="47" fill={`url(#${gradId}-rind)`} stroke="#B45309" strokeWidth="2" />
            {/* White Pith */}
            <circle cx="50" cy="50" r="41" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1" />
            {/* Inner Pulp Disc */}
            <circle cx="50" cy="50" r="37" fill="#F59E0B" fillOpacity="0.25" />
            {/* 8 Juicy Segments */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => {
              const rad = (ang * Math.PI) / 180;
              const radNext = ((ang + 38) * Math.PI) / 180;
              const rIn = 7;
              const rOut = 37;
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
                  fill={`url(#${gradId}-pulp)`}
                  stroke="#FFFBEB"
                  strokeWidth="1.5"
                />
              );
            })}
            {/* Core */}
            <circle cx="50" cy="50" r="6" fill="#FFFBEB" />
            <circle cx="50" cy="50" r="2.5" fill="#F59E0B" />
            {/* Glossy Juice Sheen */}
            <ellipse cx="42" cy="36" rx="14" ry="7" fill="white" fillOpacity="0.32" transform="rotate(-30 42 36)" />
          </svg>
        );

      case 'orange-wedge':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id={`${gradId}-wrind`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
              <linearGradient id={`${gradId}-wpulp`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="60%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            {/* Rind Arc */}
            <path
              d="M14,50 A42,42 0 0,0 86,50 Z"
              fill={`url(#${gradId}-wrind)`}
              stroke="#B45309"
              strokeWidth="2.5"
            />
            {/* White Pith */}
            <path d="M18,50 A38,38 0 0,0 82,50 Z" fill="#FFFBEB" />
            {/* Pulp Area */}
            <path d="M22,50 A34,34 0 0,0 78,50 Z" fill={`url(#${gradId}-wpulp)`} />
            {/* Radial Segment Dividers */}
            <line x1="50" y1="50" x2="30" y2="72" stroke="#FFFBEB" strokeWidth="2" />
            <line x1="50" y1="50" x2="50" y2="82" stroke="#FFFBEB" strokeWidth="2" />
            <line x1="50" y1="50" x2="70" y2="72" stroke="#FFFBEB" strokeWidth="2" />
            {/* Juice droplet highlight */}
            <ellipse cx="44" cy="58" rx="4" ry="2.5" fill="#FFFBEB" />
          </svg>
        );

      case 'lemon-wheel':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id={`${gradId}-lemon`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#EAB308" />
              </linearGradient>
            </defs>
            {/* Lemon Rind */}
            <circle cx="50" cy="50" r="47" fill="#EAB308" stroke="#CA8A04" strokeWidth="2" />
            {/* White Pith */}
            <circle cx="50" cy="50" r="41" fill="#FEFCE8" />
            {/* Inner disc */}
            <circle cx="50" cy="50" r="37" fill="#FACC15" fillOpacity="0.25" />
            {/* 8 Segments */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => {
              const rad = (ang * Math.PI) / 180;
              const radNext = ((ang + 38) * Math.PI) / 180;
              const rIn = 6;
              const rOut = 37;
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
                  fill={`url(#${gradId}-lemon)`}
                  stroke="#FEFCE8"
                  strokeWidth="1.5"
                />
              );
            })}
            <circle cx="50" cy="50" r="5" fill="#FEFCE8" />
            <ellipse cx="40" cy="38" rx="13" ry="6" fill="white" fillOpacity="0.35" transform="rotate(-30 40 38)" />
          </svg>
        );

      case 'mint-leaf':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id={`${gradId}-mint`} x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#1E392A" />
                <stop offset="50%" stopColor="#2E4733" />
                <stop offset="100%" stopColor="#4E7356" />
              </linearGradient>
            </defs>
            {/* Organic Serrated Leaf Body */}
            <path
              d="M16,84 C16,84 14,48 44,20 C74,-4 86,16 82,46 C78,74 50,88 16,84 Z"
              fill={`url(#${gradId}-mint)`}
              stroke="#14261C"
              strokeWidth="2.5"
            />
            {/* Serrated Cut Notches */}
            <path
              d="M16,84 Q22,70 18,64 Q26,56 22,50 Q30,42 28,34 Q40,26 44,20"
              stroke="#1E392A"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Primary Vein */}
            <path d="M16,84 Q44,56 74,28" stroke="#86EFAC" strokeWidth="2.5" strokeLinecap="round" />
            {/* Secondary Veins */}
            <path d="M28,70 Q38,65 46,73" stroke="#86EFAC" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M38,60 Q50,54 58,64" stroke="#86EFAC" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M48,48 Q60,44 68,52" stroke="#86EFAC" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M33,65 Q28,52 36,46" stroke="#86EFAC" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M44,53 Q39,40 48,34" stroke="#86EFAC" strokeWidth="1.5" strokeLinecap="round" />
            {/* Glistening Dewdrop */}
            <circle cx="56" cy="42" r="3.5" fill="white" fillOpacity="0.8" />
            <circle cx="55" cy="41" r="1.5" fill="white" />
          </svg>
        );

      case 'tropical-leaf':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id={`${gradId}-trop`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#15803D" />
                <stop offset="60%" stopColor="#166534" />
                <stop offset="100%" stopColor="#14532D" />
              </linearGradient>
            </defs>
            {/* Long Curving Botanical Leaf Blade */}
            <path
              d="M50,8 C68,22 84,48 78,86 C62,90 38,90 22,86 C16,48 32,22 50,8 Z"
              fill={`url(#${gradId}-trop)`}
              stroke="#052E16"
              strokeWidth="2.5"
            />
            {/* Spine */}
            <path d="M50,12 L50,86" stroke="#86EFAC" strokeWidth="2.5" strokeLinecap="round" />
            {/* Organic Frills */}
            <path d="M50,28 Q66,33 74,40" stroke="#86EFAC" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M50,44 Q66,49 75,56" stroke="#86EFAC" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M50,60 Q64,65 71,72" stroke="#86EFAC" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M50,28 Q34,33 26,40" stroke="#86EFAC" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M50,44 Q34,49 25,56" stroke="#86EFAC" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M50,60 Q36,65 29,72" stroke="#86EFAC" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="44" cy="52" r="3" fill="white" fillOpacity="0.75" />
          </svg>
        );

      case 'beet-wheel':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id={`${gradId}-beet`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E11D48" />
                <stop offset="50%" stopColor="#BE123C" />
                <stop offset="100%" stopColor="#881337" />
              </linearGradient>
            </defs>
            {/* Dark Earthy Beet Skin */}
            <circle cx="50" cy="50" r="47" fill="#4C0519" stroke="#881337" strokeWidth="2.5" />
            {/* Deep Ruby Layer */}
            <circle cx="50" cy="50" r="42" fill={`url(#${gradId}-beet)`} />
            {/* Concentric Annual Rings */}
            <circle cx="50" cy="50" r="35" stroke="#FDA4AF" strokeWidth="2.5" fill="#9F1239" strokeDasharray="6 3" strokeOpacity="0.8" />
            <circle cx="50" cy="50" r="26" stroke="#FECDD3" strokeWidth="2" fill="#BE123C" strokeDasharray="4 2" strokeOpacity="0.7" />
            <circle cx="50" cy="50" r="17" stroke="#FDA4AF" strokeWidth="2.5" fill="#E11D48" strokeOpacity="0.9" />
            {/* Core */}
            <circle cx="50" cy="50" r="8" fill="#FDA4AF" />
            <ellipse cx="38" cy="36" rx="14" ry="6" fill="white" fillOpacity="0.25" transform="rotate(-25 38 36)" />
          </svg>
        );

      case 'turmeric-root':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id={`${gradId}-turm`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="50%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>
            {/* Knobby Earth Rhizome */}
            <path
              d="M24,32 Q34,18 56,22 Q76,26 84,42 Q86,62 72,76 Q50,86 32,78 Q16,70 18,48 Q18,38 24,32 Z"
              fill={`url(#${gradId}-turm)`}
              stroke="#451A03"
              strokeWidth="2.5"
            />
            {/* Branch offshoot */}
            <path d="M64,30 Q82,18 90,26 Q94,36 80,44 Z" fill={`url(#${gradId}-turm)`} stroke="#451A03" strokeWidth="2" />
            {/* Bark Ring Striations */}
            <path d="M28,42 Q44,38 58,44" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
            <path d="M26,54 Q44,50 64,56" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
            <path d="M34,68 Q48,62 68,67" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
            {/* Fresh Cut Face (Radiant Orange Curcumin Core) */}
            <ellipse cx="26" cy="38" rx="8" ry="12" fill="#EA580C" stroke="#F97316" strokeWidth="2" transform="rotate(-20 26 38)" />
            <circle cx="26" cy="38" r="4" fill="#FBBF24" />
          </svg>
        );

      case 'pomegranate-arils':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id={`${gradId}-pom1`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F43F5E" />
                <stop offset="60%" stopColor="#BE123C" />
                <stop offset="100%" stopColor="#881337" />
              </linearGradient>
              <linearGradient id={`${gradId}-pom2`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FB7185" />
                <stop offset="60%" stopColor="#E11D48" />
                <stop offset="100%" stopColor="#9F1239" />
              </linearGradient>
            </defs>
            {/* 3 Translucent Ruby Gem Seeds */}
            <path
              d="M30,30 C18,42 22,64 36,66 C48,68 54,52 46,36 C40,26 34,24 30,30 Z"
              fill={`url(#${gradId}-pom1)`}
              stroke="#881337"
              strokeWidth="2"
            />
            <circle cx="34" cy="44" r="3.5" fill="white" fillOpacity="0.8" />
            <path
              d="M54,42 C44,52 48,72 62,74 C72,76 80,62 74,46 C68,36 60,36 54,42 Z"
              fill={`url(#${gradId}-pom2)`}
              stroke="#881337"
              strokeWidth="2"
            />
            <circle cx="60" cy="54" r="3.5" fill="white" fillOpacity="0.8" />
            <path
              d="M46,18 C38,26 42,42 52,44 C60,46 66,34 60,22 C56,14 50,12 46,18 Z"
              fill={`url(#${gradId}-pom1)`}
              stroke="#881337"
              strokeWidth="1.8"
            />
            <circle cx="50" cy="26" r="2.5" fill="white" fillOpacity="0.8" />
          </svg>
        );

      case 'dragonfruit-wheel':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            {/* Vivid Magenta Outer Skin */}
            <circle cx="50" cy="50" r="47" fill="#BE185D" stroke="#831843" strokeWidth="2.5" />
            {/* Green Scale Tips */}
            <path d="M12,35 Q4,30 8,24 Q16,28 18,34 Z" fill="#65A30D" />
            <path d="M88,35 Q96,30 92,24 Q84,28 82,34 Z" fill="#65A30D" />
            <path d="M50,4 Q50,-4 56,2 Q54,10 50,12 Z" fill="#65A30D" />
            {/* Crisp Flesh Disc */}
            <circle cx="50" cy="50" r="40" fill="#FFFBEB" stroke="#FDE047" strokeWidth="1.5" />
            {/* Speckled Black Seeds */}
            {[
              [40, 30], [55, 26], [68, 38], [32, 45], [48, 42], [62, 50],
              [36, 60], [52, 58], [66, 64], [44, 72], [58, 70], [28, 36],
              [72, 48], [48, 32], [56, 48], [38, 50], [60, 34], [42, 64]
            ].map(([sx, sy], i) => (
              <ellipse key={i} cx={sx} cy={sy} rx="1.8" ry="2.8" fill="#1C1917" transform={`rotate(${i * 25} ${sx} ${sy})`} />
            ))}
          </svg>
        );

      case 'dew-leaf':
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id={`${gradId}-dew`} x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#15803D" />
                <stop offset="50%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#86EFAC" />
              </linearGradient>
            </defs>
            <path
              d="M20,80 Q25,30 80,20 Q75,70 20,80 Z"
              fill={`url(#${gradId}-dew)`}
              stroke="#14532D"
              strokeWidth="2.5"
            />
            <path d="M22,78 Q50,50 78,22" stroke="#DCFCE7" strokeWidth="2" strokeLinecap="round" />
            <path d="M40,60 Q55,62 62,70" stroke="#DCFCE7" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M55,45 Q70,47 76,55" stroke="#DCFCE7" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="50" cy="48" r="4" fill="white" fillOpacity="0.85" />
            <circle cx="49" cy="47" r="1.5" fill="white" />
          </svg>
        );
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
      {elementsRef.current.map((item) => {
        const offsetX = mousePos.x * item.depth;
        const offsetY = mousePos.y * item.depth + (scrollY * item.depth * 0.35);

        return (
          <div
            key={item.id}
            className="absolute transition-transform duration-300 ease-out will-change-transform hover:scale-110 pointer-events-auto cursor-pointer"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate3d(${offsetX}px, ${offsetY}px, 0) rotate(${item.rotation + offsetX * 0.08 + (scrollY * item.depth * 0.08)}deg)`,
              filter: 'drop-shadow(0 12px 24px rgba(23,20,18,0.09))',
              opacity: item.opacity || 0.88,
            }}
          >
            <div
              className="animate-float"
              style={{
                animationDuration: `${4.5 + item.speed * 2}s`,
                animationDelay: `-${item.id * 0.4}s`,
              }}
            >
              {renderProduceSvg(item.type, item.size, item.id)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
