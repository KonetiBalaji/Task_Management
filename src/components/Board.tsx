import React, { FC, useState, DragEvent } from 'react';
import { Task, TaskStatus, Subtask } from '../types';
import { COLUMNS } from '../constants';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { db } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface BoardProps {
  tasks: Task[];
  boardId: string;
  userId: string | null;
  onAddTask: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onAddSubtask: (taskId: string, subtaskTitle: string) => Promise<void>;
  onToggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  onUpdateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => Promise<void>;
  onDeleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  onUploadAttachment: (taskId: string, file: File) => Promise<void>;
  onDeleteAttachment: (taskId: string, attachmentId: string, attachmentPath: string) => Promise<void>;
  isUploadingAttachment: string | null;
  getAISubtaskSuggestions: (taskTitle: string, taskDesc: string) => Promise<void>;
  isSuggestingSubtasks: boolean;
  suggestedSubtasks: string[];
  setSuggestedSubtasks: React.Dispatch<React.SetStateAction<string[]>>;
  newTaskTitle: string;
  setNewTaskTitle: React.Dispatch<React.SetStateAction<string>>;
  newTaskDesc: string;
  setNewTaskDesc: React.Dispatch<React.SetStateAction<string>>;
  newDueDate: string;
  setNewDueDate: React.Dispatch<React.SetStateAction<string>>;
  newPriority: 'low' | 'medium' | 'high';
  setNewPriority: React.Dispatch<React.SetStateAction<'low' | 'medium' | 'high'>>;
  isLoading: boolean;
}

const Board: FC<BoardProps> = ({
  tasks,
  boardId,
  userId,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onUpdateTaskStatus,
  onAddSubtask,
  onToggleSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
  onUploadAttachment,
  onDeleteAttachment,
  isUploadingAttachment,
  getAISubtaskSuggestions,
  isSuggestingSubtasks,
  suggestedSubtasks,
  setSuggestedSubtasks,
  newTaskTitle,
  setNewTaskTitle,
  newTaskDesc,
  setNewTaskDesc,
  newDueDate,
  setNewDueDate,
  newPriority,
  setNewPriority,
  isLoading
}) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.setData('text/plain', task.id);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    if (!draggedTask) return;

    const taskRef = doc(db, 'boards', boardId, 'tasks', draggedTask.id);
    await updateDoc(taskRef, { status });
    setDraggedTask(null);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = draggableId;
    const newStatus = destination.droppableId as TaskStatus;

    onUpdateTaskStatus(taskId, newStatus);
    setDraggedTask(null);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 sm:p-8">
      <TaskForm
        handleAddTask={onAddTask}
        getAISubtaskSuggestions={getAISubtaskSuggestions}
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
        userId={userId}
        isLoading={isLoading}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4"
                >
                  <h3 className="text-lg font-semibold mb-4 text-sky-300">{column.title} ({getTasksByStatus(column.id).length})</h3>
                  {getTasksByStatus(column.id).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard
                            task={task}
                            onUpdateTask={onUpdateTask}
                            handleDeleteTask={onDeleteTask}
                            onAddSubtask={onAddSubtask}
                            onToggleSubtask={onToggleSubtask}
                            onUpdateSubtask={onUpdateSubtask}
                            onDeleteSubtask={onDeleteSubtask}
                            onUploadAttachment={onUploadAttachment}
                            onDeleteAttachment={onDeleteAttachment}
                            isUploadingAttachment={isUploadingAttachment}
                            onDragStart={handleDragStart}
                            draggedTask={draggedTask}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board; 