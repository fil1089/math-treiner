import { useState } from "react";
import { TrendingUp, Zap, Trophy as TrophyLucide } from "lucide-react";
import {
  IconLightning,
  IconTarget,
  IconFlame,
  IconCrown,
  IconTrophy,
  IconStar,
  IconCheckCircle,
  IconBulb,
  IconFootprint,
  IconLock,
  IconSmallStar,
} from "./icons/AchievementIcons";
import { FloatingSymbols } from "./FloatingSymbols";
import { type GameStats, getAchievementProgress } from "../hooks/useGameStats";
import { AvatarIcon } from "./AvatarIcon";

// ─── Palette ─────────────────────────────────────────────
const C = {
  purple: "#6272A4",
  orange: "#D87233",
  teal: "#5CA7AD",
  bg: "#CDD2DA",
};

// ─── Types ────────────────────────────────────────────────
type Category = "progress" | "skill" | "levels";

interface Achievement {
  id: number;
  icon: React.ReactNode;
  title: string;
  keyBadge: string;      // e.g. "1", "×0", "<3s", "6/6", "★"
  description: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  category: Category;
  stars: number;
}

// ─── Category meta ────────────────────────────────────────
const categoryMeta: Record<Category, { label: string; icon: React.ReactNode; color: string; gradient: string }> = {
  progress: {
    label: "Прогресс",
    icon: <TrendingUp size={16} strokeWidth={2.5} />,
    color: C.teal,
    gradient: "linear-gradient(145deg, #5CA7AD 0%, #3D8F95 100%)",
  },
  skill: {
    label: "Мастерство",
    icon: <Zap size={16} strokeWidth={2.5} fill="currentColor" />,
    color: C.purple,
    gradient: "linear-gradient(145deg, #6272A4 0%, #4A5890 100%)",
  },
  levels: {
    label: "Уровни",
    icon: <TrophyLucide size={16} strokeWidth={2.5} />,
    color: C.orange,
    gradient: "linear-gradient(145deg, #D87233 0%, #B85E20 100%)",
  },
};

// ─── Achievements data ────────────────────────────────────
const achievements: Achievement[] = [
  // 📈 Progress
  {
    id: 1,
    icon: <IconFootprint size={28} />,
    title: "Первый пример",
    keyBadge: "1",
    description: "Реши свой первый пример",
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    category: "progress",
    stars: 1,
  },
  {
    id: 2,
    icon: <IconCheckCircle size={28} />,
    title: "10 примеров",
    keyBadge: "10",
    description: "Реши 10 примеров",
    unlocked: true,
    progress: 10,
    maxProgress: 10,
    category: "progress",
    stars: 1,
  },
  {
    id: 3,
    icon: <IconBulb size={28} />,
    title: "50 примеров",
    keyBadge: "50",
    description: "Реши 50 примеров",
    unlocked: false,
    progress: 34,
    maxProgress: 50,
    category: "progress",
    stars: 2,
  },
  {
    id: 4,
    icon: <IconTrophy size={28} />,
    title: "100 примеров",
    keyBadge: "100",
    description: "Реши 100 примеров",
    unlocked: false,
    progress: 34,
    maxProgress: 100,
    category: "progress",
    stars: 3,
  },
  // 🧠 Skill
  {
    id: 5,
    icon: <IconTarget size={28} />,
    title: "Без ошибок 10",
    keyBadge: "×0",
    description: "10 правильных ответов подряд",
    unlocked: true,
    progress: 10,
    maxProgress: 10,
    category: "skill",
    stars: 2,
  },
  {
    id: 6,
    icon: <IconFlame size={28} />,
    title: "Серия 20",
    keyBadge: "×20",
    description: "20 правильных ответов подряд",
    unlocked: false,
    progress: 12,
    maxProgress: 20,
    category: "skill",
    stars: 3,
  },
  {
    id: 7,
    icon: <IconLightning size={28} />,
    title: "Быстрый ум",
    keyBadge: "<3s",
    description: "Ответь быстрее 3 сек 10 раз",
    unlocked: false,
    progress: 4,
    maxProgress: 10,
    category: "skill",
    stars: 2,
  },
  // 🏆 Levels
  {
    id: 8,
    icon: <IconCrown size={28} />,
    title: "Мастер счёта",
    keyBadge: "6/6",
    description: "Пройди все уровни с 1 по 6",
    unlocked: false,
    progress: 3,
    maxProgress: 6,
    category: "levels",
    stars: 3,
  },
  {
    id: 9,
    icon: <IconStar size={28} />,
    title: "Безупречный",
    keyBadge: "★",
    description: "Пройди уровень полностью без ошибок",
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: "levels",
    stars: 3,
  },
];

const CATEGORY_ORDER: Category[] = ["progress", "skill", "levels"];

const filterTabs = [
  { key: "all", label: "Все" },
  { key: "unlocked", label: "Получены" },
  { key: "locked", label: "В процессе" },
];

// ─── StarRow ──────────────────────────────────────────────
function StarRow({ count, total = 3 }: { count: number; total?: number }) {
  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: total }).map((_, i) => (
        <IconSmallStar key={i} filled={i < count} size={12} />
      ))}
    </div>
  );
}

// ─── KeyBadge ─────────────────────────────────────────────
function KeyBadge({ label, color }: { label: string; color: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl px-2 py-1 flex-shrink-0"
      style={{
        background: "rgba(255,255,255,0.22)",
        border: "1.5px solid rgba(255,255,255,0.35)",
        minWidth: 32,
      }}
    >
      <span
        style={{
          fontSize: label.length > 3 ? 9 : 11,
          fontWeight: 900,
          color: "white",
          letterSpacing: label.length > 2 ? -0.3 : 0,
          fontFamily: "'Nunito', sans-serif",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── AchievementCard ──────────────────────────────────────
function AchievementCard({ a }: { a: Achievement }) {
  const meta = categoryMeta[a.category];
  const hasProgress = a.progress !== undefined && a.maxProgress !== undefined;
  const progressPct = hasProgress ? Math.round((a.progress! / a.maxProgress!) * 100) : 0;

  const cardBg = a.unlocked
    ? meta.gradient
    : "linear-gradient(150deg, #7A8BA8 0%, #5E6E87 100%)";

  const shadow = a.unlocked
    ? `0 5px 16px ${meta.color}55, inset 0 1px 0 rgba(255,255,255,0.22)`
    : "0 3px 10px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)";

  return (
    <div
      className="rounded-2xl p-3 flex flex-col gap-2.5 relative overflow-hidden"
      style={{ background: cardBg, boxShadow: shadow }}
    >
      {/* Decorative bubbles */}
      <div className="absolute -top-5 -right-5 w-16 h-16 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
      <div className="absolute -bottom-3 -left-3 w-10 h-10 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />

      {/* Top row: icon + key badge */}
      <div className="flex items-start justify-between gap-1">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.25)" }}
        >
          {a.icon}
        </div>
        <div className="flex flex-col items-end gap-1">
          <KeyBadge label={a.keyBadge} color={meta.color} />
          {!a.unlocked && <IconLock size={16} />}
        </div>
      </div>

      {/* Title */}
      <div>
        <p className="text-white m-0" style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.2 }}>
          {a.title}
        </p>
        <p className="m-0 mt-0.5" style={{ fontSize: 10, color: "rgba(255,255,255,0.78)", lineHeight: 1.3 }}>
          {a.description}
        </p>
      </div>

      {/* Bottom: stars OR progress bar */}
      {a.unlocked ? (
        <div className="flex items-center justify-between">
          <StarRow count={a.stars} total={3} />
          <div
            className="rounded-full px-1.5 py-0.5 flex items-center gap-1"
            style={{ background: "rgba(255,255,255,0.22)" }}
          >
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
              <path d="M2 5L4.2 7.5L8 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 8, color: "white", fontWeight: 800 }}>Получено</span>
          </div>
        </div>
      ) : (
        hasProgress && (
          <div className="flex flex-col gap-1">
            <div className="w-full rounded-full overflow-hidden" style={{ height: 5, background: "rgba(255,255,255,0.18)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progressPct}%`,
                  background: "linear-gradient(90deg, rgba(255,255,255,0.75), rgba(255,255,255,0.5))",
                }}
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="m-0" style={{ fontSize: 9, color: "rgba(255,255,255,0.65)" }}>
                {a.progress} / {a.maxProgress}
              </p>
              <p className="m-0" style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", fontWeight: 700 }}>
                {progressPct}%
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
}

// ─── Category Header ──────────────────────────────────────
function CategoryHeader({ cat, allItems }: { cat: Category; allItems: Achievement[] }) {
  const { label, icon, color } = categoryMeta[cat];
  const items = allItems.filter(a => a.category === cat);
  const unlockedCount = items.filter(a => a.unlocked).length;
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}22`, color }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="m-0 uppercase" style={{ fontSize: 12, fontWeight: 900, color, letterSpacing: 0.8 }}>
          {label}
        </p>
      </div>
      <div
        className="rounded-full px-2.5 py-1"
        style={{ background: `${color}20` }}
      >
        <span style={{ fontSize: 11, fontWeight: 900, color }}>
          {unlockedCount}/{items.length}
        </span>
      </div>
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────
export function AchievementsScreen({
  onBack,
  playerName = "Игрок",
  avatarId = 0,
  stats,
}: {
  onBack?: () => void;
  playerName?: string;
  avatarId?: number;
  stats?: GameStats;
}) {
  const [activeFilter, setActiveFilter] = useState("all");

  // Build dynamic achievement list based on real stats
  const unlockedIds = new Set(stats?.unlockedAchievements ?? []);

  const dynamicAchievements = achievements.map(a => {
    const unlocked = unlockedIds.has(a.id);
    if (!stats) return a;
    const prog = getAchievementProgress(stats, a.id);
    return { ...a, unlocked, progress: prog.current, maxProgress: prog.max };
  });

  const totalUnlocked = dynamicAchievements.filter(a => a.unlocked).length;
  const totalStars = dynamicAchievements.filter(a => a.unlocked).reduce((s, a) => s + a.stars, 0);
  const overallPct = Math.round((totalUnlocked / dynamicAchievements.length) * 100);

  const filtered = dynamicAchievements.filter(a => {
    if (activeFilter === "unlocked") return a.unlocked;
    if (activeFilter === "locked") return !a.unlocked;
    return true;
  });

  const initials = playerName
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="flex flex-col min-h-[100dvh] w-full relative overflow-hidden"
      style={{ background: C.bg, fontFamily: "'Nunito', sans-serif" }}
    >
      <FloatingSymbols variant="achievements" opacity={0.13} />
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 pt-10 pb-3">
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
          Достижения
        </h1>
        <div className="w-10 h-10" />
      </div>

      {/* ── Player banner ─────────────────────────────────── */}
      <div className="px-4 mb-3">
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{ background: "rgba(255,255,255,0.55)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        >
          <div className="flex-shrink-0">
            <AvatarIcon id={avatarId} size={38} borderRadius={12} showShadow={false} />
          </div>
          <div>
            <p className="m-0" style={{ fontSize: 10, color: C.teal, fontWeight: 700, opacity: 0.8 }}>Игрок</p>
            <p className="m-0" style={{ fontSize: 15, fontWeight: 900, color: C.purple }}>{playerName}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 rounded-xl px-2.5 py-1.5" style={{ background: `${C.orange}18` }}>
            <IconSmallStar filled size={13} />
            <span style={{ fontSize: 14, fontWeight: 900, color: C.orange }}>{totalStars}</span>
          </div>
        </div>
      </div>

      {/* ── Stats banner ──────────────────────────────────── */}
      <div className="px-4 mb-3">
        <div
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${C.teal} 0%, #3D8F95 100%)`,
            boxShadow: `0 6px 20px rgba(92,167,173,0.4)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.25)" }}>
              <IconTrophy size={34} />
            </div>
            <div>
              <p className="m-0 text-white" style={{ fontSize: 11, opacity: 0.85 }}>Получено ачивок</p>
              <p className="m-0 text-white" style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.1 }}>
                {totalUnlocked}
                <span style={{ fontSize: 14, opacity: 0.75 }}> / {achievements.length}</span>
              </p>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="flex flex-col gap-1.5">
            {CATEGORY_ORDER.map(cat => {
              const { icon, color } = categoryMeta[cat];
              const items = dynamicAchievements.filter(a => a.category === cat);
              const cnt = items.filter(a => a.unlocked).length;
              return (
                <div key={cat} className="flex items-center gap-1.5 justify-end">
                  <span style={{ color: "rgba(255,255,255,0.8)" }}>{icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 900, color: "white" }}>{cnt}/{items.length}</span>
                  <div
                    className="rounded-full overflow-hidden"
                    style={{ width: 40, height: 5, background: "rgba(255,255,255,0.2)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(cnt / items.length) * 100}%`, background: "rgba(255,255,255,0.8)" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Overall progress ──────────────────────────────── */}
      <div className="px-4 mb-3">
        <div className="rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,0.55)" }}>
          <div className="flex justify-between items-center mb-2">
            <p className="m-0" style={{ fontSize: 12, color: C.purple, fontWeight: 800 }}>Общий прогресс</p>
            <p className="m-0" style={{ fontSize: 12, color: C.purple, fontWeight: 800 }}>{overallPct}%</p>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: 9, background: "rgba(98,114,164,0.13)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${overallPct}%`, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {[25, 50, 75, 100].map(v => (
              <div key={v} className="flex flex-col items-center gap-0.5">
                <IconSmallStar filled={overallPct >= v} size={11} />
                <span style={{ fontSize: 8, color: C.purple, opacity: 0.55 }}>{v}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter tabs ───────────────────────────────────── */}
      <div className="px-4 mb-3">
        <div className="flex rounded-2xl p-1 gap-1" style={{ background: "rgba(255,255,255,0.55)" }}>
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className="flex-1 py-2 rounded-xl transition-all active:scale-95"
              style={{
                background: activeFilter === tab.key ? C.purple : "transparent",
                color: activeFilter === tab.key ? "white" : "#6B7A8D",
                fontSize: 12,
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                boxShadow: activeFilter === tab.key ? `0 3px 8px rgba(98,114,164,0.4)` : "none",
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              {tab.label}
              {tab.key === "unlocked" && (
                <span
                  className="ml-1 inline-flex items-center justify-center rounded-full"
                  style={{
                    background: activeFilter === tab.key ? "rgba(255,255,255,0.25)" : "rgba(98,114,164,0.15)",
                    fontSize: 10,
                    color: activeFilter === tab.key ? "white" : C.purple,
                    minWidth: 18,
                    height: 18,
                    padding: "0 4px",
                    verticalAlign: "middle",
                  }}
                >
                  {totalUnlocked}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Achievements by category ──────────────────────── */}
      <div className="px-4 pb-10 flex-1 overflow-y-auto">
        {CATEGORY_ORDER.map(cat => {
          const items = filtered.filter(a => a.category === cat);
          if (items.length === 0) return null;
          return (
            <div key={cat} className="mb-5">
              <CategoryHeader cat={cat} allItems={dynamicAchievements} />
              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                {items.map(a => (
                  <AchievementCard key={a.id} a={a} />
                ))}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <IconTarget size={48} />
            <p className="m-0 text-center" style={{ fontSize: 14, color: "#8E9AA2", fontWeight: 800 }}>
              Пока ничего нет
            </p>
            <p className="m-0 text-center" style={{ fontSize: 12, color: "#B0B8BE" }}>
              Продолжай тренироваться!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}