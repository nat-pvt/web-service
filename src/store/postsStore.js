import { readFileSync } from 'node:fs';

const seedPath = new URL('../../posts.seed.json', import.meta.url);
const seedData = JSON.parse(readFileSync(seedPath, 'utf8'));

const posts = seedData.map((post) => ({ ...post }));
let nextId = posts.reduce((max, post) => Math.max(max, post.id), 0) + 1;

export function getPosts(postId) {
  const list = postId === undefined
    ? posts
    : posts.filter((post) => post.postId === postId);
  return list.map((post) => ({ ...post }));
}

export function getPostById(id) {
  const post = posts.find((item) => item.id === id);
  return post ? { ...post } : null;
}

export function createPost({ postId, name, email, body }) {
  const post = { postId, id: nextId++, name, email, body };
  posts.push(post)
  return { ...post };
}

export function replacePost(id, { postId, name, email, body }) {
  const index = posts.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updated = { postId, id, name, email, body };
  posts[index] = updated
  return { ...updated };
}

export function updatePost(id, fields) {
  const post = posts.find((item) => item.id === id);
  if (!post) return null;

  Object.assign(post, fields)
  return { ...post };
}

export function deletePost(id) {
  const index = posts.findIndex((item) => item.id === id);
  if (index === -1) return false;

  posts.splice(index, 1)
  return true;
}
