export interface Task {
  id: string;
  title: string;
  details: string;
  status: 'open' | 'inProgress' | 'closed';
  assignee: 'aleksandar' | 'nemanjaDz' | 'nemanjaT';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
}

export const COLORS = {
  // Status colors
  statusOpen: '#4CAF50',
  statusInProgress: '#FFC107',
  statusClosed: '#757575',
  
  // Assignee colors
  assigneeAleksandar: '#BB86FC',
  assigneeNemanjaDz: '#03DAC6',
  assigneeNemanjaT: '#CF6679',
  
  // UI colors
  background: '#121212',
  surface: '#1E1E1E',
  primary: '#BB86FC',
  error: '#CF6679',
} as const;