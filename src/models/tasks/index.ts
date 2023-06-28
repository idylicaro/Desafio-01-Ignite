export interface Task {
  id: string;
  title: string;
  description: string;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
}
