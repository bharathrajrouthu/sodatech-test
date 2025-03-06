import { useState } from 'react';
import { useTodo } from '../context/TodoContext';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

export default function Todo() {
  const [newTodo, setNewTodo] = useState('');
  const {
    todos,
    filter,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter,
    clearCompleted,
    remainingCount,
  } = useTodo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      await addTodo(newTodo.trim());
      setNewTodo('');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Todo App
      </h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      <div className="bg-white rounded-lg shadow">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center px-4 py-3 border-b last:border-b-0"
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className="mr-3 text-gray-400 hover:text-gray-600"
            >
              {todo.completed ? (
                <CheckCircleSolidIcon className="w-6 h-6 text-green-500" />
              ) : (
                <CheckCircleIcon className="w-6 h-6" />
              )}
            </button>
            <span
              className={`flex-1 ${
                todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="ml-2 text-gray-400 hover:text-red-500"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>{remainingCount} items left</span>
        <div className="space-x-2">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={clearCompleted}
          className="text-gray-600 hover:text-gray-800"
        >
          Clear completed
        </button>
      </div>
    </div>
  );
} 