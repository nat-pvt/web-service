export async function errorHandler(ctx, next) {
  try {
    await next();

    if (ctx.status === 404 && ctx.body === undefined) {
      ctx.status = 404;
      ctx.body = { error: 'route introuvable' };
    }
  } catch (err) {
    if (err instanceof URIError) {
      ctx.status = 400;
      ctx.body = { error: 'url invalide' }
      return;
    }

    const status = err.statusCode || err.status || 500;
    ctx.status = status;
    ctx.body = {
      error: status >= 500 ? 'erreur serveur' : (err.message || 'requete invalide')
    };
  }
}
