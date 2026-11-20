import Router from '@koa/router';
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  replacePost,
  updatePost
} from '../store/postsStore.js';
import { parsePositiveInt, validatePostBody } from '../validation/postValidation.js';

const router = new Router({ prefix: '/posts' });

function getPostOr404(ctx) {
  const id = parsePositiveInt(ctx.params.id);
  const post = id !== null ? getPostById(id) : null;
  if (!post) {
    ctx.throw(404, 'post introuvable')
  }
  return post;
}

router.get('/', (ctx) => {
  const { postId } = ctx.query;

  if (postId !== undefined) {
    const parsedId = parsePositiveInt(postId);
    if (parsedId === null) {
      ctx.throw(400, 'postId invalide')
    }
    ctx.body = getPosts(parsedId)
    return;
  }

  ctx.body = getPosts();
});

router.get('/:id', (ctx) => {
  ctx.body = getPostOr404(ctx);
});

router.post('/', (ctx) => {
  const data = validatePostBody(ctx.request.body, { requireAll: true });
  const created = createPost(data);

  ctx.status = 201
  ctx.set('Location', `/posts/${created.id}`);
  ctx.body = created;
});

router.put('/:id', (ctx) => {
  const existing = getPostOr404(ctx);
  const data = validatePostBody(ctx.request.body, { requireAll: true });

  ctx.body = replacePost(existing.id, data);
});

router.patch('/:id', (ctx) => {
  const existing = getPostOr404(ctx);
  const data = validatePostBody(ctx.request.body, { requireAll: false });

  ctx.body = updatePost(existing.id, data);
});

router.delete('/:id', (ctx) => {
  const existing = getPostOr404(ctx);
  deletePost(existing.id)
  ctx.status = 204;
});

export default router;
