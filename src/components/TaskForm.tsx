import React, { FC, FormEvent } from 'react';
import { TaskPriority } from '../types';
import { PRIORITIES } from '../constants';
import { PlusIcon, LightBulbIcon } from './icons';

interface TaskFormProps {
  handleAddTask: (e: FormEvent<HTMLFormElement>) => Promise<void>;
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
  newPriority: TaskPriority;
  setNewPriority: React.Dispatch<React.SetStateAction<TaskPriority>>;
  userId: string | null;
  isLoading: boolean;
}

const TaskForm: FC<TaskFormProps> = ({
  handleAddTask,
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
  userId,
  isLoading
}) => {
  return (
    <form onSubmit={handleAddTask} className="mb-8 p-6 bg-slate-800/50 backdrop-blur-md rounded-xl shadow-2xl max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-sky-300">Add New Task</h2>
      <div className="mb-4">
        <label htmlFor="newTaskTitle" className="block text-sm font-medium text-slate-300 mb-1">Title</label>
        <input
          id="newTaskTitle"
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter task title"
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="newTaskDesc" className="block text-sm font-medium text-slate-300 mb-1">Description</label>
        <textarea
          id="newTaskDesc"
          value={newTaskDesc}
          onChange={(e) => setNewTaskDesc(e.target.value)}
          placeholder="Enter task description"
          rows={3}
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="newDueDate" className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
          <input
            id="newDueDate"
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
          />
        </div>
        <div>
          <label htmlFor="newPriority" className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
          <select
            id="newPriority"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors appearance-none"
          >
            {PRIORITIES.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-4">
        <button
          type="button"
          onClick={() => getAISubtaskSuggestions(newTaskTitle, newTaskDesc)}
          disabled={isSuggestingSubtasks || !newTaskTitle.trim()}
          className="flex items-center justify-center gap-2 w-full text-sm bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 px-3 rounded-lg shadow transition-colors disabled:opacity-60"
        >
          <LightBulbIcon /> {isSuggestingSubtasks ? 'Thinking...' : 'Suggest Subtasks (AI)'}
        </button>
        {suggestedSubtasks.length > 0 && (
          <div className="mt-2 p-3 bg-slate-700 rounded-md">
            <p className="text-xs text-slate-400 mb-1">AI Suggestions (click to add to description, or create manually):</p>
            <ul className="list-disc list-inside text-sm text-slate-200">
              {suggestedSubtasks.map((suggestion, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:text-sky-300"
                  onClick={() => setNewTaskDesc(prev => `${prev}\n- ${suggestion}`.trim())}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={!userId || isLoading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PlusIcon /> Add Task
      </button>
    </form>
  );
};

export default TaskForm; 