import { describe, expect, it, beforeEach } from '@jest/globals';
import { PostService } from '../../src/api/posts';

describe('PostService', () => {
  let postService: PostService;

  beforeEach(() => {
    postService = new PostService();
  });

  it('should create a new post', () => {
    const postData = {
      title: 'Test Post',
      content: 'Test Content',
      author: 'Test Author',
      tags: ['test']
    };

    const post = postService.createPost(postData);
    expect(post.title).toBe(postData.title);
    expect(post.content).toBe(postData.content);
    expect(post.author).toBe(postData.author);
    expect(post.tags).toEqual(postData.tags);
    expect(post.id).toBe(1);
    expect(post.createdAt).toBeInstanceOf(Date);
  });

  it('should get all posts', () => {
    postService.createPost({
      title: 'Post 1',
      content: 'Content 1',
      author: 'Author 1',
      tags: ['tag1']
    });
    postService.createPost({
      title: 'Post 2',
      content: 'Content 2',
      author: 'Author 2',
      tags: ['tag2']
    });

    const posts = postService.getAllPosts();
    expect(posts.length).toBe(2);
    expect(posts[0].title).toBe('Post 1');
    expect(posts[1].title).toBe('Post 2');
  });

  it('should get posts by tag', () => {
    postService.createPost({
      title: 'Post 1',
      content: 'Content 1',
      author: 'Author 1',
      tags: ['javascript']
    });
    postService.createPost({
      title: 'Post 2',
      content: 'Content 2',
      author: 'Author 2',
      tags: ['typescript']
    });

    const jsPosts = postService.getPostsByTag('javascript');
    expect(jsPosts.length).toBe(1);
    expect(jsPosts[0].title).toBe('Post 1');
  });

  it('should update a post', () => {
    const post = postService.createPost({
      title: 'Original Title',
      content: 'Original Content',
      author: 'Original Author',
      tags: []
    });

    const updated = postService.updatePost(post.id, { title: 'Updated Title' });
    expect(updated?.title).toBe('Updated Title');
    expect(updated?.content).toBe('Original Content');
  });

  it('should delete a post', () => {
    const post = postService.createPost({
      title: 'Test Post',
      content: 'Test Content',
      author: 'Test Author',
      tags: []
    });

    const deleted = postService.deletePost(post.id);
    expect(deleted).toBe(true);
    expect(postService.getAllPosts().length).toBe(0);
  });
}); 