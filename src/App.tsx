import React, { FormEvent } from 'react';
import { useAuth } from './hooks/useAuth';
import { useBoard } from './hooks/useBoard';
import { useTask } from './hooks/useTask';
import Login from './components/Login';
import Board from './components/Board';
import { Task, Subtask, TaskStatus, TaskPriority } from './types';
// We can add routing here later for Dashboard and other pages

function App() {
  const { user, loading: authLoading } = useAuth();
  const boardId = "YOUR_BOARD_ID"; // Replace with actual board ID logic later
  const { tasks, loading: boardLoading, error: boardError, updateTaskStatus, getTasksByStatus } = useBoard(boardId);
  const { loading: taskLoading, error: taskError, createTask, updateTask, deleteTask, addSubtask, updateSubtask, deleteSubtask, toggleSubtask } = useTask(boardId);

  // Add state for TaskForm inputs to lift them up to App.tsx
  const [newTaskTitle, setNewTaskTitle] = React.useState('');
  const [newTaskDesc, setNewTaskDesc] = React.useState('');
  const [newDueDate, setNewDueDate] = React.useState('');
  const [newPriority, setNewPriority] = React.useState<TaskPriority>('low'); // Default priority
  const [suggestedSubtasks, setSuggestedSubtasks] = React.useState<string[]>([]);
  const [isSuggestingSubtasks, setIsSuggestingSubtasks] = React.useState(false);
  // Add state for attachment uploads if needed
  const [isUploadingAttachment, setIsUploadingAttachment] = React.useState<string | null>(null);

  const totalLoading = authLoading || boardLoading || taskLoading;
  const totalError = boardError || taskError;

  // Handle form submission for adding a new task
  const handleAddTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return; // Should not happen if Login component is rendered when !user

    const newTask: Omit<Task, 'id'> = {
      title: newTaskTitle,
      description: newTaskDesc,
      status: 'todo', // New tasks start in 'todo' status
      priority: newPriority,
      dueDate: newDueDate,
      subtasks: [], // New tasks start with no subtasks
      attachments: [], // New tasks start with no attachments
      boardId: boardId, // Assign the board ID
    };

    await createTask(newTask);

    // Clear form fields after submission
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewDueDate('');
    setNewPriority('low');
    setSuggestedSubtasks([]);
  };

  // Handle adding a subtask from TaskCard
  const handleAddSubtask = async (taskId: string, subtaskTitle: string) => {
      const newSubtask: Omit<Subtask, 'id'> = { title: subtaskTitle, completed: false };
      await addSubtask(taskId, newSubtask);
  };

  // Placeholder for attachment upload handling
  const handleUploadAttachment = async (taskId: string, file: File) => {
      console.log(`Uploading file for task ${taskId}: ${file.name}`);
      // Implement actual upload logic here
      // Update isUploadingAttachment state as needed
  };

  // Placeholder for attachment deletion handling
    const handleDeleteAttachment = async (taskId: string, attachmentId: string, attachmentPath: string) => {
        console.log(`Deleting attachment ${attachmentId} from task ${taskId} at path ${attachmentPath}`);
        // Implement actual deletion logic here
    };

    // Placeholder for AI subtask suggestions
    const handleGetAISubtaskSuggestions = async (taskTitle: string, taskDesc: string) => {
        setIsSuggestingSubtasks(true);
        console.log(`Getting AI suggestions for ${taskTitle}: ${taskDesc}`);
        // Implement actual AI call here
        // setSuggestedSubtasks(suggestions);
        setIsSuggestingSubtasks(false);
    };

  if (totalLoading) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  if (totalError) {
      return <div className="flex items-center justify-center h-screen text-rose-500">Error: {totalError}</div>;
  }

  if (!user) {
    return <Login onLogin={() => {}} />;
  }

  return (
    <Board
      tasks={tasks}
      userId={user.uid}
      boardId={boardId}
      onAddTask={handleAddTask} // Pass the FormEvent handler
      onUpdateTask={updateTask}
      onDeleteTask={deleteTask}
      onUpdateTaskStatus={updateTaskStatus}
      onAddSubtask={handleAddSubtask} // Pass the function expecting title string
      onToggleSubtask={toggleSubtask} // Pass the toggle subtask function
      onUpdateSubtask={updateSubtask}
      onDeleteSubtask={deleteSubtask}
      onUploadAttachment={handleUploadAttachment}
      onDeleteAttachment={handleDeleteAttachment}
      isUploadingAttachment={isUploadingAttachment}
      getAISubtaskSuggestions={handleGetAISubtaskSuggestions}
      isSuggestingSubtasks={isSuggestingSubtasks}
      suggestedSubtasks={suggestedSubtasks}
      setSuggestedSubtasks={setSuggestedSubtasks}
      newTaskTitle={newTaskTitle}
      setNewTaskTitle={setNewTaskTitle}
      newTaskDesc={newTaskDesc}
      setNewTaskDesc={setNewTaskDesc}
      newDueDate={newDueDate}
      setNewDueDate={setNewDueDate}
      newPriority={newPriority}
      setNewPriority={setNewPriority}
      isLoading={taskLoading} // Pass taskLoading for form submission state
    />
  );
}

export default App; 