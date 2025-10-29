export interface DailyQuest {
  id: string;
  title: string;
  completed: boolean;
  color: string;
}

export const DAILY_QUESTS: DailyQuest[] = [
  {
    id: "1",
    title: "Use App",
    completed: false,
    color: "#FFFFFF",
  },
  {
    id: "2",
    title: "Add 1 task",
    completed: false,
    color: "#FFFFFF",
  },
  {
    id: "3",
    title: "Use the app for 5 minutes",
    completed: false,
    color: "#FFFFFF",
  },
];
