import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { MenuScreen } from "./components/MenuScreen";
import { AchievementsScreen } from "./components/AchievementsScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { LevelSelectScreen } from "./components/LevelSelectScreen";
import { GameScreen } from "./components/GameScreen";
import { AuthPage } from "./components/AuthPage";
import { AchievementToast } from "./components/AchievementToast";
import { useGameStats } from "./hooks/useGameStats";
import { getSkillLevel } from "./utils/skillLevels";

type Screen = "menu" | "levelSelect" | "achievements" | "profile" | "game" | "auth";

const LEVEL_NAMES: Record<number, string> = {
  1: "База", 2: "Легко", 3: "Средне", 4: "Тяжело", 5: "Эксперт", 6: "Гений",
};

export default function App() {
  const { user, token, logout, updateUser } = useAuth();
  const [screen, setScreen] = useState<Screen>("menu");
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedRange, setSelectedRange] = useState(9);

  // Keep track of whether a game is in progress (to enable "Continue")
  const [gameStarted, setGameStarted] = useState(false);
  // Increment to force-reset GameScreen when a new level is selected
  const [gameKey, setGameKey] = useState(0);

  // Toast queue
  const [toastId, setToastId] = useState<number | null>(null);
  const [toastQueue, setToastQueue] = useState<number[]>([]);

  useEffect(() => {
    if (toastId === null && toastQueue.length > 0) {
      const [first, ...rest] = toastQueue;
      setToastId(first);
      setToastQueue(rest);
    }
  }, [toastId, toastQueue]);

  const handleAchievementUnlocked = useCallback((id: number) => {
    setToastQueue(prev => [...prev, id]);
  }, []);

  const {
    stats,
    recordCorrectAnswer,
    recordWrongAnswer,
    recordRoundComplete,
    updateScore,
    updatePlayerName,
    resetStats,
    updateAvatarId,
  } = useGameStats(handleAchievementUnlocked);

  const handleSelectLevel = (levelId: number, range: number) => {
    setSelectedLevel(levelId);
    setSelectedRange(range);
    setGameKey(k => k + 1); // reset game state
    setGameStarted(true);
    setScreen("game");
  };

  const handleNextLevel = () => {
    if (selectedLevel < 6) {
      handleSelectLevel(selectedLevel + 1, -1); // Use mix range (-1) for automatically started next levels
    }
  };

  const handleReset = () => {
    resetStats();
    setGameStarted(false);
    setScreen("menu");
  };

  const handleToastDismiss = useCallback(() => {
    setToastId(null);
  }, []);

  const unlockedCount = stats.unlockedAchievements.length;
  const currentTotalScore = user?.total_score ?? stats.totalScore;
  const currentAvatarId = user?.avatar_id ?? stats.avatarId;
  const currentName = user?.username ?? stats.playerName;

  const handleAvatarChange = async (id: number) => {
    updateAvatarId(id); // update local
    if (user && token) {
      updateUser({ avatar_id: id }); // optimistic update
      try {
        await fetch('/api/auth/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ avatar_id: id })
        });
      } catch (err) {
        console.error("Failed to update avatar on server", err);
      }
    }
  };

  const handleNameChange = async (name: string) => {
    updatePlayerName(name); // update local
    if (user && token) {
      updateUser({ username: name }); // optimistic update
      try {
        await fetch('/api/auth/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ username: name })
        });
      } catch (err) {
        console.error("Failed to update name on server", err);
      }
    }
  };

  const handleScoreUpdate = async (newScore: number) => {
    updateScore(newScore); // update local
    if (user && token) {
      updateUser({ total_score: newScore }); // optimistic update
      // Optionally debounce this later if it's called too often, but right now it's called per correct answer
      try {
        await fetch('/api/auth/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ total_score: newScore })
        });
      } catch (err) {
        console.error("Failed to update score on server", err);
      }
    }
  };

  const { current: skill, pct, next: nextSkill } = getSkillLevel(currentTotalScore);

  return (
    <div
      className="flex items-center justify-center min-h-screen w-full"
      style={{ background: "#ECEFF6" }}
    >
      <div
        className="relative overflow-hidden flex flex-col mx-auto flex-1"
        style={{ width: "100%", maxWidth: 600, minHeight: "100dvh", background: "#ECEFF6" }}
      >
        {screen === "menu" && (
          <MenuScreen
            onNavigate={(s) => setScreen(s as Screen)}
            canContinue={gameStarted}
            totalScore={currentTotalScore}
            playerName={currentName}
            avatarId={currentAvatarId}
            skillName={skill.name}
            skillColor={skill.color}
            skillNum={skill.num}
            skillPct={pct}
            nextScore={nextSkill ? nextSkill.minScore : 0}
          />
        )}

        {screen === "levelSelect" && (
          <LevelSelectScreen
            onBack={() => setScreen("menu")}
            onSelectLevel={handleSelectLevel}
          />
        )}

        {/* GameScreen stays mounted once started — hidden when not active */}
        {gameStarted && (
          <div
            style={{
              display: screen === "game" ? "block" : "none",
              position: "absolute",
              inset: 0,
              zIndex: 10,
            }}
          >
            <GameScreen
              key={gameKey}
              levelId={selectedLevel}
              levelName={LEVEL_NAMES[selectedLevel] ?? "Уровень"}
              range={selectedRange}
              totalScore={currentTotalScore}
              onBack={() => setScreen("menu")}
              onScoreUpdate={handleScoreUpdate}
              onCorrectAnswer={recordCorrectAnswer}
              onWrongAnswer={recordWrongAnswer}
              onRoundComplete={(isPerfect) => recordRoundComplete(selectedLevel, isPerfect)}
              hasNextLevel={selectedLevel < 6}
              onNextLevel={handleNextLevel}
            />
          </div>
        )}

        {screen === "achievements" && (
          <AchievementsScreen
            onBack={() => setScreen("menu")}
            playerName={currentName}
            avatarId={currentAvatarId}
            stats={stats}
          />
        )}

        {screen === "profile" && (
          <ProfileScreen
            onBack={() => setScreen("menu")}
            playerName={currentName}
            isLoggedIn={!!user}
            onNameChange={handleNameChange}
            onLogin={() => setScreen("auth")}
            onLogout={logout}
            onReset={handleReset}
            totalStars={currentTotalScore}
            totalAchievements={unlockedCount}
            avatarId={currentAvatarId}
            onAvatarChange={handleAvatarChange}
          />
        )}

        {screen === "auth" && (
          <AuthPage onBack={() => setScreen("profile")} />
        )}

        {/* Global achievement toast */}
        <AchievementToast
          achievementId={toastId}
          onDismiss={handleToastDismiss}
        />
      </div>
    </div>
  );
}