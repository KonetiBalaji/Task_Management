import { Timestamp } from 'firebase/firestore';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'inprogress' | 'done';
export type UserRole = 'owner' | 'editor' | 'viewer';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  createdAt: Timestamp;
  path: string;
}

export interface BoardMember {
  uid: string;
  email?: string;
  role: UserRole;
}

export interface BoardDoc {
  id: string;
  name: string;
  ownerId: string;
  members: Record<string, UserRole>;
  createdAt: Timestamp;
}

export interface Task {
  id: string;
  boardId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  timestamp?: Timestamp;
  dueDate?: string;
  priority?: TaskPriority;
  subtasks: Subtask[];
  attachments: Attachment[];
  createdBy?: string;
}

export interface ColumnType {
  id: TaskStatus;
  title: string;
} 