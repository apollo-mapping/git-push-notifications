const Koa = require('koa');
const logger = require('koa-logger');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const Config = require('./Config');
const ipFilter = require('koa-ip');
const {google} = require('googleapis');
const auth = require('./auth');

auth((authClient) => {
    console.log(authClient)
});

const app = new Koa();
let router = new Router();

app.use(logger());
app.use(bodyParser());
app.use(cors());
/*app.use(ipFilter({
    whitelist: ['207.97.227.253', '50.57.128.197', '108.171.174.178'],
    handler: async(ctx) => {
        ctx.status = 403
    }
}));*/


router.post('/hook', (ctx, next) => {
    const body = ctx.request.body;

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

    let html = getHtml(body);
    console.log(html);
    let text = getText(body);
    console.log(text);


    ctx.status = 200;
    ctx.body = {
        "passed": true
    }
});

let getText = (body) => {
    let content = '@' + body.sender.login + ' pushed ' + body.commits.length
        + (body.commits.length > 1 ? ' commits\n': ' commit.\n');

    for (let commit of body.commits) {
        content+='\n' + commit.id.substr(0,7) + '  ' + commit.message;
    }

    return content
};

let getHtml = (body) => {

    let content = '<p><a href="' + body.sender.html_url + '" class="user-mention">@' + body.sender.login +'</a> pushed '
        + body.commits.length + (body.commits.length > 1 ? ' commits.' : ' commit.') + '</p>\n\n' +
        '<ul>';

    for (let commit of body.commits) {
        content += '<li><a class="commit-link" href="' + commit.url + '">' + commit.id.substr(0, 7) + '</a>  '
            + commit.message + '</li>';
    }

    content += '</ul>';

    return content;
};


app.use(router.routes());
app.use(router.allowedMethods());

app.listen(Config.PORT, () => {
    console.log('Running on port: ' + Config.PORT);
});