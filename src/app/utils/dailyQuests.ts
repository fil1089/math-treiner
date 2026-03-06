export type DailyQuestType = "solved" | "quick" | "perfect";

export interface DailyQuestDef {
    id: string;
    type: DailyQuestType;
    description: string;
    target: number;
    reward: number;
}

const QUEST_POOL: DailyQuestDef[] = [
    { id: "q1", type: "solved", description: "Реши 20 примеров", target: 20, reward: 50 },
    { id: "q2", type: "solved", description: "Реши 40 примеров", target: 40, reward: 100 },
    { id: "q3", type: "quick", description: "Сделай 10 быстрых ответов", target: 10, reward: 75 },
    { id: "q4", type: "quick", description: "Сделай 15 быстрых ответов", target: 15, reward: 100 },
    { id: "q5", type: "perfect", description: "Заверши 3 идеальных раунда", target: 3, reward: 80 },
    { id: "q6", type: "perfect", description: "Заверши 5 идеальных раундов", target: 5, reward: 120 },
    { id: "q7", type: "solved", description: "Реши 30 примеров", target: 30, reward: 60 },
    { id: "q8", type: "quick", description: "Сделай 5 быстрых ответов", target: 5, reward: 40 },
];

export function getDailyQuest(dateString: string): DailyQuestDef {
    // Simple deterministic hash from date string
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        hash = (hash << 5) - hash + dateString.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    const index = Math.abs(hash) % QUEST_POOL.length;
    return QUEST_POOL[index];
}
