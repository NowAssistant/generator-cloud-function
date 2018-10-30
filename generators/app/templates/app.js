const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const logger = require('@adenin/cf-logger');

const app = new Koa();

const routes = require('./index');

app
  .use(bodyParser())
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = {
        error: err.message
      };

      ctx.app.emit('error', err, ctx);
    }
  })
  .use(async ctx => {
    const service = ctx.url.split('/')[1];

    if (routes[service]) {
      await routes[service](ctx);
    } else {
      ctx.status = 404;
      ctx.body = {
        error: 'Route not found',
        routes: Object.keys(routes)
      };
    }
  })
  .on('error', (err, ctx) => {
    logger.error({
      error: err,
      context: ctx
    });
  })
  .listen(3000);

logger.info('Server running on port 3000');