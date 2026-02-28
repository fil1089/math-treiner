import { useState, useCallback, useEffect } from "react";
import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  UserButton, 
  useUser,
  useAuth
} from "@clerk/clerk-react";
import { MenuScreen } from "./components/MenuScreen";
import { AchievementsScreen } from "./components/AchievementsScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { LevelSelectScreen } from "./components/LevelSelectScreen";
import { GameScreen } from "./components/GameScreen";
import { AchievementToast } from "./components/AchievementToast";
import { useGameStats } from "./hooks/useGameStats";
import { getSkillLevel } from "./utils/skillLevels";

type Screen = "menu" | "levelSelect" | "achievements" | "profile" | "game";

const LEVEL_NAMES: Record<number, string> = {
  1: "База", 2: "Легко", 3: "Средне", 4: "Тяжело", 5: "Эксперт", 6: "Гений",
};

export default function App() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [screen, setScreen]         = useState<Screen>("menu");
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedRange, setSelectedRange] = useState(9);

  // Keep track of whether a game is in progress (to enable "Continue")
  const [gameStarted, setGameStarted] = useState(false);
  // Increment to force-reset GameScreen when a new level is selected
  const [gameKey, setGameKey] = useState(0);

  // Toast queue
  const [toastId, setToastId]       = useState<number | null>(null);
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

  const handleReset = () => {
    resetStats();
    setGameStarted(false);
    setScreen("menu");
  };

  const handleToastDismiss = useCallback(() => {
    setToastId(null);
  }, []);

  const unlockedCount = stats.unlockedAchievements.length;
  const { current: skill } = getSkillLevel(stats.totalScore);

  return (
    <div
      className="flex items-center justify-center min-h-screen w-full"
      style={{ background: "#B5BCC8" }}
    >
      <div
        className="relative overflow-hidden"
        style={{ width: "100%", maxWidth: 390, minHeight: "100dvh" }}
      >
        {screen === "menu" && (
          <MenuScreen
            onNavigate={(s) => setScreen(s as Screen)}
            canContinue={gameStarted}
            totalScore={stats.totalScore}
            playerName={stats.playerName}
            avatarId={stats.avatarId}
            skillName={skill.name}
            skillColor={skill.color}
            skillNum={skill.num}
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
              totalScore={stats.totalScore}
              onBack={() => setScreen("menu")}
              onScoreUpdate={updateScore}
              onCorrectAnswer={recordCorrectAnswer}
              onWrongAnswer={recordWrongAnswer}
              onRoundComplete={(isPerfect) => recordRoundComplete(selectedLevel, isPerfect)}
            />
          </div>
        )}

        {screen === "achievements" && (
          <AchievementsScreen
            onBack={() => setScreen("menu")}
            playerName={stats.playerName}
            stats={stats}
          />
        )}

        {screen === "profile" && (
          <ProfileScreen
            onBack={() => setScreen("menu")}
            playerName={user?.firstName || stats.playerName}
            isLoggedIn={!!userId}
            onNameChange={updatePlayerName}
            onLogin={() => {}} // Controlled by Clerk buttons now
            onLogout={() => {}} // Controlled by Clerk buttons now
            onReset={handleReset}
            totalStars={unlockedCount}
            totalAchievements={9}
            avatarId={stats.avatarId}
            onAvatarChange={updateAvatarId}
          />
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