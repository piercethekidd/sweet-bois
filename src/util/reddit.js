const Reddit = require('reddit');
const { REDDIT_APP_ID, REDDIT_APP_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD } = process.env;

module.exports = new Reddit({
    username: REDDIT_USERNAME,
    password: REDDIT_PASSWORD,
    appId: REDDIT_APP_ID,
    appSecret: REDDIT_APP_SECRET,
    userAgent: 'SweetBot/1.0.0 by u/piercethekidd',
});