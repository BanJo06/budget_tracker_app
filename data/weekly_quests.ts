export interface WeeklyQuest {
  id: string;
  title: string;
  completed: boolean;
}

// Define your weekly quests here
export const WEEKLY_QUESTS: WeeklyQuest[] = [
  {
    id: "w1",
    title: "Complete 3 daily quests",
    completed: false,
  },
  {
    id: "w2",
    title: "Add 5 tasks this week",
    completed: false,
  },
  {
    id: "w3",
    title: "Use the app for 30 minutes",
    completed: false,
  },
];
