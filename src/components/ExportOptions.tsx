import React, { FC, useState } from 'react';
import { Task } from '../types';
import { DownloadIcon } from './icons';

interface ExportOptionsProps {
  tasks: Task[];
  onExport: (format: 'csv' | 'json', includeSubtasks: boolean) => void;
}

const ExportOptions: FC<ExportOptionsProps> = ({ tasks, onExport }) => {
  const [includeSubtasks, setIncludeSubtasks] = useState(true);

  const handleExport = (format: 'csv' | 'json') => {
    onExport(format, includeSubtasks);
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Export Tasks</h2>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="includeSubtasks"
            checked={includeSubtasks}
            onChange={(e) => setIncludeSubtasks(e.target.checked)}
            className="w-4 h-4 text-sky-500 bg-slate-700 border-slate-600 rounded focus:ring-sky-500"
          />
          <label htmlFor="includeSubtasks" className="text-slate-300">
            Include subtasks
          </label>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => handleExport('csv')}
            className="flex-1 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors flex items-center justify-center gap-2"
          >
            <DownloadIcon className="w-5 h-5" />
            Export as CSV
          </button>
          <button
            onClick={() => handleExport('json')}
            className="flex-1 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors flex items-center justify-center gap-2"
          >
            <DownloadIcon className="w-5 h-5" />
            Export as JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions; 