# Github Email Notifier

Simple node server to send emails on push webhook.

## Install
`git clone https://github.com/apollomapping/git-push-notifications.git`

`npm install`

## Usage
### Preparation

Navigate to the Google developer console and create a new project. 
Enable the gmail API and create a set of credentials for your app.
Download the credentials as a json file, rename it to `client_secret.json`
and put it in the root folder of the project.

When you run this, a new window should open prompting you to login.
Complete the login, authorize the permissions, and copy and paste the 
code you receive into the terminal, hitting enter afterwards. You should'nt
have to login more than once as the refresh token is stored.

### Configure

`cp Config.example.js Config.js`

Set your parameters in the config file according to the comments:

```javascript
module.exports = {
    PORT: 8888, // Port app will run on
    repoRegex: ['example/.+', 'example/myRepo'], //You can use regex strings to match a variety of origin repos or just one
    mail: {
        from: 'Person', //The user the email will appear to originate from
        fromEmail: 'user@gmail.com', // The address the email will appear to originate from;
        to: ['user1@gmail.com', 'user2@gmail.com'], //An array of people to send the email to
    }
};
```

### Set up webhook

  1. Navigate to a repository you own, e.g., `https://github.com/user/repo`
  1. Click on *Settings* in the right sidebar
  1. Click on *Webhooks & Services* in the left sidebar
  1. Click on *Add Webhook*
  1. Enter the URL you are hosting this server on, e.g., `http://mydomain.com:8888/`
  1. Set the content type to `application/json`
  1. Select the radio button *Just the `push` event*
  1. Click on the green *Add Webhook* button

### Run

`npm start`