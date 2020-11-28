const reddit        = require('../util/reddit');
const _             = require('lodash');
const { PREFIX }    = process.env;

module.exports = {
    description: 'View entries from reddit',
    help: `${PREFIX}giffme <id> [...ids] to view subreddit post/s`,
    execute: async (args, msg) => {
        try {
            // throw error if args are missing
            if (args.length === 0) throw new Error(`Missing required arguments`);

            // format to fullname, then get posts from api
            let id = _.map(args, arg => `t3_${arg}`);
            id = id.join(', ');
            const res = await reddit.get(`/api/info`, {id});

            // return error if it returns no results
            const posts = res.data.children;
            if(posts.length === 0) throw new Error(`Ho sang did not find any posts for '${args.join(' ')}'`);

            // send results to discord
            let msgPromise = [];
            posts.forEach(post => {
                const { url, title, id } = post.data;
                const reddit_url = `(https://redd.it/${id})`;
                msgPromise.push(msg.channel.send(`${title} ${reddit_url}\n${url}`));
            });
            const messages = await Promise.all(msgPromise);
            messages.forEach(message => {
                console.log(message.content);
            });

        } catch (err) {
            console.error(`Error: ${err.message}`);
            const message = await msg.channel.send(err.message);
            console.log(message.content);
        }
    },
}