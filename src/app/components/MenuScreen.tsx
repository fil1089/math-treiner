import { useState } from "react";
import { motion } from "motion/react";
import { Play, RotateCcw, Trophy, User, Volume2, VolumeX, Target, Zap } from "lucide-react";
import { LevitatingCharacter } from "./LevitatingCharacter";
import { FloatingSymbols } from "./FloatingSymbols";
import { AvatarIcon } from "./AvatarIcon";
import { SoundManager } from "../../utils/SoundManager";

const C = {
  purple: "#6272A4",
  orange: "#D87233",
  teal: "#5CA7AD",
};

interface MenuScreenProps {
  onNavigate: (screen: string) => void;
  canContinue: boolean;
  totalScore?: number;
  playerName?: string;
  avatarId?: number;
  skillName?: string;
  skillColor?: string;
  skillNum?: number;
  skillPct?: number;
  nextScore?: number;
  dailyQuest?: { date: string; count: number; claimed: boolean };
  onClaimDaily?: () => void;
}

export function MenuScreen({
  onNavigate,
  canContinue,
  totalScore = 0,
  playerName,
  avatarId = 0,
  skillName = "Новичок",
  skillColor = "#9AA0AA",
  skillNum = 1,
  skillPct = 0,
  nextScore = 0,
  dailyQuest = { date: "", count: 0, claimed: false },
  onClaimDaily,
}: MenuScreenProps) {
  const [soundOn, setSoundOn] = useState(SoundManager.isEnabled());

  const handleSoundToggle = () => {
    setSoundOn(SoundManager.toggle());
  };

  const buttons = [
    {
      label: "Начать",
      icon: <Play size={20} strokeWidth={2.5} />,
      bg: C.orange,
      shadow: "rgba(216,114,51,0.45)",
      action: () => onNavigate("levelSelect"),
      primary: true,
      disabled: false,
    },
    {
      label: "Продолжить",
      icon: <RotateCcw size={19} strokeWidth={2.5} />,
      bg: C.teal,
      shadow: "rgba(92,167,173,0.4)",
      action: () => onNavigate("game"),
      disabled: !canContinue,
    },
    {
      label: "Достижения",
      icon: <Trophy size={19} strokeWidth={2.5} />,
      bg: C.teal,
      shadow: "rgba(92,167,173,0.4)",
      action: () => onNavigate("achievements"),
      disabled: false,
    },
    {
      label: "Профиль",
      icon: <User size={19} strokeWidth={2.5} />,
      bg: C.purple,
      shadow: "rgba(98,114,164,0.4)",
      action: () => onNavigate("profile"),
      disabled: false,
    },
  ];

  return (
    <div
      className="flex flex-col min-h-[100dvh] w-full relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, #D8DDE6 0%, #CDD2DA 70%)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Floating math symbols */}
      <FloatingSymbols variant="default" opacity={0.17} />

      {/* Decorative circles */}
      <div className="absolute rounded-full pointer-events-none" style={{ width: 280, height: 280, background: "rgba(92,167,173,0.07)", top: -60, right: -80 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width: 180, height: 180, background: "rgba(216,114,51,0.06)", bottom: 100, left: -60 }} />

      {/* Top bar (Combined User + Skill) */}
      <div className="flex items-center justify-between px-5 pt-3 gap-2">
        <button
          onClick={() => onNavigate("profile")}
          className="flex-1 flex flex-col rounded-2xl p-2 active:scale-95 transition-transform"
          style={{
            background: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.8)",
            boxShadow: `0 4px 12px rgba(98,114,164,0.08)`,
            cursor: "pointer"
          }}
        >
          <div className="flex items-center justify-between w-full">
            {/* Avatar & Name */}
            <div className="flex items-center gap-2.5">
              <AvatarIcon id={avatarId} size={38} borderRadius={12} showShadow={false} />
              <div className="flex flex-col items-start pr-2">
                <span style={{ fontSize: 13, fontWeight: 900, color: C.purple, lineHeight: 1.1 }}>
                  {playerName || "Игрок"}
                </span>
                <span style={{ fontSize: 11, fontWeight: 800, color: skillColor, marginTop: 1 }}>
                  {skillName}
                </span>
              </div>
            </div>

            {/* Score Badge */}
            {totalScore >= 0 && (
              <div className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 flex-shrink-0 bg-white" style={{ border: "1px solid rgba(216,114,51,0.2)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#D87233">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                <span style={{ fontSize: 13, fontWeight: 900, color: "#D87233" }}>{totalScore.toLocaleString("ru")}</span>
              </div>
            )}
          </div>

          {/* Progress Bar inside Top bar */}
          {nextScore > 0 && (
            <div className="w-full mt-2" style={{ padding: "0 4px" }}>
              <div className="w-full rounded-full overflow-hidden relative" style={{ height: 6, background: "rgba(0,0,0,0.06)" }}>
                <motion.div
                  className="h-full rounded-full absolute left-0 top-0"
                  animate={{ width: `${skillPct}%` }}
                  transition={{ duration: 0.5 }}
                  style={{ background: skillColor }}
                />
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Character */}
      <div className="flex justify-center pt-2 pb-0">
        <LevitatingCharacter size={210} />
      </div>

      {/* Title */}
      <div className="flex flex-col items-center mt-2 mb-8 px-6">
        <h1 className="m-0 text-center" style={{ fontSize: 36, fontWeight: 900, color: C.purple, letterSpacing: -1, lineHeight: 1.1 }}>
          Математика
        </h1>
        <p className="m-0 mt-1 text-center" style={{ fontSize: 13, color: C.teal, fontWeight: 700, opacity: 0.9 }}>
          Тренируй свой мозг каждый день!
        </p>
      </div>

      {/* Daily Quest */}
      {!dailyQuest.claimed && (
        <div className="px-6 w-full mb-5">
          <div className="bg-white rounded-2xl p-4 flex flex-col gap-3" style={{ boxShadow: "0 6px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.7)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-xl" style={{ background: `${C.orange}15` }}>
                  <Target size={16} strokeWidth={2.5} color={C.orange} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#8A929E", lineHeight: 1 }}>Задание дня</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#2E3545" }}>Реши 20 примеров</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Zap size={14} color={C.orange} fill={C.orange} />
                <span style={{ fontSize: 15, fontWeight: 900, color: C.orange }}>+50</span>
              </div>
            </div>

            {dailyQuest.count >= 20 ? (
              <button
                onClick={onClaimDaily}
                className="w-full py-2.5 rounded-xl flex items-center justify-center mt-1"
                style={{ background: C.orange, color: "white", fontWeight: 800, border: "none", cursor: "pointer", boxShadow: `0 4px 10px ${C.orange}40` }}
              >
                Забрать награду
              </button>
            ) : (
              <div className="w-full mt-1">
                <div className="flex justify-between mb-1" style={{ fontSize: 11, fontWeight: 800, color: "#8A929E" }}>
                  <span>Прогресс</span>
                  <span>{dailyQuest.count} / 20</span>
                </div>
                <div className="w-full rounded-full h-2" style={{ background: "#EEF1F7" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(dailyQuest.count / 20) * 100}%` }}
                    className="h-full rounded-full"
                    style={{ background: C.orange }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col items-center gap-3 px-8 flex-1">
        {buttons.map((btn, idx) => (
          <motion.button
            key={btn.label}
            onClick={btn.disabled ? undefined : btn.action}
            whileTap={btn.disabled ? {} : { scale: 0.96 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07, duration: 0.35, ease: "easeOut" }}
            className="w-full flex items-center gap-3 rounded-2xl"
            style={{
              background: btn.disabled ? "#B0B8C1" : btn.bg,
              boxShadow: btn.disabled
                ? "none"
                : `0 6px 18px ${btn.shadow}, inset 0 1px 0 rgba(255,255,255,0.2)`,
              border: "none",
              cursor: btn.disabled ? "not-allowed" : "pointer",
              padding: btn.primary ? "16px 22px" : "13px 22px",
              color: btn.disabled ? "rgba(255,255,255,0.55)" : "white",
              opacity: btn.disabled ? 0.65 : 1,
            }}
          >
            <div
              className="flex items-center justify-center rounded-xl flex-shrink-0"
              style={{
                width: btn.primary ? 38 : 34,
                height: btn.primary ? 38 : 34,
                background: "rgba(255,255,255,0.2)",
              }}
            >
              {btn.icon}
            </div>
            <div className="flex flex-col items-start">
              <span style={{ fontSize: btn.primary ? 17 : 15, fontWeight: 800, letterSpacing: 0.2 }}>
                {btn.label}
              </span>
              {btn.disabled && (
                <span style={{ fontSize: 10, opacity: 0.8, fontWeight: 600 }}>
                  Сначала сыграй хотя бы раз
                </span>
              )}
            </div>
            <div className="ml-auto">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </motion.button>
        ))}

        {/* Sound toggle */}
        <motion.button
          onClick={handleSoundToggle}
          whileTap={{ scale: 0.96 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.35, ease: "easeOut" }}
          className="flex items-center gap-3 rounded-2xl"
          style={{
            background: soundOn ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.08)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
            border: `1.5px solid ${soundOn ? "rgba(92,167,173,0.3)" : "rgba(0,0,0,0.08)"}`,
            cursor: "pointer",
            padding: "10px 20px 10px 14px",
            color: soundOn ? C.teal : "#9AA0AA",
            alignSelf: "center",
          }}
        >
          <div className="flex items-center justify-center rounded-lg" style={{ width: 30, height: 30, background: soundOn ? "rgba(92,167,173,0.15)" : "rgba(0,0,0,0.05)" }}>
            {soundOn ? <Volume2 size={16} strokeWidth={2.5} /> : <VolumeX size={16} strokeWidth={2.5} />}
          </div>
          <span style={{ fontSize: 13, fontWeight: 800 }}>Звук {soundOn ? "вкл." : "выкл."}</span>
        </motion.button>
      </div>

      <div style={{ height: 36 }} />
    </div>
  );
}