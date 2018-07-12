const Koa = require('koa');
const logger = require('koa-logger');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const Config = require('./Config');

const app = new Koa();
let router = new Router();

app.use(logger());
app.use(bodyParser());
app.use(cors());

router.post('/hook', (ctx, next) => {
    const body = ctx.request.body;

    const repoRegex = Config.repoRegex;

    let matches = false;

    for (let regex of repoRegex) {
        if (body.repository.full_name.match(regex))
            matches = true;
    }

    if (!matches) {
        ctx.status = 403;
        ctx.body = {
            message: 'Repository doesn\'t match allowed repos'
        };
        return;
    }

    console.log(body.head_commit.message);
    let subject = 'Re: [' + body.repository.full_name + '] ' + body.head_commit.message;
    console.log(subject);

    let content = '<p><a href="' + body. + '"></a></p>';

    ctx.status = 200;
    ctx.body = {
        "passed": true
    }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(Config.PORT, () => {
    console.log('Running on port: ' + Config.PORT);
});