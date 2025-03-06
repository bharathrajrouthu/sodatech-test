export interface Task {
  id: string;
  description: string;
  isDone: boolean;
  createdAt: Date;
}

export type TaskStatus = 'all' | 'pending' | 'finished'; 