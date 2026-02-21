import crypto from 'crypto';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo.js';

export class TodoStore {
  private todos: Todo[] = [];

  create(request: CreateTodoRequest): Todo {
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: request.title,
      completed: false,
      createdAt: new Date(),
    };
    this.todos.push(todo);
    return todo;
  }

  findAll(): Todo[] {
    return [...this.todos];
  }

  findById(id: string): Todo | null {
    return this.todos.find((todo) => todo.id === id) ?? null;
  }

  update(id: string, updates: UpdateTodoRequest): Todo | null {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      return null;
    }
    const existing = this.todos[index];
    const updated: Todo = {
      ...existing,
      ...updates,
    };
    this.todos[index] = updated;
    return updated;
  }

  delete(id: string): boolean {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      return false;
    }
    this.todos.splice(index, 1);
    return true;
  }
}

export const todoStore = new TodoStore();
