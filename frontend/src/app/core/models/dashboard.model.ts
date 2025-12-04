// Dashboard Overview Data
export interface DashboardOverview {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  incomeCount: number;
  expenseCount: number;
  goalsCount?: number;
  completedGoals?: number;
}

export interface RecentTransaction {
  _id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
}

export interface DashboardResponse {
  status: string;
  data: {
    overview: DashboardOverview;
    recentTransactions: RecentTransaction[];
  };
}
