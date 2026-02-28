export const SKILL_LEVELS = [
  { name: "Новичок",     minScore: 0,    color: "#9AA0AA", num: 1 },
  { name: "Начинающий",  minScore: 50,   color: "#4CAF50", num: 2 },
  { name: "Соображайка", minScore: 200,  color: "#5CA7AD", num: 3 },
  { name: "Умник",       minScore: 500,  color: "#6272A4", num: 4 },
  { name: "Мастер",      minScore: 1000, color: "#D87233", num: 5 },
  { name: "Профи",       minScore: 2000, color: "#E85D5D", num: 6 },
  { name: "Эксперт",     minScore: 4000, color: "#9B59B6", num: 7 },
  { name: "Гений",       minScore: 8000, color: "#D4A017", num: 8 },
] as const;

export function getSkillLevel(score: number) {
  let idx = 0;
  for (let i = 0; i < SKILL_LEVELS.length; i++) {
    if (score >= SKILL_LEVELS[i].minScore) idx = i;
  }
  const current = SKILL_LEVELS[idx];
  const next = idx + 1 < SKILL_LEVELS.length ? SKILL_LEVELS[idx + 1] : null;
  const pct = next
    ? ((score - current.minScore) / (next.minScore - current.minScore)) * 100
    : 100;
  return { current, next, idx, pct: Math.min(pct, 100) };
}
