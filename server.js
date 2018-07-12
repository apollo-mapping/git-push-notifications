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
    console.log(body.pusher);

    if (!body.pusher) {
        ctx.status = 422;
        ctx.body = {
            message: 'Server only accepts push events.'
        };
        return;
    }

    const repoRegex = Config.repoRegex;

    let matches = false;

    for (let regex of repoRegex) {
        if (body.repository.full_name.match(regex))
            matches = true;
    }

    if (!matches) {
        ctx.status = 403;
        ctx.body = {
            message: 'Repository doesn\'t match allowed repos.'
        };
        return;
    }


    let subject = 'Re: [' + body.repository.full_name + '] ' + body.head_commit.message;
    console.log(subject);

    let content = '<p><a href="' + body.sender.html_url + '" class="user-mention">@' + body.sender.login +'</a> pushed '
        + body.commits.length + ' ' + (body.commits.length > 1 ? 'commits.' : 'commit.') + '</p>\n\n' +
        '<ul>';

    for (let commit of body.commits) {
        content += '<li><a class="commit-link" href="' + commit.url + '">' + commit.id.substr(0, 7) + '</a>  '
            + commit.message + '</li>';
    }

    content += '</ul>';

    console.log(content);

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