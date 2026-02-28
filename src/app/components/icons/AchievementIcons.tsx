export function IconLightning({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <polygon
        points="18,3 8,18 15,18 14,29 24,14 17,14"
        fill="#FFD93D"
        stroke="#D87233"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <polygon
        points="18,3 8,18 15,18 14,29 24,14 17,14"
        fill="url(#lghtGrad)"
      />
      <defs>
        <linearGradient id="lghtGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE66D" />
          <stop offset="100%" stopColor="#D87233" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function IconTarget({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="13" fill="#E85D5D" />
      <circle cx="16" cy="16" r="10" fill="white" />
      <circle cx="16" cy="16" r="7" fill="#E85D5D" />
      <circle cx="16" cy="16" r="4" fill="white" />
      <circle cx="16" cy="16" r="2" fill="#D87233" />
      <line x1="16" y1="3" x2="16" y2="7" stroke="#E85D5D" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="25" x2="16" y2="29" stroke="#E85D5D" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="16" x2="7" y2="16" stroke="#E85D5D" strokeWidth="2" strokeLinecap="round" />
      <line x1="25" y1="16" x2="29" y2="16" stroke="#E85D5D" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconFlame({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="flameOuter" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#D87233" />
        </linearGradient>
        <linearGradient id="flameInner" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FFD93D" />
          <stop offset="100%" stopColor="#FF8C00" />
        </linearGradient>
      </defs>
      <path
        d="M16 2C16 2 20 7 20 12C22 10 22 7 21 5C24 8 26 13 24 18C26 17 27 15 27 13C29 17 28 23 24 26C22 28 19 29 16 29C12 29 8 27 7 24C5 21 6 17 9 15C9 18 11 20 13 21C11 18 11 14 13 11C14 13 15 15 17 16C15 13 15 7 16 2Z"
        fill="url(#flameOuter)"
      />
      <path
        d="M16 12C16 12 18 15 18 18C19 17 19 15 18.5 14C20 16 20 19 19 21C20 20.5 20.5 19 20.5 18C21.5 20 21 23 19 25C18 26 17 26.5 16 26.5C14 26.5 12.5 25.5 12 24C11 22 12 20 13.5 19C13.5 20.5 14.5 21.5 15.5 22C14 20 14 17 16 12Z"
        fill="url(#flameInner)"
      />
    </svg>
  );
}

export function IconRocket({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="rocketBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7B9ED9" />
          <stop offset="100%" stopColor="#6272A4" />
        </linearGradient>
      </defs>
      {/* Body */}
      <path
        d="M16 3C16 3 22 8 22 18L16 22L10 18C10 8 16 3 16 3Z"
        fill="url(#rocketBody)"
      />
      {/* Window */}
      <circle cx="16" cy="14" r="3" fill="white" opacity="0.9" />
      <circle cx="16" cy="14" r="1.8" fill="#A8C4E8" />
      {/* Wings */}
      <path d="M10 18L6 24L10 22Z" fill="#D87233" />
      <path d="M22 18L26 24L22 22Z" fill="#D87233" />
      {/* Flame */}
      <path d="M13 22C13 22 14 26 16 28C18 26 19 22 19 22Z" fill="#FFD93D" />
      <path d="M14 22C14 22 15 25 16 26C17 25 18 22 18 22Z" fill="#FF8C00" />
    </svg>
  );
}

export function IconBulb({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="bulbGlow" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FFE66D" />
          <stop offset="100%" stopColor="#FFB800" />
        </linearGradient>
      </defs>
      {/* Glow */}
      <circle cx="16" cy="14" r="10" fill="#FFD93D" opacity="0.2" />
      {/* Bulb glass */}
      <path
        d="M10 14C10 10.7 12.7 8 16 8C19.3 8 22 10.7 22 14C22 16.5 20.5 18.7 18.5 19.8V22H13.5V19.8C11.5 18.7 10 16.5 10 14Z"
        fill="url(#bulbGlow)"
      />
      {/* Base */}
      <rect x="13.5" y="22" width="5" height="1.5" rx="0.5" fill="#D4A017" />
      <rect x="13.5" y="23.5" width="5" height="1.5" rx="0.5" fill="#B8860B" />
      {/* Screw base */}
      <rect x="14" y="25" width="4" height="1.5" rx="0.75" fill="#B8860B" />
      {/* Shine */}
      <ellipse cx="13.5" cy="12" rx="1.5" ry="2.5" fill="white" opacity="0.5" transform="rotate(-20 13.5 12)" />
      {/* Rays */}
      <line x1="16" y1="4" x2="16" y2="6" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="7" x2="9.4" y2="8.4" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="7" x2="22.6" y2="8.4" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="14" x2="8" y2="14" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" />
      <line x1="26" y1="14" x2="24" y2="14" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconCrown({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="crownGold" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#D4A017" />
        </linearGradient>
      </defs>
      {/* Crown body */}
      <path
        d="M4 24L6 13L11 19L16 8L21 19L26 13L28 24Z"
        fill="url(#crownGold)"
        stroke="#C8940A"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* Bottom band */}
      <rect x="4" y="24" width="24" height="4" rx="1" fill="#D4A017" />
      <rect x="4" y="24" width="24" height="1.5" rx="0.5" fill="#FFE066" opacity="0.6" />
      {/* Gems */}
      <circle cx="16" cy="13" r="2.5" fill="#E85D5D" stroke="#C0392B" strokeWidth="0.5" />
      <circle cx="8.5" cy="21" r="1.8" fill="#5CA7AD" stroke="#3A8A90" strokeWidth="0.5" />
      <circle cx="23.5" cy="21" r="1.8" fill="#5CA7AD" stroke="#3A8A90" strokeWidth="0.5" />
      <circle cx="16" cy="26" r="1.5" fill="#FFE066" stroke="#D4A017" strokeWidth="0.5" />
      {/* Gem shine */}
      <circle cx="15.3" cy="12.3" r="0.7" fill="white" opacity="0.7" />
    </svg>
  );
}

export function IconTrophy({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="trophyGold" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#D4A017" />
        </linearGradient>
      </defs>
      {/* Cup body */}
      <path d="M9 5H23V17C23 21 19.9 24 16 24C12.1 24 9 21 9 17Z" fill="url(#trophyGold)" />
      {/* Handles */}
      <path d="M9 8C9 8 5 8 5 12C5 16 9 16 9 16" stroke="#D4A017" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M23 8C23 8 27 8 27 12C27 16 23 16 23 16" stroke="#D4A017" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Stem */}
      <rect x="14" y="24" width="4" height="4" fill="#C8940A" />
      {/* Base */}
      <rect x="10" y="28" width="12" height="2.5" rx="1" fill="#D4A017" />
      {/* Star on cup */}
      <path d="M16 9L17.2 12.5H21L18.1 14.5L19.3 18L16 16L12.7 18L13.9 14.5L11 12.5H14.8Z" fill="#FFE066" opacity="0.9" />
      {/* Shine on cup */}
      <ellipse cx="12.5" cy="11" rx="1.5" ry="3" fill="white" opacity="0.3" transform="rotate(-10 12.5 11)" />
    </svg>
  );
}

export function IconStar({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="starGrad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#D87233" />
        </linearGradient>
      </defs>
      <path
        d="M16 3L19.6 12.2L29.5 13L22.3 19.4L24.5 29L16 24.2L7.5 29L9.7 19.4L2.5 13L12.4 12.2Z"
        fill="url(#starGrad)"
        stroke="#C8940A"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M16 6L18.8 13.2L26.5 13.8L20.8 19L22.7 26.5L16 22.8L9.3 26.5L11.2 19L5.5 13.8L13.2 13.2Z"
        fill="#FFE880"
        opacity="0.5"
      />
      {/* Shine */}
      <circle cx="13" cy="12" r="2" fill="white" opacity="0.4" />
    </svg>
  );
}

export function IconCheckCircle({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="checkGrad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#5DD87A" />
          <stop offset="100%" stopColor="#27AE60" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill="url(#checkGrad)" />
      <circle cx="16" cy="16" r="11" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <path
        d="M9 16L13.5 21L23 11"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2" fill="white" opacity="0.3" />
    </svg>
  );
}

export function IconRainbow({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Rainbow arcs */}
      <path d="M4 22C4 13.2 9.4 6 16 6C22.6 6 28 13.2 28 22" stroke="#E85D5D" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M6.5 22C6.5 14.5 10.8 8.5 16 8.5C21.2 8.5 25.5 14.5 25.5 22" stroke="#D87233" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M9 22C9 15.8 12.2 11 16 11C19.8 11 23 15.8 23 22" stroke="#FFD93D" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M11.5 22C11.5 17.1 13.6 13.5 16 13.5C18.4 13.5 20.5 17.1 20.5 22" stroke="#5CA7AD" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M14 22C14 18.7 15 17 16 17C17 17 18 18.7 18 22" stroke="#6272A4" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Clouds */}
      <ellipse cx="5" cy="22" rx="4" ry="3" fill="white" />
      <ellipse cx="27" cy="22" rx="4" ry="3" fill="white" />
      <ellipse cx="5" cy="21" rx="3" ry="2.5" fill="white" />
      <ellipse cx="27" cy="21" rx="3" ry="2.5" fill="white" />
    </svg>
  );
}

export function IconParty({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Party horn */}
      <path d="M6 26L14 14L20 19Z" fill="#6272A4" />
      <path d="M6 26L14 14L20 19Z" fill="url(#partyHorn)" />
      <defs>
        <linearGradient id="partyHorn" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8A9FD4" />
          <stop offset="100%" stopColor="#6272A4" />
        </linearGradient>
      </defs>
      {/* Stripes on horn */}
      <line x1="9" y1="21" x2="13" y2="18" stroke="white" strokeWidth="1" opacity="0.4" />
      <line x1="11" y1="23" x2="15" y2="20" stroke="white" strokeWidth="1" opacity="0.4" />
      {/* Horn end cap */}
      <circle cx="20.5" cy="18.5" r="3" fill="#D87233" />
      <circle cx="20.5" cy="18.5" r="2" fill="#FFB347" />
      {/* Confetti */}
      <rect x="20" y="5" width="3" height="3" rx="0.5" fill="#E85D5D" transform="rotate(20 20 5)" />
      <rect x="25" y="9" width="2.5" height="2.5" rx="0.5" fill="#FFD93D" transform="rotate(-15 25 9)" />
      <rect x="24" y="15" width="2" height="2" rx="0.5" fill="#5CA7AD" transform="rotate(35 24 15)" />
      <rect x="17" y="3" width="2" height="3" rx="0.5" fill="#6272A4" transform="rotate(-10 17 3)" />
      <circle cx="27" cy="13" r="1.5" fill="#D87233" />
      <circle cx="23" cy="6" r="1" fill="#5CA7AD" />
      <circle cx="29" cy="18" r="1.2" fill="#E85D5D" />
      {/* Sparkle */}
      <path d="M27 5 L28 7 L29 5 L27 7 Z" fill="#FFD93D" />
    </svg>
  );
}

export function IconFootprint({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="footGrad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0F4F5" />
        </linearGradient>
      </defs>
      {/* Main foot — white fill with teal stroke so it pops on any background */}
      <ellipse cx="13" cy="22" rx="5.5" ry="7" fill="url(#footGrad)" stroke="#5CA7AD" strokeWidth="1.2" />
      {/* Toes */}
      <circle cx="8"    cy="14.5" r="2.5" fill="url(#footGrad)" stroke="#5CA7AD" strokeWidth="1" />
      <circle cx="12"   cy="13"   r="2.8" fill="url(#footGrad)" stroke="#5CA7AD" strokeWidth="1" />
      <circle cx="16.5" cy="13.5" r="2.5" fill="url(#footGrad)" stroke="#5CA7AD" strokeWidth="1" />
      <circle cx="20.5" cy="15.5" r="2"   fill="url(#footGrad)" stroke="#5CA7AD" strokeWidth="1" />
      {/* Second (smaller) footprint — outlined only */}
      <ellipse cx="21" cy="9"   rx="3.5" ry="4.5" fill="rgba(255,255,255,0.55)" stroke="#5CA7AD" strokeWidth="1" strokeDasharray="2 1.5" />
      <circle cx="17.5" cy="4.5" r="1.5" fill="rgba(255,255,255,0.55)" stroke="#5CA7AD" strokeWidth="0.8" />
      <circle cx="20.5" cy="3.5" r="1.8" fill="rgba(255,255,255,0.55)" stroke="#5CA7AD" strokeWidth="0.8" />
      <circle cx="23.5" cy="4"   r="1.5" fill="rgba(255,255,255,0.55)" stroke="#5CA7AD" strokeWidth="0.8" />
      <circle cx="25.5" cy="5.8" r="1.2" fill="rgba(255,255,255,0.55)" stroke="#5CA7AD" strokeWidth="0.8" />
    </svg>
  );
}

export function IconLock({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2" fill="white" opacity="0.6" />
      <path
        d="M8 11V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V11"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="12" cy="16" r="1.5" fill="rgba(255,255,255,0.6)" />
    </svg>
  );
}

// Small star for rating row
export function IconSmallStar({ filled, size = 14 }: { filled: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L14.9 8.9L22.5 9.5L17 14.3L18.7 21.8L12 18.1L5.3 21.8L7 14.3L1.5 9.5L9.1 8.9Z"
        fill={filled ? "#FFD93D" : "rgba(255,255,255,0.25)"}
        stroke={filled ? "#D4A017" : "rgba(255,255,255,0.2)"}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}