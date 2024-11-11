import { describe, expect, it, beforeEach } from '@jest/globals';
import { TodoService } from '../../src/api/todos';

describe('TodoService', () => {
  let todoService: TodoService;

  beforeEach(() => {
    todoService = new TodoService();
  });

  it('should create a new todo', () => {
    const todo = todoService.createTodo('Test todo');
    expect(todo.text).toBe('Test todo');
    expect(todo.completed).toBe(false);
    expect(todo.id).toBe(1);
  });

  it('should get all todos', () => {
    todoService.createTodo('Todo 1');
    todoService.createTodo('Todo 2');
    const todos = todoService.getAllTodos();
    expect(todos.length).toBe(2);
    expect(todos[0].text).toBe('Todo 1');
    expect(todos[1].text).toBe('Todo 2');
  });

  it('should update a todo', () => {
    const todo = todoService.createTodo('Test todo');
    const updated = todoService.updateTodo(todo.id, { completed: true });
    expect(updated?.completed).toBe(true);
    expect(updated?.text).toBe('Test todo');
  });

  it('should return null when updating non-existent todo', () => {
    const updated = todoService.updateTodo(999, { completed: true });
    expect(updated).toBeNull();
  });

  it('should delete a todo', () => {
    const todo = todoService.createTodo('Test todo');
    const deleted = todoService.deleteTodo(todo.id);
    expect(deleted).toBe(true);
    expect(todoService.getAllTodos().length).toBe(0);
  });
}); 