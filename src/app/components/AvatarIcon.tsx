import React from "react";

export interface AvatarDef {
  id: number;
  label: string;
  bg: string;
  shadow: string;
  isImage?: boolean;
  src?: string;
}

const GIRL_OFF_IDS = Array.from({ length: 20 }, (_, i) => i + 1);
const GIRL_ON_IDS = [6, 8, 9, 10, 15, 16, 17, 18, 19, 26, 27, 28, 29, 30, 31, 32, 37, 38, 39, 40];

export const AVATARS: AvatarDef[] = [
  ...GIRL_OFF_IDS.map((n, i) => ({
    id: i,
    label: `Персонаж ${i + 1}`,
    bg: "linear-gradient(135deg, #E2E8F0 0%, #CCD3E0 100%)",
    shadow: "rgba(148,163,184,0.4)",
    isImage: true,
    src: `/avatars/Girl=Off, Avatar=${String(n).padStart(2, "0")}.svg`
  })),
  ...GIRL_ON_IDS.map((n, i) => ({
    id: 20 + i,
    label: `Персонаж ${21 + i}`,
    bg: "linear-gradient(135deg, #E2E8F0 0%, #CCD3E0 100%)",
    shadow: "rgba(148,163,184,0.4)",
    isImage: true,
    src: `/avatars/Girl=On, Avatar=${String(n).padStart(2, "0")}.svg`
  }))
];

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
        overflow: "hidden", // In case image goes out of bounds
        ...style,
      }}
    >
      {def.isImage && def.src ? (
        <img src={def.src} alt={def.label} style={{ width: "90%", height: "90%", objectFit: "contain", transform: "translateY(5%)" }} />
      ) : null}
    </div>
  );
}
