import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { AVATARS, AvatarIcon } from "./AvatarIcon";

const C = { purple: "#6272A4", orange: "#D87233", teal: "#5CA7AD" };

interface AvatarPickerProps {
  visible: boolean;
  currentId: number;
  onSelect: (id: number) => void;
  onClose: () => void;
}

export function AvatarPicker({ visible, currentId, onSelect, onClose }: AvatarPickerProps) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 z-40"
            style={{ background: "rgba(20,30,55,0.55)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
          />

          {/* Bottom sheet — constrained height */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", bounce: 0.22, duration: 0.5 }}
            className="absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl flex flex-col"
            style={{
              background: "white",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
              maxHeight: "80dvh",
            }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-9 h-1 rounded-full" style={{ background: "#DDE1EC" }} />
            </div>

            {/* Header */}
            <div className="px-5 pt-1 pb-3 flex-shrink-0">
              <h2 className="m-0 text-center" style={{ fontSize: 19, fontWeight: 900, color: C.purple }}>
                Выбери аватар
              </h2>
              <p className="m-0 mt-0.5 text-center" style={{ fontSize: 11, color: "#9AA0AA", fontWeight: 700 }}>
                Нажми на понравившийся
              </p>
            </div>

            {/* Scrollable avatar grid */}
            <div className="flex-1 overflow-y-auto px-4 pb-2">
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
              >
                {AVATARS.map((av) => {
                  const isSelected = av.id === currentId;
                  return (
                    <motion.button
                      key={av.id}
                      onClick={() => onSelect(av.id)}
                      whileTap={{ scale: 0.88 }}
                      className="flex flex-col items-center gap-1 rounded-xl p-1.5 relative"
                      style={{
                        background: isSelected ? `${C.teal}15` : "transparent",
                        border: `2px solid ${isSelected ? C.teal : "transparent"}`,
                        cursor: "pointer",
                      }}
                    >
                      {/* Avatar icon */}
                      <div className="relative">
                        <AvatarIcon
                          id={av.id}
                          size={46}
                          showShadow={isSelected}
                          style={isSelected ? { transform: "scale(1.05)" } : {}}
                        />
                        {/* Checkmark badge */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: C.teal, border: "2px solid white" }}
                          >
                            <Check size={10} color="white" strokeWidth={3} />
                          </motion.div>
                        )}
                      </div>
                      {/* Label */}
                      <span
                        style={{
                          fontSize: 8.5,
                          fontWeight: 800,
                          color: isSelected ? C.teal : "#9AA0AA",
                          fontFamily: "'Nunito', sans-serif",
                          lineHeight: 1,
                          textAlign: "center",
                        }}
                      >
                        {av.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Confirm button — always visible at bottom */}
            <div
              className="flex-shrink-0 px-5 pt-2 pb-6"
              style={{ borderTop: "1px solid #F0F3F9" }}
            >
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="w-full rounded-2xl py-3.5 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${C.teal}, #3D8F95)`,
                  border: "none",
                  cursor: "pointer",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 900,
                  fontFamily: "'Nunito', sans-serif",
                  boxShadow: `0 5px 18px rgba(92,167,173,0.45)`,
                }}
              >
                Готово
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
