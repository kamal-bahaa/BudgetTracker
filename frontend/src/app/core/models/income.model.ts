export interface Income {
  _id?: string;
  title: string;
  amount: number;
  source: 'Salary' | 'Freelance' | 'Business' | 'Investment' | 'Other';
  date: string;
  userId?: string;
  createdAt?: string;
}

export interface IncomeResponse {
  status: string;
  data: {
    income: Income[];
  };
}

export interface SingleIncomeResponse {
  status: string;
  data: {
    income: Income;
  };
}