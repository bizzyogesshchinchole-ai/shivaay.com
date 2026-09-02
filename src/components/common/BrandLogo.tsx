import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark'; // 'dark' = dark text for light background, 'light' = white text for dark background
  className?: string;
  onClick?: () => void;
}

/**
 * High-Visibility, Ultra-Crisp Traditional Stone Chakki Emblem (Vector SVG)
 * Designed with high contrast, precise stone mill details:
 * - Concentric carved stone wheels with radial grinding grooves (Daante)
 * - Central grain hopper eye (Chakki ki Aankh) with golden grains
 * - Iconic offset wooden grinding handle (Haththi / Peg) with brass pin
 * - Golden wheat sprigs framing the stone wheel
 */
export const ChakkiIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-full h-full',
  size = 40,
}) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-label="Traditional Stone Chakki"
    >
      <defs>
        {/* Stone texture gradient for the grinding wheel */}
        <radialGradient id="chakkiStoneGrad" cx="36%" cy="34%" r="65%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="65%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>

        {/* Golden outer rim & accents */}
        <linearGradient id="goldRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="35%" stopColor="#EAB308" />
          <stop offset="70%" stopColor="#CA8A04" />
          <stop offset="100%" stopColor="#A16207" />
        </linearGradient>

        {/* Wooden handle gradient */}
        <linearGradient id="woodHandleGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FDBA74" />
          <stop offset="50%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#9A3412" />
        </linearGradient>

        {/* Emerald accent glow */}
        <linearGradient id="emeraldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        {/* Drop shadow for depth */}
        <filter id="chakkiShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Outer Golden Wheat & Solar Mill Ring */}
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="#091410"
        stroke="url(#goldRimGrad)"
        strokeWidth="2.5"
      />

      {/* Decorative Rotating Stone Teeth / Grooves along perimeter */}
      <g stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" opacity="0.85">
        <line x1="32" y1="4" x2="32" y2="7.5" />
        <line x1="32" y1="56.5" x2="32" y2="60" />
        <line x1="4" y1="32" x2="7.5" y2="32" />
        <line x1="56.5" y1="32" x2="60" y2="32" />
        <line x1="12.2" y1="12.2" x2="14.8" y2="14.8" />
        <line x1="49.2" y1="49.2" x2="51.8" y2="51.8" />
        <line x1="51.8" y1="12.2" x2="49.2" y2="14.8" />
        <line x1="14.8" y1="49.2" x2="12.2" y2="51.8" />
      </g>

      {/* Base Lower Grinding Stone (Chakki Bottom Bed) */}
      <circle
        cx="32"
        cy="33.5"
        r="23"
        fill="#0F172A"
        stroke="url(#emeraldAccent)"
        strokeWidth="1.5"
        filter="url(#chakkiShadow)"
      />

      {/* Upper Rotating Stone Disk (Paat) */}
      <circle
        cx="32"
        cy="31.5"
        r="21.5"
        fill="url(#chakkiStoneGrad)"
        stroke="#EAB308"
        strokeWidth="2"
      />

      {/* Radial Stone Grooves (Chakki Daante - Traditional Spiral Furrows for Milling) */}
      <g stroke="#E2E8F0" strokeWidth="1.2" strokeLinecap="round" opacity="0.45">
        <path d="M 32 18 Q 36 24 42 22" />
        <path d="M 44 26 Q 42 32 47 38" />
        <path d="M 42 42 Q 36 41 34 47" />
        <path d="M 27 46 Q 25 40 19 41" />
        <path d="M 18 34 Q 23 31 18 25" />
        <path d="M 23 20 Q 28 22 28 16" />
      </g>

      {/* Inner Concentric Stone Ring */}
      <circle
        cx="32"
        cy="31.5"
        r="13"
        fill="none"
        stroke="#CA8A04"
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />

      {/* Center Feed Hole / Eye of the Mill (Chakki ki Aankh) */}
      <circle
        cx="32"
        cy="31.5"
        r="6.5"
        fill="#020617"
        stroke="url(#goldRimGrad)"
        strokeWidth="2"
      />

      {/* Fresh Golden Wheat Grain in the Center Eye */}
      <ellipse
        cx="32"
        cy="31.5"
        rx="2.8"
        ry="4"
        transform="rotate(25 32 31.5)"
        fill="#FDE047"
        stroke="#A16207"
        strokeWidth="0.8"
      />
      <line
        x1="31"
        y1="28.5"
        x2="33"
        y2="34.5"
        stroke="#A16207"
        strokeWidth="0.6"
      />

      {/* Traditional Wooden Grinding Handle / Peg (Haththi / Khunta) */}
      {/* Handle Base Mount on upper stone */}
      <circle
        cx="21"
        cy="24"
        r="5.5"
        fill="#1E293B"
        stroke="#F59E0B"
        strokeWidth="1.5"
      />
      {/* Wooden Peg Handle Column */}
      <circle
        cx="21"
        cy="24"
        r="4"
        fill="url(#woodHandleGrad)"
        stroke="#451A03"
        strokeWidth="1"
      />
      {/* Brass Pin at top of handle for high contrast grip highlight */}
      <circle
        cx="19.5"
        cy="22.5"
        r="1.8"
        fill="#FEF08A"
      />
      <circle
        cx="21"
        cy="24"
        r="1"
        fill="#FFFFFF"
      />
    </svg>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'dark',
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    sm: {
      container: 'w-8 h-8',
      title: 'text-base font-extrabold tracking-wider',
      gap: 'gap-2.5',
    },
    md: {
      container: 'w-10 h-10 sm:w-11 sm:h-11',
      title: 'text-xl sm:text-2xl font-black tracking-wider',
      gap: 'gap-3',
    },
    lg: {
      container: 'w-12 h-12 sm:w-14 sm:h-14',
      title: 'text-2xl sm:text-3xl font-black tracking-widest',
      gap: 'gap-3.5',
    },
    xl: {
      container: 'w-16 h-16 sm:w-20 sm:h-20',
      title: 'text-3xl sm:text-4xl font-black tracking-widest',
      gap: 'gap-4',
    },
  };

  const s = sizeClasses[size];

  const titleColor =
    variant === 'light'
      ? 'text-white group-hover:text-amber-300'
      : 'text-slate-900 group-hover:text-emerald-850';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${s.gap} group select-none cursor-pointer ${className}`}
      id="brand-logo-container"
    >
      {/* Highly-Visible Traditional Stone Chakki Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <div
          className={`${s.container} flex items-center justify-center transition-all duration-300 transform group-hover:scale-105 filter drop-shadow-md group-hover:drop-shadow-lg`}
        >
          <ChakkiIcon />
        </div>
      </div>

      {/* Clean, Bold Brand Typography: SHIVAAY */}
      <span
        className={`${s.title} font-serif uppercase tracking-tight transition-colors duration-200 ${titleColor}`}
        style={{ letterSpacing: '0.04em' }}
      >
        SHIVAAY
      </span>
    </div>
  );
};
