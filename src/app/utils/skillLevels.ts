export interface SkillLevel {
  name: string;
  minScore: number;
  color: string;
  num: number;
  reqLevelId?: number;
  reqLevelDesc?: string;
}

export const SKILL_LEVELS: SkillLevel[] = [
  { name: "Новичок", minScore: 0, color: "#9AA0AA", num: 1 },
  { name: "Начинающий", minScore: 50, color: "#4CAF50", num: 2, reqLevelId: 1, reqLevelDesc: "Ур. 1" },
  { name: "Соображайка", minScore: 200, color: "#5CA7AD", num: 3, reqLevelId: 2, reqLevelDesc: "Ур. 2" },
  { name: "Умник", minScore: 500, color: "#6272A4", num: 4, reqLevelId: 3, reqLevelDesc: "Ур. 3" },
  { name: "Мастер", minScore: 1000, color: "#D87233", num: 5, reqLevelId: 4, reqLevelDesc: "Ур. 4" },
  { name: "Профи", minScore: 2000, color: "#E85D5D", num: 6, reqLevelId: 5, reqLevelDesc: "Ур. 5" },
  { name: "Эксперт", minScore: 4000, color: "#9B59B6", num: 7, reqLevelId: 6, reqLevelDesc: "Ур. 6" },
  { name: "Гений", minScore: 8000, color: "#D4A017", num: 8, reqLevelId: 10, reqLevelDesc: "Умножение Микс" },
];
export function getSkillLevel(score: number, levelsCompleted: number[] = []) {
  let idx = 0;
  let blockedDesc: string | null = null;

  for (let i = 0; i < SKILL_LEVELS.length; i++) {
    const level = SKILL_LEVELS[i];
    if (score >= level.minScore) {
      if (level.reqLevelId && !levelsCompleted.includes(level.reqLevelId)) {
        // Can't achieve this level because of missing requirement
        blockedDesc = level.reqLevelDesc || null;
        break; // idx remains at the last successfully achieved rank i-1
      }
      idx = i;
    } else {
      break;
    }
  }

  const current = SKILL_LEVELS[idx];
  const next = idx + 1 < SKILL_LEVELS.length ? SKILL_LEVELS[idx + 1] : null;

  let pct = 100;
  if (next) {
    if (score >= next.minScore) {
      // Meaning we are blocked by level
      pct = 99; // cap at 99%
      blockedDesc = next.reqLevelDesc || null;
    } else {
      pct = ((score - current.minScore) / (next.minScore - current.minScore)) * 100;
      if (next.reqLevelId && !levelsCompleted.includes(next.reqLevelId)) {
        blockedDesc = next.reqLevelDesc || null;
      } else {
        blockedDesc = null;
      }
    }
  } else {
    blockedDesc = null;
  }

  return { current, next, idx, pct: Math.min(Math.max(pct, 0), 100), blockedDesc };
}
