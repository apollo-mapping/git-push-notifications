#Github Email Notifier

Simple node server to send emails on push webhook.

##Install
`git clone https://github.com/apollomapping/git-push-notifications.git`

`npm install`

##Usage
### Preparation step (this step is required only if you are using two-step verification) 

Configure application-specific passwords for your GMail account
(if you are not using two-step verification, just skip this step and use same password you are using to login to GMail)

To be able send emails using GMail from any application (including Node.js) you need to generate application-specific password to access GMail:
[My Account](https://myaccount.google.com/) -> [Sign-in & security](https://myaccount.google.com/security) -> [Signing in to Google](https://myaccount.google.com/security#signin) -> [App passwords](https://security.google.com/settings/security/apppasswords?utm_source=OGB&pli=1)

Select 'Other (Custom name)' in 'Select app'/'Select device' drop-downs, enter descriptive name for your application and device and press 'GENERATE'.
Copy provided password.

###Configure

`cp Config.example.js Config.js`

Set your parameters in the config file according to the comments:

```javascript
module.exports = {
    PORT: 8888, // Port app will run on
    repoRegex: ['example/.+', 'example/myRepo'], //You can use regex strings to match a variety of origin repos or just one
    mail: {
        user: 'user@gmail.com', //Gmail login username
        pass: 'abcdefghijklmnop', //Application password found in last step
        from: 'user@gmail.com', //The user the email will appear to originate from
        to: ['user1@gmail.com', 'user2@gmail.com'], //An array of people to send the email to
        sendHtml: true //If false, application will send text version of email instead of html version
    }
};
```

###Set up webhook

  1. Navigate to a repository you own, e.g., `https://github.com/user/repo`
  1. Click on *Settings* in the right sidebar
  1. Click on *Webhooks & Services* in the left sidebar
  1. Click on *Add Webhook*
  1. Enter the URL you are hosting this server on, e.g., `http://mydomain.com:8888/`
  1. Set the content type to `application/json`
  1. Select the radio button *Just the `push` event*
  1. Click on the green *Add Webhook* button

###Run

`npm start`