import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface Task {
  id: string;
  description: string;
  isDone: boolean;
  createdAt: Date;
}

type TaskStatus = 'all' | 'pending' | 'finished';

interface TaskContextType {
  tasks: Task[];
  status: TaskStatus;
  createTask: (description: string) => Promise<void>;
  markTask: (id: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  setStatus: (status: TaskStatus) => void;
  removeFinished: () => Promise<void>;
  pendingCount: number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<TaskStatus>('all');

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/todos');
        setTasks(response.data.map((todo: any) => ({
          id: todo.id,
          description: todo.text,
          isDone: todo.completed,
          createdAt: new Date(todo.createdAt)
        })));
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const pendingCount = tasks.filter(task => !task.isDone).length;

  const createTask = async (description: string) => {
    const response = await axios.post('/api/todos', { text: description });
    setTasks([...tasks, { 
      ...response.data, 
      description: response.data.text,
      isDone: response.data.completed,
      createdAt: new Date(response.data.createdAt)
    }]);
  };

  const markTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    try {
      await axios.patch(`/api/todos/${id}`, { completed: !task.isDone });
      setTasks(tasks.map(t => 
        t.id === id ? { ...t, isDone: !t.isDone } : t
      ));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const removeTask = async (id: string) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const removeFinished = async () => {
    try {
      await axios.delete('/api/todos/completed');
      setTasks(tasks.filter(t => !t.isDone));
    } catch (error) {
      console.error('Failed to clear completed tasks:', error);
    }
  };

  // Get filtered tasks based on current status
  const filteredTasks = tasks.filter(task => {
    if (status === 'pending') return !task.isDone;
    if (status === 'finished') return task.isDone;
    return true;
  });

  return (
    <TaskContext.Provider value={{
      tasks: filteredTasks, // Return filtered tasks instead of all tasks
      status,
      createTask,
      markTask,
      removeTask,
      setStatus,
      removeFinished,
      pendingCount,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskManager() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskManager must be used within a TaskProvider');
  }
  return context;
} 