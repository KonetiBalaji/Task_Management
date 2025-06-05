import { Task } from '../types';

export const exportToCSV = (tasks: Task[], includeSubtasks: boolean): string => {
  const headers = ['Title', 'Description', 'Status', 'Priority', 'Due Date', 'Subtasks'];
  const rows = tasks.map(task => {
    const subtasks = includeSubtasks
      ? task.subtasks.map(st => `${st.title} (${st.completed ? 'Completed' : 'Pending'})`).join('; ')
      : '';
    
    return [
      task.title,
      task.description,
      task.status,
      task.priority,
      task.dueDate,
      subtasks
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
};

export const exportToJSON = (tasks: Task[], includeSubtasks: boolean): string => {
  const exportData = tasks.map(task => ({
    ...task,
    subtasks: includeSubtasks ? task.subtasks : []
  }));

  return JSON.stringify(exportData, null, 2);
};

export const downloadFile = (content: string, filename: string, type: string): void => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 