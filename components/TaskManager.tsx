import { useState } from 'react';
import { useTaskManager } from '../context/TaskContext';
import { PlusCircleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

export default function TaskManager() {
  const [newTask, setNewTask] = useState('');
  const {
    tasks,
    status,
    createTask,
    markTask,
    removeTask,
    setStatus,
    removeFinished,
    pendingCount,
  } = useTaskManager();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      await createTask(newTask.trim());
      setNewTask('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 rounded-t-2xl">
        <h1 className="text-4xl font-bold text-white text-center mb-6">
          Task Manager
        </h1>

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="w-full px-6 py-3 pr-12 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-700"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800"
          >
            <PlusCircleIcon className="w-8 h-8" />
          </button>
        </form>
      </div>

      <div className="bg-white rounded-b-2xl shadow-xl">
        <div className="divide-y divide-gray-100">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <button
                onClick={() => markTask(task.id)}
                className="mr-4 focus:outline-none"
              >
                {task.isDone ? (
                  <CheckCircleSolidIcon className="w-7 h-7 text-green-500" />
                ) : (
                  <CheckCircleIcon className="w-7 h-7 text-gray-400 hover:text-green-500" />
                )}
              </button>
              <div className="flex-1">
                <p
                  className={`text-lg ${
                    task.isDone ? 'line-through text-gray-400' : 'text-gray-700'
                  }`}
                >
                  {task.description}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(task.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => removeTask(task.id)}
                className="ml-4 text-gray-400 hover:text-red-500 focus:outline-none"
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              {status === 'all' && 'No tasks yet. Add one above!'}
              {status === 'pending' && 'No pending tasks!'}
              {status === 'finished' && 'No completed tasks!'}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex items-center justify-between">
          <span className="text-sm text-gray-600 font-medium">
            {pendingCount} tasks remaining
          </span>
          
          <div className="flex space-x-2">
            {(['all', 'pending', 'finished'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  status === s
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={removeFinished}
            className="text-sm text-gray-600 hover:text-red-500 font-medium"
            disabled={!tasks.some(task => task.isDone)}
          >
            Clear finished
          </button>
        </div>
      </div>
    </div>
  );
} 