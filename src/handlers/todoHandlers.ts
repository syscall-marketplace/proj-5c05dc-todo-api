import { Request, Response } from 'express';
import { todoStore } from '../store/todoStore.js';
import { Todo, TodoResponse, CreateTodoRequest, UpdateTodoRequest, ValidationError } from '../types/todo.js';

function toTodoResponse(todo: Todo): TodoResponse {
  return {
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
    createdAt: todo.createdAt.toISOString(),
  };
}

function validateCreateRequest(body: unknown): ValidationError[] {
  const errors: ValidationError[] = [];
  const data = body as Record<string, unknown>;

  if (data.title === undefined || data.title === null) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (typeof data.title !== 'string') {
    errors.push({ field: 'title', message: 'Title must be a string' });
  } else if (data.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title must be a non-empty string' });
  }

  return errors;
}

function validateUpdateRequest(body: unknown): ValidationError[] {
  const errors: ValidationError[] = [];
  const data = body as Record<string, unknown>;

  if (data.title !== undefined) {
    if (typeof data.title !== 'string') {
      errors.push({ field: 'title', message: 'Title must be a string' });
    } else if (data.title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Title must be a non-empty string' });
    }
  }

  if (data.completed !== undefined && typeof data.completed !== 'boolean') {
    errors.push({ field: 'completed', message: 'Completed must be a boolean' });
  }

  return errors;
}

export async function createTodo(req: Request, res: Response): Promise<void> {
  const errors = validateCreateRequest(req.body);
  if (errors.length > 0) {
    res.status(400).json({ error: 'Validation failed', details: errors });
    return;
  }

  const request: CreateTodoRequest = { title: (req.body as Record<string, string>).title.trim() };
  const todo = todoStore.create(request);
  res.status(201).json(toTodoResponse(todo));
}

export async function getAllTodos(_req: Request, res: Response): Promise<void> {
  const todos = todoStore.findAll();
  res.status(200).json(todos.map(toTodoResponse));
}

export async function getTodoById(req: Request, res: Response): Promise<void> {
  const todo = todoStore.findById(req.params.id);
  if (!todo) {
    res.status(404).json({ error: 'Todo not found' });
    return;
  }
  res.status(200).json(toTodoResponse(todo));
}

export async function updateTodo(req: Request, res: Response): Promise<void> {
  const errors = validateUpdateRequest(req.body);
  if (errors.length > 0) {
    res.status(400).json({ error: 'Validation failed', details: errors });
    return;
  }

  const updates: UpdateTodoRequest = {};
  const body = req.body as Record<string, unknown>;
  if (typeof body.title === 'string') {
    updates.title = body.title.trim();
  }
  if (typeof body.completed === 'boolean') {
    updates.completed = body.completed;
  }

  const todo = todoStore.update(req.params.id, updates);
  if (!todo) {
    res.status(404).json({ error: 'Todo not found' });
    return;
  }
  res.status(200).json(toTodoResponse(todo));
}

export async function deleteTodo(req: Request, res: Response): Promise<void> {
  const deleted = todoStore.delete(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Todo not found' });
    return;
  }
  res.status(204).send();
}
