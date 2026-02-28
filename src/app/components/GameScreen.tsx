import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, Pause, Play, Zap, Check, X, Plus, RefreshCcw } from "lucide-react";
import { CharacterSVG } from "./CharacterSVG";
import { FloatingSymbols } from "./FloatingSymbols";

const C = { purple: "#6272A4", orange: "#D87233", teal: "#5CA7AD" };
const ROUND_SIZE = 5;

// ─── Skill Levels ─────────────────────────────────────────
const SKILL_LEVELS = [
  { name: "Новичок", minScore: 0, color: "#9AA0AA", num: 1 },
  { name: "Начинающий", minScore: 50, color: "#4CAF50", num: 2 },
  { name: "Соображайка", minScore: 200, color: C.teal, num: 3 },
  { name: "Умник", minScore: 500, color: C.purple, num: 4 },
  { name: "Мастер", minScore: 1000, color: C.orange, num: 5 },
  { name: "Профи", minScore: 2000, color: "#E85D5D", num: 6 },
  { name: "Эксперт", minScore: 4000, color: "#9B59B6", num: 7 },
  { name: "Гений", minScore: 8000, color: "#D4A017", num: 8 },
];

function getSkill(score: number) {
  let idx = 0;
  for (let i = 0; i < SKILL_LEVELS.length; i++) {
    if (score >= SKILL_LEVELS[i].minScore) idx = i;
  }
  const current = SKILL_LEVELS[idx];
  const next = idx + 1 < SKILL_LEVELS.length ? SKILL_LEVELS[idx + 1] : null;
  const pct = next
    ? ((score - current.minScore) / (next.minScore - current.minScore)) * 100
    : 100;
  return { current, next, pct: Math.min(pct, 100) };
}

// ─── Question Generator ───────────────────────────────────
interface Question { a: number; b: number; op: "+" | "−"; result: number }

const LEVEL_RANGES: Record<number, number[]> = {
  1: [],
  2: [10, 15, 20, 30, 50, 99],
  3: [50, 99],
  4: [200, 500, 999],
  5: [200, 500, 999],
  6: [2000, 5000, 9999],
};

function generateQuestion(levelId: number, rangeInput: number): Question {
  const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  let activeRange = rangeInput;
  if (rangeInput === -1) {
    const opts = LEVEL_RANGES[levelId];
    if (opts && opts.length > 0) {
      activeRange = opts[rand(0, opts.length - 1)];
    }
  }

  let a: number, b: number, op: "+" | "−";

  switch (levelId) {
    case 1: a = rand(1, 9); b = rand(1, 9); op = Math.random() < 0.5 ? "+" : "−"; break;
    case 2: a = rand(Math.max(10, Math.ceil(activeRange * 0.4)), activeRange); b = rand(1, 9); op = Math.random() < 0.5 ? "+" : "−"; break;
    case 3: a = rand(10, activeRange); b = rand(10, Math.floor(activeRange * 0.75)); op = Math.random() < 0.5 ? "+" : "−"; break;
    case 4: a = rand(100, activeRange); b = rand(10, Math.floor(activeRange * 0.4)); op = Math.random() < 0.5 ? "+" : "−"; break;
    case 5: a = rand(100, activeRange); b = rand(50, Math.floor(activeRange * 0.6)); op = Math.random() < 0.5 ? "+" : "−"; break;
    case 6: a = rand(1000, activeRange); b = rand(100, Math.floor(activeRange * 0.35)); op = Math.random() < 0.5 ? "+" : "−"; break;
    default: a = rand(1, 9); b = rand(1, 9); op = "+";
  }
  if (op === "−" && a < b) [a, b] = [b, a];
  return { a, b, op, result: op === "+" ? a + b : a - b };
}

function calcPoints(seconds: number, levelId: number) {
  const base = (levelId - 1) * 4 + 10;
  if (seconds <= 3) return base + 6;
  if (seconds <= 6) return base + 3;
  if (seconds <= 12) return base;
  return Math.max(base - 4, 4);
}

function fmtTime(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// ─── Star Badge ───────────────────────────────────────────
function StarBadge({ num, color }: { num: number; color: string }) {
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: 30, height: 30 }}>
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <path
          d="M15 3l2.83 6.17 6.84 0.93-4.97 4.72 1.16 6.68L15 18.27l-5.86 3.23 1.16-6.68L5.33 10.1l6.84-0.93L15 3z"
          fill={color}
          stroke={color}
          strokeWidth="0.5"
        />
      </svg>
      <span className="absolute" style={{ fontSize: 10, fontWeight: 900, color: "white", lineHeight: 1, marginTop: 1 }}>{num}</span>
    </div>
  );
}

// ─── Numpad Button ────────────────────────────────────────
function NumKey({ label, onClick, accent }: { label: React.ReactNode; onClick: () => void; accent?: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.88, y: 2 }}
      onClick={onClick}
      className="flex items-center justify-center rounded-2xl select-none"
      style={{
        height: 58,
        background: accent
          ? `linear-gradient(160deg, ${accent} 0%, ${accent}CC 100%)`
          : "white",
        boxShadow: accent
          ? `0 5px 16px ${accent}60, inset 0 1.5px 0 rgba(255,255,255,0.3)`
          : "0 4px 12px rgba(0,0,0,0.09), 0 1px 3px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
        border: "none",
        cursor: "pointer",
        fontSize: 22,
        fontWeight: 900,
        color: accent ? "white" : "#2E3545",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {label}
    </motion.button>
  );
}

// ─── Stat Row ─────────────────────────────────────────────
function StatRow({ label, right }: { label: string; right: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ fontSize: 13, color: "#8A929E", fontWeight: 700 }}>{label}</span>
      {right}
    </div>
  );
}

// ─── Round Result Icon ────────────────────────────────────
function RoundResultIcon({ correct }: { correct: number }) {
  if (correct === ROUND_SIZE) {
    // Perfect — proper 5-pointed star with rays
    return (
      <svg width="58" height="58" viewBox="0 0 52 52" fill="none">
        {/* Glow circle */}
        <circle cx="26" cy="26" r="26" fill="rgba(255,210,51,0.2)" />
        {/* Rays */}
        {([
          [26, 2, 26, 7], [26, 45, 26, 50], [2, 26, 7, 26], [45, 26, 50, 26],
          [7, 7, 10.5, 10.5], [41.5, 7, 38, 10.5],
        ] as number[][]).map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#FFD233" strokeWidth="2.5" strokeLinecap="round" />
        ))}
        {/* Mathematically correct 5-point star (outer r=17, inner r=7, center 26,26) */}
        <path
          d="M26,9 L30.12,20.34 L42.17,20.75 L32.66,28.16 L35.99,39.75 L26,33 L16.01,39.75 L19.34,28.16 L9.83,20.75 L21.88,20.34 Z"
          fill="#FFD233" stroke="#D4A017" strokeWidth="1.2" strokeLinejoin="round"
        />
        {/* Shine highlight */}
        <ellipse cx="22" cy="18" rx="3" ry="1.8" fill="white" opacity="0.5" transform="rotate(-25 22 18)" />
      </svg>
    );
  }
  if (correct >= 3) {
    // Good — thumbs up
    return (
      <svg width="58" height="58" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="26" fill="rgba(255,210,51,0.15)" />
        {/* Thumb body */}
        <path d="M18,26 L25,11 C26.5,11 30,13 30,18 L30,22 L39,22 C41,22 43,23.5 42.5,26.5 L39.5,39 C39,41 37,42 35,42 L18,42 Z"
          fill="#FFD233" stroke="#D4A017" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Base rectangle */}
        <rect x="10" y="26" width="8" height="16" rx="3" fill="#E8B800" stroke="#D4A017" strokeWidth="1" />
        {/* Shine */}
        <ellipse cx="26" cy="16" rx="2.5" ry="4" fill="white" opacity="0.35" transform="rotate(-10 26 16)" />
      </svg>
    );
  }
  // Keep going — lightning bolt
  return (
    <svg width="58" height="58" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="26" fill="rgba(216,114,51,0.15)" />
      <path d="M31,8 L14,29 L23,29 L21,44 L38,23 L29,23 L31,8 Z"
        fill="#D87233" stroke="#B05C1A" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M31,8 L14,29 L23,29 L21,44 L38,23 L29,23 L31,8 Z"
        fill="url(#boltG)" fillOpacity="0.4" />
      <defs>
        <linearGradient id="boltG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD93D" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Round Complete ────────────────────────────────────────
function RoundComplete({
  correct, pointsEarned, totalScore, skill, onContinue, onMenu,
}: {
  correct: number; pointsEarned: number; totalScore: number;
  skill: typeof SKILL_LEVELS[0]; onContinue: () => void; onMenu: () => void;
}) {
  const title = correct === ROUND_SIZE ? "Идеально!" : correct >= 3 ? "Отлично!" : "Продолжай!";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-end justify-center z-50 pb-8 px-5"
      style={{ background: "rgba(50,60,100,0.5)", backdropFilter: "blur(12px)" }}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
        className="w-full rounded-3xl overflow-hidden"
        style={{ background: "white", boxShadow: "0 24px 64px rgba(0,0,0,0.22)" }}
      >
        <div className="flex flex-col items-center py-6 gap-1" style={{ background: `linear-gradient(135deg, ${C.teal}, #3A9198)` }}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.15 }}
          >
            <RoundResultIcon correct={correct} />
          </motion.div>
          <p className="m-0 text-white" style={{ fontSize: 22, fontWeight: 900 }}>{title}</p>
          <p className="m-0 text-white" style={{ fontSize: 13, opacity: 0.85 }}>
            {correct} из {ROUND_SIZE} правильных ответов
          </p>
          <div className="flex gap-2 mt-2">
            {Array.from({ length: ROUND_SIZE }).map((_, i) => (
              <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"
                  fill={i < correct ? "#FFD233" : "rgba(255,255,255,0.3)"}
                  stroke={i < correct ? "#E8B800" : "rgba(255,255,255,0.2)"} strokeWidth="1" />
              </svg>
            ))}
          </div>
        </div>
        <div className="px-5 py-4 flex flex-col gap-2.5">
          <StatRow label="Заработано:" right={
            <div className="flex items-center gap-1.5">
              <Zap size={16} color={C.orange} fill={C.orange} />
              <span style={{ fontSize: 20, fontWeight: 900, color: C.orange }}>+{pointsEarned}</span>
            </div>
          } />
          <StatRow label="Всего очков:" right={
            <span style={{ fontSize: 16, fontWeight: 900, color: C.purple }}>{totalScore.toLocaleString("ru")}</span>
          } />
          <StatRow label="Звание:" right={
            <div className="flex items-center gap-2">
              <StarBadge num={skill.num} color={skill.color} />
              <span style={{ fontSize: 15, fontWeight: 900, color: skill.color }}>{skill.name}</span>
            </div>
          } />
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={onMenu} className="flex-1 rounded-2xl py-3.5"
            style={{ background: "#F2F4F8", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 800, color: "#6B7A8D", fontFamily: "'Nunito', sans-serif" }}>
            В меню
          </button>
          <button
            onClick={onContinue}
            className="flex-[2] rounded-2xl py-3.5 flex items-center justify-center gap-2"
            style={{ background: C.orange, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 900, color: "white", fontFamily: "'Nunito', sans-serif", boxShadow: `0 5px 16px ${C.orange}55` }}
          >
            <RefreshCcw size={16} color="white" strokeWidth={2.5} />
            Ещё раз!
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────
interface GameScreenProps {
  levelId: number;
  levelName: string;
  range: number;
  totalScore: number;
  onBack: () => void;
  onScoreUpdate: (s: number) => void;
  onCorrectAnswer: (isQuick: boolean) => void;
  onWrongAnswer: () => void;
  onRoundComplete: (isPerfect: boolean) => void;
}

export function GameScreen({ levelId, levelName, range, totalScore, onBack, onScoreUpdate, onCorrectAnswer, onWrongAnswer, onRoundComplete }: GameScreenProps) {
  const [score, setScore] = useState(totalScore);
  const [answer, setAnswer] = useState("");
  const [qIdx, setQIdx] = useState(0);
  const [question, setQuestion] = useState<Question>(() => generateQuestion(levelId, range));
  const [timer, setTimer] = useState(0);
  const [feedback, setFeedback] = useState<null | "correct" | "wrong">(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showRound, setShowRound] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [scoreAtStart, setScoreAtStart] = useState(totalScore);

  // Track whether current round has been perfect (no wrong answers)
  const isPerfectRef = useRef(true);

  useEffect(() => {
    if (feedback || showRound || isPaused) return;
    const id = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [feedback, showRound, isPaused]);

  const nextQ = useCallback((isLast: boolean) => {
    setAnswer(""); setFeedback(null); setTimer(0);
    if (isLast) {
      setShowRound(true);
      onRoundComplete(isPerfectRef.current);
    }
    else { setQIdx(n => n + 1); setQuestion(generateQuestion(levelId, range)); }
  }, [levelId, range, onRoundComplete]);

  const handleOK = useCallback(() => {
    if (!answer || feedback || showRound) return;
    const isCorrect = parseInt(answer, 10) === question.result;
    if (isCorrect) {
      const pts = calcPoints(timer, levelId);
      const ns = score + pts;
      setScore(ns); setCorrectCount(c => c + 1); onScoreUpdate(ns);
      onCorrectAnswer(timer <= 3);
    } else {
      isPerfectRef.current = false;
      onWrongAnswer();
    }
    setFeedback(isCorrect ? "correct" : "wrong");
    setTimeout(() => nextQ(qIdx === ROUND_SIZE - 1), isCorrect ? 550 : 1100);
  }, [answer, feedback, showRound, question.result, timer, levelId, score, onScoreUpdate, onCorrectAnswer, onWrongAnswer, qIdx, nextQ]);

  const pushDigit = (d: string) => { if (!feedback && !showRound) setAnswer(a => a.length >= 5 ? a : a + d); };
  const clearAnswer = () => { if (!feedback && !showRound) setAnswer(""); };

  const handleNewRound = () => {
    isPerfectRef.current = true;
    setQIdx(0); setQuestion(generateQuestion(levelId, range));
    setAnswer(""); setFeedback(null); setTimer(0);
    setCorrectCount(0); setShowRound(false); setScoreAtStart(score);
  };

  const { current: skill, next: nextSkill, pct } = getSkill(score);
  const timerDanger = timer > 20;

  return (
    <div
      className="flex flex-col overflow-hidden relative"
      style={{ height: "100dvh", background: "#ECEFF6", fontFamily: "'Nunito', sans-serif" }}
    >
      <FloatingSymbols variant="game" opacity={0.13} />
      {/* ══════════════════════════════════════════════════
          TOP CARD
      ══════════════════════════════════════════════════ */}
      <div
        className="flex-shrink-0 px-5 pb-4"
        style={{
          background: "white",
          borderRadius: "0 0 28px 28px",
          boxShadow: "0 6px 28px rgba(0,0,0,0.08)",
          paddingTop: 48,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => { setIsPaused(true); setShowPause(true); }}
            className="flex items-center gap-2 rounded-2xl px-4 py-2.5 active:scale-95 transition-transform"
            style={{ background: "#F0F3F9", border: "none", cursor: "pointer", color: "#3A4050", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <rect width="16" height="2" rx="1" fill="#3A4050" />
              <rect y="5" width="16" height="2" rx="1" fill="#3A4050" />
              <rect y="10" width="16" height="2" rx="1" fill="#3A4050" />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 800 }}>Меню</span>
          </button>

          <button
            onClick={() => { setIsPaused(true); setShowPause(true); }}
            className="w-11 h-11 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            style={{ background: C.teal, boxShadow: `0 4px 14px ${C.teal}60`, border: "none", cursor: "pointer" }}
          >
            <Pause size={18} fill="white" color="white" />
          </button>
        </div>

        {/* Skill + Points */}
        <div className="flex items-start justify-between mb-2">
          {/* Skill level */}
          <div>
            <p className="m-0 mb-0.5" style={{ fontSize: 11, color: "#9AA0AA", fontWeight: 700 }}>Уровень навыка:</p>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 22, fontWeight: 900, color: skill.color }}>{skill.name}</span>
              <StarBadge num={skill.num} color={skill.color} />
            </div>
          </div>

          {/* Points */}
          <div className="text-right">
            <p className="m-0 mb-0.5" style={{ fontSize: 11, color: "#9AA0AA", fontWeight: 700 }}>Очки:</p>
            <div className="flex items-center gap-1.5 justify-end">
              <Zap size={18} color={C.orange} fill={C.orange} />
              <span style={{ fontSize: 22, fontWeight: 900, color: "#2E3545" }}>{score.toLocaleString("ru")}</span>
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#4CAF50" }}>
                <Plus size={10} color="white" strokeWidth={3.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full rounded-full overflow-hidden" style={{ height: 7, background: "#EEF1F7" }}>
          <motion.div
            className="h-full rounded-full"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
            style={{ background: skill.color }}
          />
        </div>
        {nextSkill && (
          <p className="m-0 mt-1 text-center" style={{ fontSize: 10, color: "#B0B6C4", fontWeight: 700 }}>
            {score.toLocaleString("ru")} / {nextSkill.minScore.toLocaleString("ru")}
          </p>
        )}

        {/* Expression */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`q-${qIdx}`}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 14 }}
            transition={{ duration: 0.2 }}
            className="m-0 mt-3 mb-3"
            style={{ fontSize: 44, fontWeight: 900, color: "#8A8FA8", letterSpacing: -1.5, lineHeight: 1 }}
          >
            {question.a} {question.op} {question.b} =
          </motion.p>
        </AnimatePresence>

        {/* Answer input */}
        <motion.div
          animate={feedback === "wrong" ? { x: [-7, 7, -7, 7, 0] } : { x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full rounded-2xl flex items-center px-4 mb-3 relative overflow-hidden"
          style={{
            height: 52,
            background: feedback === "correct"
              ? "rgba(76,175,80,0.07)"
              : feedback === "wrong"
                ? "rgba(232,93,93,0.07)"
                : "#F7F9FC",
            border: `2px solid ${feedback === "correct" ? "#4CAF50" : feedback === "wrong" ? "#E85D5D" : "#EAECF3"}`,
            transition: "border-color 0.2s, background 0.2s",
          }}
        >
          {/* Feedback icon inside */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: feedback === "correct" ? "#4CAF50" : "#E85D5D" }}
              >
                {feedback === "correct"
                  ? <Check size={20} color="white" strokeWidth={3} />
                  : <X size={20} color="white" strokeWidth={3} />
                }
              </motion.div>
            )}
          </AnimatePresence>

          <span style={{ fontSize: 26, fontWeight: 900, color: answer ? C.purple : "#CDD1DE", letterSpacing: 1 }}>
            {answer || ""}
          </span>

          {/* Wrong: show correct answer */}
          {feedback === "wrong" && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-3"
              style={{ fontSize: 14, color: "#E85D5D", fontWeight: 800 }}
            >
              → {question.result}
            </motion.span>
          )}
        </motion.div>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: ROUND_SIZE }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === qIdx ? 22 : 9,
                background: i < qIdx ? C.teal : i === qIdx ? C.orange : "#D8DCE9",
              }}
              transition={{ duration: 0.22 }}
              className="rounded-full"
              style={{ height: 9, flexShrink: 0 }}
            />
          ))}
          {/* Level chip */}
          <div className="ml-auto flex items-center gap-1">
            <div className="rounded-lg px-2 py-0.5" style={{ background: `${C.teal}18` }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: C.teal }}>{levelName}</span>
            </div>
            {range !== 0 && range !== 9 && (
              <div className="rounded-lg px-2 py-0.5" style={{ background: `${C.orange}15` }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: C.orange }}>
                  {range === -1 ? "Микс" : `до ${range.toLocaleString("ru")}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          CHARACTER — fills remaining space
      ══════════════════════════════════════════════════ */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center relative py-2">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="flex-1 min-h-0 flex items-center justify-center w-full">
            <CharacterSVG size="100%" />
          </div>
          {/* Shadow */}
          <motion.div
            animate={{ scaleX: [1, 0.75, 1], opacity: [0.35, 0.15, 0.35] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "min(100px, 15vh)",
              height: "min(14px, 2vh)",
              background: "radial-gradient(ellipse, rgba(60,140,150,0.4) 0%, transparent 75%)",
              borderRadius: "50%",
              flexShrink: 0,
              marginTop: 2
            }}
          />
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════
          NUMPAD
      ══════════════════════════════════════════════════ */}
      <div className="flex-shrink-0 px-4">
        <div
          className="grid gap-2.5"
          style={{ gridTemplateColumns: "repeat(5, 1fr) 1.15fr" }}
        >
          {/* Row 1: 1 2 3 4 5 | С */}
          {["1", "2", "3", "4", "5"].map(d => (
            <NumKey key={d} label={d} onClick={() => pushDigit(d)} />
          ))}
          <NumKey label="С" onClick={clearAnswer} accent={C.orange} />

          {/* Row 2: 6 7 8 9 0 | OK */}
          {["6", "7", "8", "9", "0"].map(d => (
            <NumKey key={d} label={d} onClick={() => pushDigit(d)} />
          ))}
          <NumKey label="OK" onClick={handleOK} accent={C.teal} />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          TIMER
      ══════════════════════════════════════════════════ */}
      <div className="flex-shrink-0 flex justify-center items-center" style={{ paddingTop: 10, paddingBottom: "max(20px, env(safe-area-inset-bottom, 20px))" }}>
        <div className="flex items-center gap-2">
          {timerDanger && (
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 0.65, repeat: Infinity }}
              className="w-2 h-2 rounded-full"
              style={{ background: "#E85D5D" }}
            />
          )}
          <span
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: timerDanger ? "#E85D5D" : "#B0B6C4",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: 2,
            }}
          >
            {fmtTime(timer)}
          </span>
          {timerDanger && (
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 0.65, repeat: Infinity, delay: 0.15 }}
              className="w-2 h-2 rounded-full"
              style={{ background: "#E85D5D" }}
            />
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          PAUSE OVERLAY
      ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showPause && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-50 px-6"
            style={{ background: "rgba(50,60,100,0.5)", backdropFilter: "blur(12px)" }}
          >
            <motion.div
              initial={{ scale: 0.88, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.88, y: 16 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="w-full rounded-3xl"
              style={{ background: "white", boxShadow: "0 24px 64px rgba(0,0,0,0.22)" }}
            >
              <div className="flex flex-col items-center px-6 py-8 gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `${C.teal}18` }}>
                  <Pause size={30} color={C.teal} />
                </div>
                <div className="text-center">
                  <p className="m-0" style={{ fontSize: 24, fontWeight: 900, color: C.purple }}>Пауза</p>
                  <p className="m-0 mt-1" style={{ fontSize: 12, color: "#9AA0AA", fontWeight: 700 }}>
                    Вопрос {qIdx + 1} из {ROUND_SIZE} · {score.toLocaleString("ru")} очков
                  </p>
                </div>
                <button
                  onClick={() => { setIsPaused(false); setShowPause(false); }}
                  className="w-full rounded-2xl py-4 flex items-center justify-center gap-2"
                  style={{ background: C.teal, border: "none", cursor: "pointer", color: "white", fontSize: 16, fontWeight: 900, fontFamily: "'Nunito', sans-serif", boxShadow: `0 5px 16px ${C.teal}55` }}
                >
                  <Play size={18} fill="white" color="white" />
                  Продолжить
                </button>
                <button
                  onClick={onBack}
                  className="w-full rounded-2xl py-3.5"
                  style={{ background: "#F2F4F8", border: "none", cursor: "pointer", color: "#6B7A8D", fontSize: 14, fontWeight: 800, fontFamily: "'Nunito', sans-serif" }}
                >
                  Выйти в меню
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════
          ROUND COMPLETE
      ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showRound && (
          <RoundComplete
            correct={correctCount}
            pointsEarned={score - scoreAtStart}
            totalScore={score}
            skill={skill}
            onContinue={handleNewRound}
            onMenu={onBack}
          />
        )}
      </AnimatePresence>
    </div>
  );
}