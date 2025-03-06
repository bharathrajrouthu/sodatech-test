import { createContext, useContext, useState, ReactNode } from 'react';
import { Todo, TodoFilter } from '../types/todo';
import axios from 'axios';

interface TodoContextType {
  todos: Todo[];
  filter: TodoFilter;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  setFilter: (filter: TodoFilter) => void;
  clearCompleted: () => Promise<void>;
  remainingCount: number;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');

  const remainingCount = todos.filter(todo => !todo.completed).length;

  const addTodo = async (text: string) => {
    const response = await axios.post('/api/todos', { text });
    setTodos([...todos, response.data]);
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    await axios.patch(`/api/todos/${id}`, { completed: !todo.completed });
    setTodos(todos.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTodo = async (id: string) => {
    await axios.delete(`/api/todos/${id}`);
    setTodos(todos.filter(t => t.id !== id));
  };

  const clearCompleted = async () => {
    await axios.delete('/api/todos/completed');
    setTodos(todos.filter(t => !t.completed));
  };

  return (
    <TodoContext.Provider value={{
      todos,
      filter,
      addTodo,
      toggleTodo,
      deleteTodo,
      setFilter,
      clearCompleted,
      remainingCount,
    }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
} 