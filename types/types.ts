export interface Account {
  id: string | number;
  name: string;
  balance: number;
  icon_name: string;
}

export interface PlannedBudget {
  id: number;
  budget_name: string;
  budget_type: string;
  amount: number;
  start_date?: string; // ← optional to match DB
  end_date?: string;
  color_name?: string;
}

export interface PlannedBudgetTransaction {
  id: number;
  planned_budget_id: number;
  account_name?: string; // ← optional to match DB
  amount: number;
  date: string;
}
