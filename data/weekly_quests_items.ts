export interface QuestState extends WeeklyQuest {
  readyToComplete: boolean;
  skipped?: boolean;
}

export interface WeeklyQuest {
  id: string;
  title: string;
  completed: boolean;
  color: string;
  progress?: number;
  target?: number;
}

export const WEEKLY_QUESTS: WeeklyQuest[] = [
  {
    id: "login_7days",
    title: "Login for 7 days",
    completed: false,
    color: "#FFFFFF",
    progress: 0,
    target: 7,
  },
  {
    id: "add_50_transactions",
    title: "Add 50 transactions",
    completed: false,
    color: "#FFFFFF",
    progress: 0,
    target: 50,
  },
  {
    id: "use_app_40min",
    title: "Use the app for 40 minutes",
    completed: false,
    color: "#FFFFFF",
    progress: 0,
    target: 40,
  },
];
