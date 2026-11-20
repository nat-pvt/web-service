import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { errorHandler } from './middlewares/errorHandler.js';
import postsRouter from './routes/postsRoutes.js';

const app = new Koa();

app.use(errorHandler);

app.use(
  bodyParser({
    enableTypes: ['json'],
    jsonLimit: '1mb',
    onerror(err, ctx) {
      const status = err.status || 400;
      ctx.throw(status, status === 413 ? 'corps trop grand' : 'json invalide')
    }
  })
);

app.use(postsRouter.routes());
app.use(
  postsRouter.allowedMethods({
    throw: true,
    notImplemented() {
      const err = new Error('methode non supportée');
      err.status = 405
      return err;
    },
    methodNotAllowed() {
      const err = new Error('methode non autorisée');
      err.status = 405
      return err;
    }
  })
);

export default app;
