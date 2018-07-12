module.exports = {
    PORT: 8888, // Port app will run on
    repoRegex: ['example/.+', 'example/myRepo'], //You can use regex strings to match a variety of origin repos or just one
    mail: {
        from: 'Person', //The user the email will appear to originate from
        fromEmail: 'user@gmail.com', // The address the email will appear to originate from;
        to: ['user1@gmail.com', 'user2@gmail.com'], //An array of people to send the email to
    }
};