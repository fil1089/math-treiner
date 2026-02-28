import { motion } from "motion/react";
import { CharacterSVG } from "./CharacterSVG";

interface LevitatingCharacterProps {
  size?: number;
}

export function LevitatingCharacter({ size = 200 }: LevitatingCharacterProps) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "relative", zIndex: 2 }}
      >
        <CharacterSVG size={size} />
      </motion.div>

      {/* Pulsing shadow */}
      <motion.div
        animate={{
          scaleX: [1, 0.75, 1],
          opacity: [0.4, 0.18, 0.4],
        }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: size * 0.52,
          height: 14,
          background:
            "radial-gradient(ellipse, rgba(60,140,150,0.55) 0%, transparent 75%)",
          borderRadius: "50%",
          marginTop: -6,
        }}
      />
    </div>
  );
}
