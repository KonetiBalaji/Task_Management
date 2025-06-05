import { useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { Task, Subtask } from '../types';

export const useTask = (boardId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = async (task: Omit<Task, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const tasksRef = collection(db, 'tasks');
      await addDoc(tasksRef, {
        ...task,
        boardId,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, updates);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    setLoading(true);
    setError(null);
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const addSubtask = async (taskId: string, subtask: Omit<Subtask, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const taskDoc = await getDoc(taskRef);
      const currentSubtasks = taskDoc.data()?.subtasks || [];
      
      await updateDoc(taskRef, {
        subtasks: [...currentSubtasks, { ...subtask, id: Date.now().toString() }]
      });
    } catch (err) {
      console.error('Error adding subtask:', err);
      setError('Failed to add subtask');
    } finally {
      setLoading(false);
    }
  };

  const updateSubtask = async (taskId: string, subtaskId: string, updates: Partial<Subtask>) => {
    setLoading(true);
    setError(null);
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const taskDoc = await getDoc(taskRef);
      const currentSubtasks = taskDoc.data()?.subtasks || [];
      
      const updatedSubtasks = currentSubtasks.map((subtask: Subtask) =>
        subtask.id === subtaskId ? { ...subtask, ...updates } : subtask
      );

      await updateDoc(taskRef, { subtasks: updatedSubtasks });
    } catch (err) {
      console.error('Error updating subtask:', err);
      setError('Failed to update subtask');
    } finally {
      setLoading(false);
    }
  };

  const deleteSubtask = async (taskId: string, subtaskId: string) => {
    setLoading(true);
    setError(null);
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const taskDoc = await getDoc(taskRef);
      const currentSubtasks = taskDoc.data()?.subtasks || [];
      
      const updatedSubtasks = currentSubtasks.filter(
        (subtask: Subtask) => subtask.id !== subtaskId
      );

      await updateDoc(taskRef, { subtasks: updatedSubtasks });
    } catch (err) {
      console.error('Error deleting subtask:', err);
      setError('Failed to delete subtask');
    } finally {
      setLoading(false);
    }
  };

  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    setLoading(true);
    setError(null);
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const taskDoc = await getDoc(taskRef);
      const currentSubtasks = taskDoc.data()?.subtasks || [];

      const updatedSubtasks = currentSubtasks.map((subtask: Subtask) =>
        subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
      );

      await updateDoc(taskRef, { subtasks: updatedSubtasks });
    } catch (err) {
      console.error('Error toggling subtask:', err);
      setError('Failed to toggle subtask');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    toggleSubtask
  };
}; 