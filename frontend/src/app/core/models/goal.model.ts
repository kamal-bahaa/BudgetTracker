export interface Goal {
  _id?: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  status: 'in-progress' | 'completed';
  userId?: string;
  createdAt?: string;
}

export interface GoalResponse {
  status: string;
  data: {
    goals: Goal[];
  };
}

export interface SingleGoalResponse {
  status: string;
  data: {
    goal: Goal;
  };
}