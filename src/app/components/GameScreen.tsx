import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, Pause, Play, Zap, Check, X, Plus, RefreshCcw } from "lucide-react";
import { CharacterSVG } from "./CharacterSVG";
import { FloatingSymbols } from "./FloatingSymbols";
import { SoundManager } from "../../utils/SoundManager";

import { getSkillLevel, SkillLevel } from "../utils/skillLevels";

const C = { purple: "#6272A4", orange: "#D87233", teal: "#5CA7AD" };

function getRoundSize(levelId: number, opType: "sum" | "mult" = "sum") {
  if (opType === "mult") return levelId === 10 ? 20 : 8;
  switch (levelId) {
    case 1: return 5;
    case 2: return 10;
    case 3: return 15;
    case 4: return 20;
    case 5: return 25;
    case 6: return 30;
    default: return 5;
  }
}

// ─── Question Generator ───────────────────────────────────
interface Question { a: number; b: number; op: "+" | "−" | "×"; result: number }
interface RoundHistoryItem { a: number; b: number; op: string; result: number; answer: string; correct: boolean; time: number }

const LEVEL_RANGES: Record<number, number[]> = {
  1: [],
  2: [10, 15, 20, 30, 50, 99],
  3: [50, 99],
  4: [200, 500, 999],
  5: [200, 500, 999],
  6: [2000, 5000, 9999],
};

function generateQuestion(levelId: number, rangeInput: number, opType: "sum" | "mult" = "sum"): Question {
  const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Sum / Sub logic
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

function generateRoundQuestions(levelId: number, rangeInput: number, opType: "sum" | "mult" = "sum", roundSize: number): Question[] {
  if (opType === "sum") {
    return Array.from({ length: roundSize }).map(() => generateQuestion(levelId, rangeInput, opType));
  }

  // Multiplication
  let questions: Question[] = [];
  if (levelId === 10) { // MIX
    const allOpt: Question[] = [];
    for (let a = 2; a <= 9; a++) {
      for (let b = 2; b <= 9; b++) {
        allOpt.push({ a, b, op: "×", result: a * b });
      }
    }
    allOpt.sort(() => Math.random() - 0.5);
    questions = allOpt.slice(0, roundSize);
  } else {
    // Specific table: exactly 8 questions (x2 to x9)
    for (let b = 2; b <= 9; b++) {
      let a = levelId;
      let bVal = b;
      // Randomly swap a and b for variety (e.g. 5x2 vs 2x5)
      if (Math.random() > 0.5) [a, bVal] = [bVal, a];
      questions.push({ a, b: bVal, op: "×", result: a * bVal });
    }
    // Shuffle the 8 questions
    questions.sort(() => Math.random() - 0.5);
  }
  return questions;
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
function RoundResultIcon({ correct, roundSize }: { correct: number; roundSize: number }) {
  if (correct === roundSize) {
    return <img src="/icons/star-struck-svgrepo-com.svg" width="64" height="64" alt="Идеально" />;
  }
  if (correct >= Math.floor(roundSize * 0.6)) {
    return <img src="/icons/smiling-face-with-sunglasses-svgrepo-com.svg" width="64" height="64" alt="Отлично" />;
  }
  return <img src="/icons/upside-down-face-svgrepo-com.svg" width="64" height="64" alt="Продолжай" />;
}

// ─── Round Complete ────────────────────────────────────────
function RoundComplete({
  correct, pointsEarned, totalScore, levelsCompleted, skill, hasNextLevel, history, roundSize, onContinue, onNextLevel, onMenu,
}: {
  correct: number; pointsEarned: number; totalScore: number; levelsCompleted: number[];
  skill: SkillLevel; hasNextLevel: boolean; history: RoundHistoryItem[]; roundSize: number; onContinue: () => void; onNextLevel: () => void; onMenu: () => void;
}) {
  const title = correct === roundSize ? "Идеально!" : correct >= Math.floor(roundSize * 0.6) ? "Отлично!" : "Продолжай!";

  // Calculate Old and New Percentages for the EXP bar
  const startScore = totalScore - pointsEarned;
  const oldSkillData = getSkillLevel(startScore, levelsCompleted);
  const newSkillData = getSkillLevel(totalScore, levelsCompleted);

  const [showHistory, setShowHistory] = useState(false);

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
            <RoundResultIcon correct={correct} roundSize={roundSize} />
          </motion.div>
          <p className="m-0 text-white" style={{ fontSize: 22, fontWeight: 900 }}>{title}</p>
          <p className="m-0 text-white" style={{ fontSize: 13, opacity: 0.85 }}>
            {correct} из {roundSize} правильных ответов
          </p>
          <div className="flex gap-1.5 mt-2 flex-wrap justify-center w-full max-w-[85%]">
            {Array.from({ length: roundSize }).map((_, i) => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"
                  fill={i < correct ? "#FFD233" : "rgba(255,255,255,0.3)"}
                  stroke={i < correct ? "#E8B800" : "rgba(255,255,255,0.2)"} strokeWidth="1" />
              </svg>
            ))}
          </div>
        </div>
        <div className="px-5 py-4 flex flex-col gap-2.5">
          {/* Animated Score Bar */}
          <div className="bg-white rounded-2xl p-4 flex flex-col gap-3" style={{ border: "1px solid #EAECF3", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 13, color: "#8A929E", fontWeight: 800 }}>Прогресс ранга</span>
              <div className="flex items-center gap-1.5">
                <Zap size={14} color={C.orange} fill={C.orange} />
                <span style={{ fontSize: 16, fontWeight: 900, color: C.orange }}>+{pointsEarned}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-1 mb-1">
              <span style={{ fontSize: 14, fontWeight: 900, color: oldSkillData.current.color }}>{oldSkillData.current.name}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#2E3545" }}>{totalScore.toLocaleString("ru")} {(oldSkillData.next || newSkillData.next) ? `/ ${(oldSkillData.next || newSkillData.next)!.minScore.toLocaleString("ru")}` : ""}</span>
            </div>

            <div className="w-full rounded-full overflow-hidden relative bg-[#EEF1F7]" style={{ height: 10 }}>
              {/* If rank up happened, we could do a complex animation, but for simplicity we animate to the new pct. 
                  If we leveled up, the new pct might be lower than the old pct visually. */}
              <motion.div
                className="h-full rounded-full absolute left-0 top-0"
                initial={{ width: `${oldSkillData.current.name !== newSkillData.current.name ? 0 : oldSkillData.pct}%` }}
                animate={{ width: `${newSkillData.pct}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                style={{ background: newSkillData.current.color }}
              />
            </div>
          </div>
        </div>

        {/* History Table or Toggle Button */}
        {history.length > 0 && (
          <div className="px-5 pb-2">
            {!showHistory ? (
              <button
                onClick={() => setShowHistory(true)}
                className="w-full rounded-2xl py-3 flex items-center justify-center gap-2"
                style={{ background: "#F2F4F8", border: "1.5px solid #EAECF3", cursor: "pointer", fontSize: 14, fontWeight: 800, color: "#6B7A8D", fontFamily: "'Nunito', sans-serif" }}
              >
                Посмотреть примеры
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="#6B7A8D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <span style={{ fontSize: 13, color: "#8A929E", fontWeight: 800, marginLeft: 4 }}>История раунда:</span>
                <div className="mt-2 flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
                  {history.map((h, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl px-4 py-2.5" style={{ background: h.correct ? "rgba(76,175,80,0.08)" : "rgba(232,93,93,0.08)" }}>
                      <div className="flex items-center gap-3">
                        {h.correct ? <Check size={16} strokeWidth={3} color="#4CAF50" /> : <X size={16} strokeWidth={3} color="#E85D5D" />}
                        <span style={{ fontSize: 16, fontWeight: 800, color: "#2E3545", letterSpacing: 0.5 }}>
                          {h.a} {h.op} {h.b} = <span style={{ color: h.correct ? "#4CAF50" : "#E85D5D" }}>{h.answer || "?"}</span>
                        </span>
                      </div>
                      {!h.correct && (
                        <span style={{ fontSize: 14, fontWeight: 900, color: "#E85D5D" }}>({h.result})</span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

        <div className="px-5 pb-5 pt-3 flex flex-col gap-3">
          {hasNextLevel && (
            <button
              onClick={onNextLevel}
              className="w-full rounded-2xl py-3.5 flex items-center justify-center gap-2"
              style={{ background: C.orange, border: "none", cursor: "pointer", fontSize: 16, fontWeight: 900, color: "white", fontFamily: "'Nunito', sans-serif", boxShadow: `0 5px 16px ${C.orange}55` }}
            >
              Следующий уровень
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          <div className="flex gap-3">
            <button onClick={onMenu} className="flex-1 rounded-2xl py-3.5"
              style={{ background: "#F2F4F8", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 800, color: "#6B7A8D", fontFamily: "'Nunito', sans-serif" }}>
              В меню
            </button>
            <button
              onClick={onContinue}
              className="flex-[2] rounded-2xl py-3.5 flex items-center justify-center gap-2"
              style={{ background: hasNextLevel ? C.teal : C.orange, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 900, color: "white", fontFamily: "'Nunito', sans-serif", boxShadow: `0 5px 16px ${hasNextLevel ? C.teal : C.orange}55` }}
            >
              <RefreshCcw size={16} color="white" strokeWidth={2.5} />
              Ещё раз!
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────
interface GameScreenProps {
  levelId: number;
  operation?: "sum" | "mult";
  levelName: string;
  range: number;
  totalScore: number;
  levelsCompleted: number[];
  onBack: () => void;
  onScoreUpdate: (s: number) => void;
  onCorrectAnswer: (isQuick: boolean) => void;
  onWrongAnswer: () => void;
  onRoundComplete: (isPerfect: boolean) => void;
  hasNextLevel: boolean;
  onNextLevel: () => void;
}

export function GameScreen({ levelId, operation = "sum", levelName, range, totalScore, levelsCompleted, hasNextLevel, onBack, onScoreUpdate, onCorrectAnswer, onWrongAnswer, onRoundComplete, onNextLevel }: GameScreenProps) {
  const roundSize = getRoundSize(levelId, operation);

  const [score, setScore] = useState(totalScore);
  const [answer, setAnswer] = useState("");
  const [qIdx, setQIdx] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(() => generateRoundQuestions(levelId, range, operation, roundSize));
  const [timer, setTimer] = useState(0);
  const [feedback, setFeedback] = useState<null | "correct" | "wrong">(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [history, setHistory] = useState<RoundHistoryItem[]>([]);
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
      SoundManager.playRoundComplete();
      onRoundComplete(isPerfectRef.current);
    }
    else { setQIdx(n => n + 1); }
  }, [onRoundComplete]);

  const handleOK = useCallback(() => {
    if (!answer || feedback || showRound) return;
    const currentQ = questions[qIdx];
    const isCorrect = parseInt(answer, 10) === currentQ.result;
    if (isCorrect) {
      const pts = calcPoints(timer, levelId);
      const ns = score + pts;
      setScore(ns); setCorrectCount(c => c + 1); onScoreUpdate(ns);
      onCorrectAnswer(timer <= 3);
      if (qIdx < roundSize - 1) SoundManager.playSuccess();
    } else {
      isPerfectRef.current = false;
      onWrongAnswer();
      SoundManager.playError();
    }
    setHistory(h => [...h, {
      a: currentQ.a, b: currentQ.b, op: currentQ.op, result: currentQ.result,
      answer, correct: isCorrect, time: timer
    }]);
    setFeedback(isCorrect ? "correct" : "wrong");
    setTimeout(() => nextQ(qIdx === roundSize - 1), isCorrect ? 550 : 1100);
  }, [answer, feedback, showRound, questions, qIdx, timer, levelId, score, onScoreUpdate, onCorrectAnswer, onWrongAnswer, nextQ, roundSize]);

  const pushDigit = (d: string) => {
    if (!feedback && !showRound) {
      SoundManager.playClick();
      setAnswer(a => a.length >= 5 ? a : a + d);
    }
  };
  const clearAnswer = () => {
    if (!feedback && !showRound) {
      SoundManager.playClick();
      setAnswer("");
    }
  };

  const handleNewRound = () => {
    isPerfectRef.current = true;
    setQIdx(0); setQuestions(generateRoundQuestions(levelId, range, operation, roundSize));
    setAnswer(""); setFeedback(null); setTimer(0);
    setCorrectCount(0); setHistory([]); setShowRound(false); setScoreAtStart(score);
  };

  const { current: skill, next: nextSkill, pct } = getSkillLevel(score, levelsCompleted);
  const timerDanger = timer > 20;
  const question = questions[qIdx];

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
          paddingTop: "max(20px, env(safe-area-inset-top, 20px))",
        }}
      >
        {/* Compact Header: Progress | Pause */}
        <div className="flex items-center justify-between mb-4 gap-4">

          {/* Progress Center (Now spans more width) */}
          <div className="flex-1 flex flex-col items-stretch">
            <div className="flex items-center justify-between w-full mb-1.5 px-1">
              {/* Skill */}
              <div className="flex items-center gap-1.5">
                <StarBadge num={skill.num} color={skill.color} />
                <span style={{ fontSize: 16, fontWeight: 900, color: skill.color }}>{skill.name}</span>
              </div>
              {/* Points */}
              <div className="flex items-center gap-1">
                <span style={{ fontSize: 17, fontWeight: 900, color: "#2E3545" }}>{score.toLocaleString("ru")}</span>
                <Zap size={16} color={C.orange} fill={C.orange} />
              </div>
            </div>
            {/* Wider Progress bar */}
            <div className="w-full rounded-full overflow-hidden relative" style={{ height: 8, background: "#EEF1F7" }}>
              <motion.div
                className="h-full rounded-full absolute left-0 top-0"
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5 }}
                style={{ background: skill.color }}
              />
            </div>
          </div>

          {/* PAUSE */}
          <button
            onClick={() => { setIsPaused(true); setShowPause(true); }}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
            style={{ background: C.teal, boxShadow: `0 4px 14px ${C.teal}60`, border: "none", cursor: "pointer" }}
          >
            <Pause size={16} fill="white" color="white" />
          </button>
        </div>
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

        {/* Bottom Row: Dots | Timer | Level Info */}
        <div className="flex items-center justify-between mt-2 pt-1">
          {/* Left side group: Dots + Timer */}
          <div className="flex items-center gap-4 flex-1 overflow-hidden">
            {/* Dots */}
            <div className="flex items-center gap-1.5 flex-1 flex-wrap pl-1 max-w-[60%]">
              {Array.from({ length: roundSize }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: i === qIdx ? 16 : 6,
                    background: i < qIdx ? C.teal : i === qIdx ? C.orange : "#D8DCE9",
                  }}
                  transition={{ duration: 0.22 }}
                  className="rounded-full"
                  style={{ height: 6, flexShrink: 0 }}
                />
              ))}
            </div>

            {/* Timer (shifted left) */}
            <div className="flex items-center justify-end gap-2 px-1 py-1 rounded-xl flex-shrink-0" style={{ background: timerDanger ? `${C.orange}15` : "transparent" }}>
              {timerDanger && (
                <motion.div
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 0.65, repeat: Infinity }}
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: "#E85D5D" }}
                />
              )}
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  color: timerDanger ? "#E85D5D" : "#B0B6C4",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: 1,
                }}
              >
                {fmtTime(timer)}
              </span>
              <span style={{ fontSize: 13, fontWeight: 900, color: "#8A929E" }}>
                {qIdx + 1}/{roundSize}
              </span>
            </div>
          </div>

          {/* Level chip */}
          <div className="flex items-center gap-1 flex-1 justify-end">
            <div className="rounded-lg px-2 py-0.5" style={{ background: `${C.teal}18` }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: C.teal }}>{levelName}</span>
            </div>
            {range !== 0 && range !== 9 && range !== -1 && operation === "sum" && (
              <div className="rounded-lg px-2 py-0.5" style={{ background: `${C.orange}15` }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: C.orange }}>
                  до {range.toLocaleString("ru")}
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
        <div className="w-full h-full flex flex-col items-center justify-center pointer-events-none p-4">
          <div className="flex-1 min-h-0 flex items-center justify-center w-full" style={{ maxHeight: "35vh", transform: "scale(1.45)" }}>
            <CharacterSVG size="100%" />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          NUMPAD
      ══════════════════════════════════════════════════ */}
      <div className="flex-shrink-0 px-4" style={{ paddingBottom: "max(32px, env(safe-area-inset-bottom, 32px))" }}>
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
                    Вопрос {qIdx + 1} из {roundSize} · {score.toLocaleString("ru")} очков
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
            levelsCompleted={levelsCompleted}
            skill={skill}
            hasNextLevel={hasNextLevel}
            history={history}
            roundSize={roundSize}
            onContinue={handleNewRound}
            onNextLevel={onNextLevel}
            onMenu={onBack}
          />
        )}
      </AnimatePresence>
    </div>
  );
}