import express from 'express';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export class TodoService {
  private todos: Todo[] = [];

  getAllTodos(): Todo[] {
    return this.todos;
  }

  createTodo(text: string): Todo {
    const newTodo: Todo = {
      id: this.todos.length + 1,
      text,
      completed: false
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  updateTodo(id: number, updates: Partial<Todo>): Todo | null {
    const todoIndex = this.todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) return null;
    
    this.todos[todoIndex] = { ...this.todos[todoIndex], ...updates };
    return this.todos[todoIndex];
  }

  deleteTodo(id: number): boolean {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter(todo => todo.id !== id);
    return this.todos.length !== initialLength;
  }
}

export const todoService = new TodoService();
export const todosRouter = express.Router();

todosRouter.get('/', (req, res) => {
  res.json(todoService.getAllTodos());
});

todosRouter.post('/', (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) {
    return res.status(400).json({ error: 'Text is required' });
  }
  const newTodo = todoService.createTodo(text);
  res.status(201).json(newTodo);
});

todosRouter.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;
  
  const updatedTodo = todoService.updateTodo(id, updates);
  if (!updatedTodo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  res.json(updatedTodo);
});

todosRouter.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = todoService.deleteTodo(id);
  
  if (!deleted) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  res.status(204).send();
}); 