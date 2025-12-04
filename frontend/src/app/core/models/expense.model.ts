export interface Expense {
  _id?: string;
  title: string;
  amount: number;
  category: 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Other';
  date: string;
  isRecurring?: boolean; 
  userId?: string;
  createdAt?: string;
}

export interface ExpenseResponse {
  status: string;
  data: {
    expenses: Expense[];
  };
}

export interface SingleExpenseResponse {
  status: string;
  data: {
    expense: Expense;
  };
}