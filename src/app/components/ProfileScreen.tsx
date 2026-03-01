import { useState } from "react";
import { motion } from "motion/react";
import { LogIn, LogOut, RotateCcw, Pencil, Check, X, ChevronRight, Star, Trophy, Camera } from "lucide-react";
import { LevitatingCharacter } from "./LevitatingCharacter";
import { FloatingSymbols } from "./FloatingSymbols";
import { AvatarIcon } from "./AvatarIcon";
import { AvatarPicker } from "./AvatarPicker";

const C = {
  purple: "#6272A4",
  orange: "#D87233",
  teal: "#5CA7AD",
  bg: "#CDD2DA",
};

interface ProfileScreenProps {
  onBack: () => void;
  playerName: string;
  isLoggedIn: boolean;
  onNameChange: (name: string) => void;
  onLogin: () => void;
  onLogout: () => void;
  onReset: () => void;
  totalStars: number;
  totalAchievements: number;
  avatarId?: number;
  onAvatarChange?: (id: number) => void;
}

export function ProfileScreen({
  onBack,
  playerName,
  isLoggedIn,
  onNameChange,
  onLogin,
  onLogout,
  onReset,
  totalStars,
  totalAchievements,
  avatarId = 0,
  onAvatarChange,
}: ProfileScreenProps) {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(playerName);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const initials = playerName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSaveName = () => {
    const trimmed = draftName.trim();
    if (trimmed.length > 0) {
      onNameChange(trimmed);
    } else {
      setDraftName(playerName);
    }
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setDraftName(playerName);
    setEditing(false);
  };

  return (
    <div
      className="flex flex-col min-h-[100dvh] w-full relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, #D8DDE6 0%, #CDD2DA 70%)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute rounded-full pointer-events-none" style={{ width: 220, height: 220, background: "rgba(92,167,173,0.07)", top: -50, right: -60 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width: 150, height: 150, background: "rgba(98,114,164,0.07)", bottom: 120, left: -50 }} />

      <FloatingSymbols variant="profile" opacity={0.14} />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-10 pb-2">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
          style={{ background: C.teal, boxShadow: "0 3px 10px rgba(92,167,173,0.5)", border: "none", cursor: "pointer" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <h1 className="m-0" style={{ fontSize: 26, fontWeight: 900, color: C.purple, letterSpacing: -0.5 }}>
          Профиль
        </h1>

        <div className="w-10 h-10" />
      </div>

      {/* Character */}
      <div className="flex justify-center pt-2">
        <LevitatingCharacter size={180} />
      </div>

      {/* Scrollable content */}
      <div className="flex flex-col px-5 gap-4 pb-10 flex-1 overflow-y-auto mt-2">

        {/* Player card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.55)", boxShadow: "0 4px 16px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.8)" }}
        >
          <div className="flex items-center gap-4">
            {/* Avatar — tappable to change */}
            <div className="relative flex-shrink-0">
              <AvatarIcon id={avatarId} size={64} borderRadius={18} />
              <button
                onClick={() => setShowAvatarPicker(true)}
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  background: C.purple,
                  border: "2.5px solid white",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(98,114,164,0.5)",
                }}
              >
                <Camera size={12} color="white" strokeWidth={2.5} />
              </button>
            </div>

            {/* Name area */}
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") handleCancelEdit(); }}
                    maxLength={20}
                    className="flex-1 rounded-xl px-3 py-1.5 outline-none min-w-0"
                    style={{
                      background: "rgba(98,114,164,0.1)",
                      border: `2px solid ${C.purple}`,
                      fontSize: 15,
                      fontWeight: 800,
                      color: C.purple,
                      fontFamily: "'Nunito', sans-serif",
                    }}
                  />
                  <button onClick={handleSaveName} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.teal, border: "none", cursor: "pointer", color: "white", flexShrink: 0 }}>
                    <Check size={14} strokeWidth={3} />
                  </button>
                  <button onClick={handleCancelEdit} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#E85D5D", border: "none", cursor: "pointer", color: "white", flexShrink: 0 }}>
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="min-w-0">
                    <p className="m-0" style={{ fontSize: 11, color: C.teal, fontWeight: 700, opacity: 0.8 }}>
                      Игрок
                    </p>
                    <p className="m-0 truncate" style={{ fontSize: 18, fontWeight: 900, color: C.purple }}>
                      {playerName}
                    </p>
                  </div>
                  <button
                    onClick={() => { setDraftName(playerName); setEditing(true); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ml-1 active:scale-95 transition-transform"
                    style={{ background: "rgba(98,114,164,0.12)", border: "none", cursor: "pointer", color: C.purple }}
                  >
                    <Pencil size={14} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-2 mt-3">
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{
                background: isLoggedIn ? "rgba(92,167,173,0.15)" : "rgba(0,0,0,0.06)",
                border: `1px solid ${isLoggedIn ? "rgba(92,167,173,0.3)" : "rgba(0,0,0,0.1)"}`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: isLoggedIn ? "#4CAF50" : "#9AA0AA" }}
              />
              <span style={{ fontSize: 11, fontWeight: 700, color: isLoggedIn ? C.teal : "#9AA0AA" }}>
                {isLoggedIn ? "Аккаунт подключён" : "Гость"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06 }}
          className="grid gap-3"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          {/* Stars */}
          <div
            className="rounded-2xl p-4 flex flex-col items-center gap-1"
            style={{
              background: `linear-gradient(135deg, ${C.orange} 0%, #B85E20 100%)`,
              boxShadow: "0 4px 14px rgba(216,114,51,0.4)",
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
              <Star size={20} strokeWidth={2} fill="white" color="white" />
            </div>
            <p className="m-0 text-white" style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.1 }}>{totalStars}</p>
            <p className="m-0 text-white" style={{ fontSize: 11, opacity: 0.85 }}>звёзд</p>
          </div>

          {/* Achievements */}
          <div
            className="rounded-2xl p-4 flex flex-col items-center gap-1"
            style={{
              background: `linear-gradient(135deg, ${C.purple} 0%, #4A5A8C 100%)`,
              boxShadow: "0 4px 14px rgba(98,114,164,0.4)",
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
              <Trophy size={20} strokeWidth={2} color="white" />
            </div>
            <p className="m-0 text-white" style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.1 }}>{totalAchievements}</p>
            <p className="m-0 text-white" style={{ fontSize: 11, opacity: 0.85 }}>достижений</p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
          className="flex flex-col gap-2"
        >
          {/* Section label */}
          <p className="m-0 px-1" style={{ fontSize: 11, fontWeight: 800, color: C.purple, opacity: 0.5, textTransform: "uppercase", letterSpacing: 1 }}>
            Действия
          </p>

          {/* Login / Logout */}
          {!isLoggedIn ? (
            <ActionButton
              icon={<LogIn size={18} strokeWidth={2.5} />}
              label="Войти в аккаунт"
              sublabel="Сохраняй прогресс в облаке"
              color={C.teal}
              onClick={onLogin}
            />
          ) : (
            <>
              {!showLogoutConfirm ? (
                <ActionButton
                  icon={<LogOut size={18} strokeWidth={2.5} />}
                  label="Выйти из аккаунта"
                  sublabel="Прогресс останется на устройстве"
                  color="#9AA0AA"
                  onClick={() => setShowLogoutConfirm(true)}
                />
              ) : (
                <ConfirmCard
                  text="Точно хочешь выйти из аккаунта?"
                  onConfirm={() => { onLogout(); setShowLogoutConfirm(false); }}
                  onCancel={() => setShowLogoutConfirm(false)}
                  confirmLabel="Выйти"
                  confirmColor="#E85D5D"
                />
              )}
            </>
          )}

          {/* Reset */}
          {!showResetConfirm ? (
            <ActionButton
              icon={<RotateCcw size={18} strokeWidth={2.5} />}
              label="Сбросить прогресс"
              sublabel="Все звёзды и достижения обнулятся"
              color="#E85D5D"
              onClick={() => setShowResetConfirm(true)}
            />
          ) : (
            <ConfirmCard
              text="Весь прогресс будет удалён. Это нельзя отменить!"
              onConfirm={() => { onReset(); setShowResetConfirm(false); }}
              onCancel={() => setShowResetConfirm(false)}
              confirmLabel="Сбросить"
              confirmColor="#E85D5D"
            />
          )}
        </motion.div>
      </div>

      {/* Avatar picker sheet */}
      <AvatarPicker
        visible={showAvatarPicker}
        currentId={avatarId}
        onSelect={(id) => onAvatarChange?.(id)}
        onClose={() => setShowAvatarPicker(false)}
      />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────

function ActionButton({
  icon, label, sublabel, color, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-2xl text-left"
      style={{
        background: "rgba(255,255,255,0.55)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
        border: "none",
        cursor: "pointer",
        padding: "14px 16px",
      }}
    >
      <div
        className="flex items-center justify-center rounded-xl flex-shrink-0"
        style={{ width: 40, height: 40, background: `${color}18`, color }}
      >
        {icon}
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="m-0" style={{ fontSize: 14, fontWeight: 800, color: "#3A4050" }}>{label}</p>
        <p className="m-0 mt-0.5" style={{ fontSize: 11, color: "#8A929E", fontWeight: 600 }}>{sublabel}</p>
      </div>
      <ChevronRight size={16} color={color} strokeWidth={2.5} style={{ flexShrink: 0, opacity: 0.6 }} />
    </motion.button>
  );
}

function ConfirmCard({
  text, onConfirm, onCancel, confirmLabel, confirmColor,
}: {
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel: string;
  confirmColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{
        background: "rgba(255,255,255,0.7)",
        boxShadow: `0 2px 10px rgba(0,0,0,0.08), 0 0 0 1.5px ${confirmColor}40`,
      }}
    >
      <p className="m-0 text-center" style={{ fontSize: 13, fontWeight: 700, color: "#3A4050" }}>
        {text}
      </p>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 rounded-xl py-2.5 active:scale-95 transition-transform"
          style={{ background: "rgba(0,0,0,0.07)", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 800, color: "#6A7280", fontFamily: "'Nunito', sans-serif" }}
        >
          Отмена
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 rounded-xl py-2.5 active:scale-95 transition-transform"
          style={{ background: confirmColor, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 800, color: "white", fontFamily: "'Nunito', sans-serif", boxShadow: `0 3px 8px ${confirmColor}50` }}
        >
          {confirmLabel}
        </button>
      </div>
    </motion.div>
  );
}