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