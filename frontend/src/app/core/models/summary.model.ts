export interface CategorySummary {
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  usedPercent: number | null;
}

export interface SummaryData {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  totalBudget: number;
  remaining: number;
  categories: CategorySummary[];
}

export interface SummaryResponse {
  status: string;
  data: SummaryData;
}