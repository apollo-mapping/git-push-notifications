const Koa = require('koa');
const logger = require('koa-logger');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const Config = require('./Config');
const ipFilter = require('koa-ip');
const {google} = require('googleapis');
const auth = require('./auth');
let oauthClient = '';

auth((authClient) => {
    oauthClient = authClient;
});

const app = new Koa();
let router = new Router();

app.use(logger());
app.use(bodyParser());
app.use(cors());
if (Config.production) {
    app.use(ipFilter({
        whitelist: ['207.97.227.253', '50.57.128.197', '108.171.174.178'],
        handler: async(ctx) => {
            ctx.status = 403
        }
    }));
}


router.post('/hook', (ctx, next) => {
    const body = ctx.request.body;

    console.log(JSON.parse(body.payload));
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

    sendEmail(subject, html);


    ctx.status = 200;
    ctx.body = {
        "passed": true
    }
});

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

let sendEmail = (subject, content) => {
    let gmailClass = google.gmail('v1');

    let email_lines = [];

    email_lines.push('From: "' + Config.mail.from + '" <' + Config.mail.fromEmail + '>');
    email_lines.push('To: ' + Config.mail.to[0]);
    email_lines.push('Content-type: text/html;charset=iso-8859-1');
    email_lines.push('MIME-Version: 1.0');
    email_lines.push('Subject: ' + subject);
    email_lines.push('');
    content = content.split('\n');
    for (let con of content)
        email_lines.push(con);

    let email = email_lines.join('\r\n').trim();

    let base64EncodedEmail = new Buffer(email).toString('base64');
    base64EncodedEmail = base64EncodedEmail.replace(/\+/g, '-').replace(/\//g, '_');

    gmailClass.users.messages.send({
        auth: oauthClient,
        userId: 'me',
        resource: {
            raw: base64EncodedEmail
        }
    }, (err, results) => {
        if (err) {
            console.log('err:', err);
        } else {
            console.log(results);
        }
    });
};

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(Config.PORT, () => {
    console.log('Running on port: ' + Config.PORT);
});