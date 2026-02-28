// ─── Avatar definitions & SVG icons ──────────────────────

export interface AvatarDef {
  id: number;
  label: string;
  bg: string;
  shadow: string;
}

export const AVATARS: AvatarDef[] = [
  { id: 0, label: "Звезда",    bg: "linear-gradient(135deg, #FFD233 0%, #F09000 100%)", shadow: "rgba(240,144,0,0.5)" },
  { id: 1, label: "Робот",     bg: "linear-gradient(135deg, #5CA7AD 0%, #3A8F95 100%)", shadow: "rgba(92,167,173,0.5)" },
  { id: 2, label: "Ракета",    bg: "linear-gradient(135deg, #6272A4 0%, #4A5890 100%)", shadow: "rgba(98,114,164,0.5)" },
  { id: 3, label: "Корона",    bg: "linear-gradient(135deg, #D87233 0%, #B05A18 100%)", shadow: "rgba(216,114,51,0.5)" },
  { id: 4, label: "Молния",    bg: "linear-gradient(135deg, #E85D5D 0%, #C03030 100%)", shadow: "rgba(232,93,93,0.5)" },
  { id: 5, label: "Котик",     bg: "linear-gradient(135deg, #C47EBD 0%, #9B5C8A 100%)", shadow: "rgba(196,126,189,0.5)" },
  { id: 6, label: "Кристалл",  bg: "linear-gradient(135deg, #4A90D9 0%, #2E6DB8 100%)", shadow: "rgba(74,144,217,0.5)" },
  { id: 7, label: "Щит",       bg: "linear-gradient(135deg, #4CAF50 0%, #2E8B30 100%)", shadow: "rgba(76,175,80,0.5)" },
  { id: 8, label: "Планета",   bg: "linear-gradient(135deg, #9B59B6 0%, #6C3483 100%)", shadow: "rgba(155,89,182,0.5)" },
  { id: 9, label: "Огонь",     bg: "linear-gradient(135deg, #FF6B35 0%, #D4380D 100%)", shadow: "rgba(255,107,53,0.5)" },
];

// ─── Individual avatar SVG icons ─────────────────────────
function AvatarSVG({ id, size }: { id: number; size: number }) {
  const s = size;
  switch (id) {
    // Star — proper 5-pointed star
    case 0: return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
        <path
          d="M16,4 L18.94,11.95 L27.41,12.29 L20.76,17.55 L23.06,25.71 L16,21 L8.94,25.71 L11.24,17.55 L4.59,12.29 L13.06,11.95 Z"
          fill="white"
        />
        <ellipse cx="13.5" cy="11.5" rx="2.2" ry="1.2" fill="white" opacity="0.45" transform="rotate(-20 13.5 11.5)" />
      </svg>
    );

    // Robot — square head + antenna + eyes + mouth
    case 1: return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
        {/* Antenna */}
        <line x1="16" y1="3" x2="16" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="16" cy="2.5" r="2" fill="white"/>
        {/* Head */}
        <rect x="6" y="8" width="20" height="14" rx="3" fill="white" fillOpacity="0.93"/>
        {/* Eyes */}
        <rect x="9" y="12" width="5" height="4" rx="1.5" fill="white" fillOpacity="0.35"/>
        <rect x="18" y="12" width="5" height="4" rx="1.5" fill="white" fillOpacity="0.35"/>
        <circle cx="11.5" cy="14" r="1.5" fill="white" fillOpacity="0.7"/>
        <circle cx="20.5" cy="14" r="1.5" fill="white" fillOpacity="0.7"/>
        {/* Mouth */}
        <rect x="10" y="18.5" width="12" height="2" rx="1" fill="white" fillOpacity="0.4"/>
        {/* Body stub */}
        <rect x="11" y="24" width="10" height="5" rx="2" fill="white" fillOpacity="0.6"/>
      </svg>
    );

    // Rocket — body + fins + flame
    case 2: return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
        {/* Body */}
        <path d="M16,3 C11.5,3 9,8.5 9,15 L9,23 L23,23 L23,15 C23,8.5 20.5,3 16,3 Z" fill="white" fillOpacity="0.92"/>
        {/* Nose tip shine */}
        <ellipse cx="14" cy="8" rx="2" ry="3" fill="white" fillOpacity="0.35" transform="rotate(-15 14 8)"/>
        {/* Window */}
        <circle cx="16" cy="15" r="3.5" fill="white" fillOpacity="0.3"/>
        <circle cx="16" cy="15" r="2" fill="white" fillOpacity="0.5"/>
        {/* Left fin */}
        <path d="M9,21 L5,27 L9,25 Z" fill="white" fillOpacity="0.75"/>
        {/* Right fin */}
        <path d="M23,21 L27,27 L23,25 Z" fill="white" fillOpacity="0.75"/>
        {/* Flame */}
        <path d="M13,23 C13,27 16,30 16,30 C16,30 19,27 19,23 Z" fill="white" fillOpacity="0.5"/>
      </svg>
    );

    // Crown — classic 3-point crown
    case 3: return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
        {/* Crown body */}
        <path d="M4,23 L4,13 L10.5,19.5 L16,7 L21.5,19.5 L28,13 L28,23 Z" fill="white" fillOpacity="0.92"/>
        {/* Base band */}
        <rect x="4" y="23" width="24" height="4" rx="2" fill="white" fillOpacity="0.7"/>
        {/* Jewels */}
        <circle cx="16" cy="11" r="2" fill="white" fillOpacity="0.55"/>
        <circle cx="5.5" cy="15.5" r="1.5" fill="white" fillOpacity="0.45"/>
        <circle cx="26.5" cy="15.5" r="1.5" fill="white" fillOpacity="0.45"/>
        {/* Shine on top point */}
        <ellipse cx="14.5" cy="9.5" rx="1.5" ry="0.8" fill="white" fillOpacity="0.5" transform="rotate(-20 14.5 9.5)"/>
      </svg>
    );

    // Lightning bolt — bold bolt
    case 4: return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
        <path d="M20,3 L9,18 L16,18 L12,29 L23,14 L16,14 Z" fill="white" fillOpacity="0.93"/>
        {/* Shine */}
        <path d="M19,4 L13,13 L17,13 L14,22 L20,13 L16,13 Z" fill="white" fillOpacity="0.35"/>
      </svg>
    );

    // Cat face
    case 5: return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
        {/* Ears */}
        <path d="M7,16 L4,6 L13,12 Z" fill="white" fillOpacity="0.9"/>
        <path d="M25,16 L28,6 L19,12 Z" fill="white" fillOpacity="0.9"/>
        {/* Inner ear */}
        <path d="M8,14 L6,8 L12,12 Z" fill="white" fillOpacity="0.35"/>
        <path d="M24,14 L26,8 L20,12 Z" fill="white" fillOpacity="0.35"/>
        {/* Head circle */}
        <circle cx="16" cy="19" r="11" fill="white" fillOpacity="0.92"/>
        {/* Eyes */}
        <ellipse cx="12" cy="18" rx="1.8" ry="2.2" fill="white" fillOpacity="0.4"/>
        <ellipse cx="20" cy="18" rx="1.8" ry="2.2" fill="white" fillOpacity="0.4"/>
        {/* Nose tiny triangle */}
        <path d="M15,22 L16,21 L17,22 L16,23 Z" fill="white" fillOpacity="0.5"/>
        {/* Whiskers */}
        <line x1="4" y1="21" x2="12" y2="22" stroke="white" strokeWidth="1" strokeOpacity="0.4"/>
        <line x1="20" y1="22" x2="28" y2="21" stroke="white" strokeWidth="1" strokeOpacity="0.4"/>
        <line x1="5" y1="24" x2="12" y2="23.5" stroke="white" strokeWidth="0.8" strokeOpacity="0.3"/>
        <line x1="20" y1="23.5" x2="27" y2="24" stroke="white" strokeWidth="0.8" strokeOpacity="0.3"/>
      </svg>
    );

    // Diamond / gem
    case 6: return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
        {/* Top part */}
        <path d="M16,3 L7,13 L25,13 Z" fill="white" fillOpacity="0.93"/>
        {/* Bottom part */}
        <path d="M7,13 L16,29 L25,13 Z" fill="white" fillOpacity="0.75"/>
        {/* Facet lines */}
        <line x1="16" y1="3" x2="7" y2="13" stroke="white" strokeWidth="0.5" strokeOpacity="0.5"/>
        <line x1="16" y1="3" x2="25" y2="13" stroke="white" strokeWidth="0.5" strokeOpacity="0.5"/>
        <line x1="7" y1="13" x2="16" y2="13" stroke="white" strokeWidth="0.5" strokeOpacity="0.4"/>
        <line x1="16" y1="13" x2="25" y2="13" stroke="white" strokeWidth="0.5" strokeOpacity="0.4"/>
        {/* Shine */}
        <path d="M11,7 L9,13 L14,13 Z" fill="white" fillOpacity="0.35"/>
      </svg>
    );

    // Shield with star
    case 7: return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
        {/* Shield */}
        <path d="M16,3 L7,7 L7,17 C7,23 11,28 16,30 C21,28 25,23 25,17 L25,7 Z" fill="white" fillOpacity="0.92"/>
        {/* Mini star inside */}
        <path d="M16,10 L17.4,14 L21.5,14.2 L18.4,16.8 L19.5,21 L16,18.8 L12.5,21 L13.6,16.8 L10.5,14.2 L14.6,14 Z"
          fill="white" fillOpacity="0.45"/>
        {/* Shine */}
        <path d="M10,7 L8,14 C8,14 9,8 10,7Z" fill="white" fillOpacity="0.3"/>
      </svg>
    );

    // Planet with ring
    case 8: return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
        {/* Ring */}
        <ellipse cx="16" cy="16" rx="14" ry="5" fill="none" stroke="white" strokeWidth="2.5" strokeOpacity="0.6"/>
        {/* Planet */}
        <circle cx="16" cy="16" r="9" fill="white" fillOpacity="0.92"/>
        {/* Surface detail */}
        <ellipse cx="13" cy="13" rx="3" ry="2" fill="white" fillOpacity="0.3" transform="rotate(-15 13 13)"/>
        <circle cx="20" cy="18" r="2" fill="white" fillOpacity="0.2"/>
        {/* Ring front (over planet) */}
        <path d="M2,16 C2,13 7,13.5 16,16 C25,18.5 30,19 30,16" fill="none" stroke="white" strokeWidth="2.5" strokeOpacity="0.6"/>
      </svg>
    );

    // Fire flame
    case 9: return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
        {/* Main flame */}
        <path d="M16,3 C16,3 22,9 22,15 C22,19 19,21 19,21 C19,21 20,17 17,15 C17,15 18,20 15,23 C15,23 16,19 13,18 C10,17 9,21 10,24 C8,22 8,18 11,14 C11,14 9,16 9,18 C9,18 7,14 11,10 C11,10 10,13 13,13 C13,13 12,8 16,3 Z"
          fill="white" fillOpacity="0.92"/>
        {/* Inner glow */}
        <path d="M16,11 C16,11 19,15 19,18 C19,20 17.5,22 17.5,22 C17.5,22 18,19 16,17 C16,17 16.5,20 14.5,22 C13,20 13,17 15,15 C15,15 13,16 13,18 C12,16 13,13 16,11 Z"
          fill="white" fillOpacity="0.4"/>
      </svg>
    );

    default: return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" fill="white" fillOpacity="0.8"/>
      </svg>
    );
  }
}

// ─── AvatarIcon component ─────────────────────────────────
interface AvatarIconProps {
  id: number;
  size?: number;
  borderRadius?: number;
  className?: string;
  style?: React.CSSProperties;
  showShadow?: boolean;
}

export function AvatarIcon({ id, size = 44, borderRadius, showShadow = true, className, style }: AvatarIconProps) {
  const def = AVATARS.find(a => a.id === id) ?? AVATARS[0];
  const r = borderRadius ?? Math.round(size * 0.28);
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: def.bg,
        boxShadow: showShadow ? `0 4px 14px ${def.shadow}` : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      <AvatarSVG id={id} size={Math.round(size * 0.62)} />
    </div>
  );
}
