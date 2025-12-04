export interface BudgetCategories {
  Food: number;
  Transport: number;
  Shopping: number;
  Bills: number;
  Other: number;
}

export interface Budget {
  _id?: string;
  userId?: string;
  month: string; 
  categories: BudgetCategories;
  createdAt?: string;
}

export interface BudgetResponse {
  status: string;
  data: {
    budgets: Budget[];
  };
}

export interface SingleBudgetResponse {
  status: string;
  data: {
    budget: Budget;
  };
}