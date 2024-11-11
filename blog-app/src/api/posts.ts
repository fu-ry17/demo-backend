import express from 'express';

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  tags: string[];
}

export class PostService {
  private posts: Post[] = [];

  getAllPosts(): Post[] {
    return this.posts;
  }

  getPostById(id: number): Post | null {
    return this.posts.find(post => post.id === id) || null;
  }

  createPost(postData: Omit<Post, 'id' | 'createdAt'>): Post {
    const newPost: Post = {
      id: this.posts.length + 1,
      ...postData,
      createdAt: new Date()
    };
    this.posts.push(newPost);
    return newPost;
  }

  updatePost(id: number, updates: Partial<Post>): Post | null {
    const postIndex = this.posts.findIndex(post => post.id === id);
    if (postIndex === -1) return null;
    
    this.posts[postIndex] = { ...this.posts[postIndex], ...updates };
    return this.posts[postIndex];
  }

  deletePost(id: number): boolean {
    const initialLength = this.posts.length;
    this.posts = this.posts.filter(post => post.id !== id);
    return this.posts.length !== initialLength;
  }

  getPostsByTag(tag: string): Post[] {
    return this.posts.filter(post => post.tags.includes(tag));
  }
}

export const postService = new PostService();
export const postsRouter = express.Router();

postsRouter.get('/', (req, res) => {
  const tag = req.query.tag as string;
  if (tag) {
    return res.json(postService.getPostsByTag(tag));
  }
  res.json(postService.getAllPosts());
});

postsRouter.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const post = postService.getPostById(id);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  res.json(post);
});

postsRouter.post('/', (req, res) => {
  const { title, content, author, tags } = req.body;
  
  if (!title?.trim() || !content?.trim() || !author?.trim()) {
    return res.status(400).json({ error: 'Title, content, and author are required' });
  }

  const newPost = postService.createPost({ title, content, author, tags: tags || [] });
  res.status(201).json(newPost);
});

postsRouter.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;
  
  const updatedPost = postService.updatePost(id, updates);
  if (!updatedPost) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  res.json(updatedPost);
});

postsRouter.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = postService.deletePost(id);
  
  if (!deleted) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  res.status(204).send();
}); 