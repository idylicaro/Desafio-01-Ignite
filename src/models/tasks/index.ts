export interface Task {
  id: string;
  title: string;
  description: string;
  is_done: boolean;
  created_at: Date;
  updated_at: Date;
  completed_at: Date;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
}
