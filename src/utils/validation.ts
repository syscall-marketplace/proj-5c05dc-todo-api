import { CreateTodoRequest, UpdateTodoRequest, ValidationError } from '../types/todo.js';

export function validateCreateTodo(data: any): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!data.title) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (typeof data.title !== 'string') {
    errors.push({ field: 'title', message: 'Title must be a string' });
  } else if (data.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title cannot be empty' });
  }

  return { isValid: errors.length === 0, errors };
}

export function validateUpdateTodo(data: any): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (data.title !== undefined) {
    if (typeof data.title !== 'string') {
      errors.push({ field: 'title', message: 'Title must be a string' });
    } else if (data.title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Title cannot be empty' });
    }
  }

  if (data.completed !== undefined && typeof data.completed !== 'boolean') {
    errors.push({ field: 'completed', message: 'Completed must be a boolean' });
  }

  return { isValid: errors.length === 0, errors };
}