import { motion } from "motion/react";

interface Sym { symbol: string; x: string; y: string; size: number; color: string; delay: number }

// Different layouts for different screens
const SETS: Record<string, Sym[]> = {
  default: [
    { symbol: "+",  x: "7%",  y: "7%",  size: 30, color: "#5CA7AD", delay: 0    },
    { symbol: "×",  x: "81%", y: "10%", size: 22, color: "#D87233", delay: 0.7  },
    { symbol: "÷",  x: "87%", y: "35%", size: 20, color: "#6272A4", delay: 1.3  },
    { symbol: "=",  x: "4%",  y: "42%", size: 24, color: "#D87233", delay: 0.4  },
    { symbol: "−",  x: "11%", y: "21%", size: 32, color: "#6272A4", delay: 1.0  },
    { symbol: "7",  x: "79%", y: "25%", size: 18, color: "#5CA7AD", delay: 1.6  },
    { symbol: "3",  x: "8%",  y: "60%", size: 16, color: "#5CA7AD", delay: 0.3  },
    { symbol: "9",  x: "83%", y: "62%", size: 14, color: "#6272A4", delay: 2.0  },
    { symbol: "²",  x: "70%", y: "78%", size: 20, color: "#D87233", delay: 0.5  },
  ],
  achievements: [
    { symbol: "★",  x: "6%",  y: "12%", size: 22, color: "#D87233", delay: 0    },
    { symbol: "+",  x: "84%", y: "8%",  size: 18, color: "#5CA7AD", delay: 0.5  },
    { symbol: "×",  x: "88%", y: "32%", size: 16, color: "#6272A4", delay: 1.1  },
    { symbol: "÷",  x: "5%",  y: "38%", size: 20, color: "#6272A4", delay: 0.8  },
    { symbol: "=",  x: "82%", y: "55%", size: 18, color: "#D87233", delay: 1.4  },
    { symbol: "5",  x: "7%",  y: "70%", size: 16, color: "#5CA7AD", delay: 0.2  },
    { symbol: "%",  x: "85%", y: "75%", size: 16, color: "#4CAF50", delay: 1.8  },
  ],
  profile: [
    { symbol: "+",  x: "8%",  y: "15%", size: 26, color: "#5CA7AD", delay: 0    },
    { symbol: "÷",  x: "83%", y: "12%", size: 20, color: "#6272A4", delay: 0.6  },
    { symbol: "=",  x: "6%",  y: "50%", size: 22, color: "#D87233", delay: 1.0  },
    { symbol: "×",  x: "86%", y: "40%", size: 18, color: "#D87233", delay: 0.3  },
    { symbol: "8",  x: "80%", y: "65%", size: 16, color: "#5CA7AD", delay: 1.5  },
    { symbol: "−",  x: "10%", y: "75%", size: 24, color: "#6272A4", delay: 0.8  },
  ],
  game: [
    { symbol: "+",  x: "5%",  y: "52%", size: 26, color: "#5CA7AD", delay: 0    },
    { symbol: "=",  x: "82%", y: "48%", size: 20, color: "#D87233", delay: 0.8  },
    { symbol: "×",  x: "4%",  y: "72%", size: 18, color: "#6272A4", delay: 1.4  },
    { symbol: "÷",  x: "84%", y: "68%", size: 16, color: "#6272A4", delay: 0.4  },
    { symbol: "−",  x: "6%",  y: "85%", size: 22, color: "#5CA7AD", delay: 1.0  },
    { symbol: "7",  x: "80%", y: "82%", size: 14, color: "#D87233", delay: 1.8  },
  ],
  levelSelect: [
    { symbol: "1",  x: "6%",  y: "6%",  size: 20, color: "#5CA7AD", delay: 0    },
    { symbol: "+",  x: "83%", y: "9%",  size: 26, color: "#6272A4", delay: 0.5  },
    { symbol: "÷",  x: "5%",  y: "35%", size: 20, color: "#D87233", delay: 1.0  },
    { symbol: "×",  x: "85%", y: "38%", size: 18, color: "#5CA7AD", delay: 0.7  },
    { symbol: "6",  x: "7%",  y: "68%", size: 16, color: "#6272A4", delay: 1.5  },
    { symbol: "=",  x: "81%", y: "72%", size: 18, color: "#D87233", delay: 0.2  },
  ],
};

interface FloatingSymbolsProps {
  variant?: keyof typeof SETS;
  opacity?: number;
}

export function FloatingSymbols({ variant = "default", opacity = 0.15 }: FloatingSymbolsProps) {
  const symbols = SETS[variant] ?? SETS.default;
  return (
    <>
      {symbols.map((s, i) => (
        <motion.div
          key={i}
          className="absolute select-none pointer-events-none"
          style={{
            left: s.x,
            top: s.y,
            fontSize: s.size,
            fontWeight: 900,
            color: s.color,
            opacity,
            fontFamily: "'Nunito', sans-serif",
          }}
          animate={{ y: [0, -(6 + (i % 3) * 4), 0], rotate: [0, (i % 2 === 0 ? 1 : -1) * 8, 0] }}
          transition={{
            duration: 3.5 + i * 0.45,
            repeat: Infinity,
            ease: "easeInOut",
            delay: s.delay,
          }}
        >
          {s.symbol}
        </motion.div>
      ))}
    </>
  );
}