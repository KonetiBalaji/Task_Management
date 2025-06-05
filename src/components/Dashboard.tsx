import React, { FC } from 'react';
import { Task } from '../types';

interface DashboardProps {
  tasks: Task[];
  totalMembers: number;
}

const Dashboard: FC<DashboardProps> = ({ tasks, totalMembers }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Total Tasks</h3>
        <p className="text-3xl font-bold text-sky-400">{totalTasks}</p>
      </div>
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Completion Rate</h3>
        <p className="text-3xl font-bold text-sky-400">{completionRate.toFixed(1)}%</p>
      </div>
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Team Members</h3>
        <p className="text-3xl font-bold text-sky-400">{totalMembers}</p>
      </div>
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">In Progress</h3>
        <p className="text-3xl font-bold text-sky-400">{inProgressTasks}</p>
      </div>
    </div>
  );
};

export default Dashboard; 