export interface ChartDataPoint {
  _id: string | { month: number; year?: number };
  total: number;
}

export interface YearlyTrendData {
  year: number;
  expenses: { _id: { month: number }; total: number }[];
  incomes: { _id: { month: number }; total: number }[];
}

export interface AnalyticsResponse<T> {
  status: string;
  data: T;
}