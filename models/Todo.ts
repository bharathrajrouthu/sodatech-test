import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please provide a text for this todo.'],
    maxlength: [200, 'Text cannot be more than 200 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Todo || mongoose.model('Todo', TodoSchema);

export interface Todo {
  id: number;  // Changed from string to number to match MySQL auto-increment
  text: string;
  completed: boolean;
  createdAt: Date;
}

export type TodoFilter = 'all' | 'active' | 'completed'; 