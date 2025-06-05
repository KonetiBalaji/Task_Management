import React, { FC, useState, useRef, DragEvent, ChangeEvent, KeyboardEvent } from 'react';
import { Task, TaskPriority, Subtask } from '../types';
import { TrashIcon, PaperClipIcon, DocumentArrowDownIcon } from './icons';

interface TaskCardProps {
  task: Task;
  handleDeleteTask: (taskId: string) => Promise<void>;
  onDragStart: (e: DragEvent<HTMLDivElement>, task: Task) => void;
  draggedTask: Task | null;
  onAddSubtask: (taskId: string, subtaskTitle: string) => Promise<void>;
  onToggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  onDeleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  onUploadAttachment: (taskId: string, file: File) => Promise<void>;
  onDeleteAttachment: (taskId: string, attachmentId: string, attachmentPath: string) => Promise<void>;
  isUploadingAttachment: string | null;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onUpdateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => Promise<void>;
}

const TaskCard: FC<TaskCardProps> = ({
  task,
  handleDeleteTask,
  onDragStart,
  draggedTask,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onUploadAttachment,
  onDeleteAttachment,
  isUploadingAttachment,
  onUpdateTask,
  onUpdateSubtask,
}) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getPriorityColor = (priority?: TaskPriority): string => {
    switch (priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-green-500';
      default: return 'border-slate-600';
    }
  };

  const handleAddSubtaskKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSubtaskTitle.trim()) {
      e.preventDefault();
      onAddSubtask(task.id, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
    }
  };

  const handleAddSubtaskClick = () => {
    if (newSubtaskTitle.trim()) {
      onAddSubtask(task.id, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
    }
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadAttachment(task.id, file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div
      key={task.id}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className={`p-4 bg-slate-700/70 rounded-lg shadow-md cursor-grab hover:bg-slate-600/80 transition-colors duration-200 border-l-4 ${getPriorityColor(task.priority)} ${draggedTask?.id === task.id ? 'opacity-50 ring-2 ring-sky-500' : ''}`}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-slate-100 break-words flex-1">{task.title}</h4>
        <button
          onClick={() => handleDeleteTask(task.id)}
          className="text-rose-400 hover:text-rose-300 transition-colors p-1 rounded-full hover:bg-rose-500/20 ml-2"
        >
          <TrashIcon />
        </button>
      </div>
      {task.description && (
        <p className="text-sm text-slate-300 mt-2 whitespace-pre-wrap">{task.description}</p>
      )}
      {task.dueDate && (
        <p className="text-xs text-slate-400 mt-2">Due: {task.dueDate}</p>
      )}
      {task.subtasks.length > 0 && (
        <div className="mt-3">
          <h5 className="text-sm font-medium text-slate-300 mb-2">Subtasks:</h5>
          <ul className="space-y-1">
            {task.subtasks.map((subtask) => (
              <li key={subtask.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => onToggleSubtask(task.id, subtask.id)}
                  className="rounded border-slate-600 text-sky-500 focus:ring-sky-500"
                />
                <span className={`flex-1 ${subtask.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                  {subtask.title}
                </span>
                <button
                  onClick={() => onDeleteSubtask(task.id, subtask.id)}
                  className="text-rose-400 hover:text-rose-300 transition-colors p-1 rounded-full hover:bg-rose-500/20"
                >
                  <TrashIcon className="w-3 h-3" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          onKeyPress={handleAddSubtaskKeyPress}
          placeholder="Add subtask..."
          className="flex-1 text-sm p-2 bg-slate-600 border border-slate-500 rounded focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none"
        />
        <button
          onClick={handleAddSubtaskClick}
          disabled={!newSubtaskTitle.trim()}
          className="px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm rounded transition-colors disabled:opacity-50"
        >
          Add
        </button>
      </div>
      <div className="mt-3">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingAttachment === task.id}
            className="flex items-center gap-1 text-sm text-slate-300 hover:text-slate-100 transition-colors"
          >
            <PaperClipIcon />
            {isUploadingAttachment === task.id ? 'Uploading...' : 'Attach File'}
          </button>
        </div>
        {task.attachments.length > 0 && (
          <div className="space-y-1">
            {task.attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center gap-2 text-sm">
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <DocumentArrowDownIcon />
                  {attachment.name}
                </a>
                <button
                  onClick={() => onDeleteAttachment(task.id, attachment.id, attachment.path)}
                  className="text-rose-400 hover:text-rose-300 transition-colors p-1 rounded-full hover:bg-rose-500/20"
                >
                  <TrashIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard; 