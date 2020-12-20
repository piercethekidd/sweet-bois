const reddit        = require('../util/reddit');
const { PREFIX }    = process.env;

module.exports = {
    show: true,
    description: 'Feed your thirsty ass bitch',
    help: `${PREFIX}feedme <subreddit> [...more subreddits] to get a random post from the specified subreddits`,
    execute: async (args, msg) => {
        try {
            // throw error if args are missing
            if (args.length === 0) throw new Error(`Missing required arguments`);

            // search for results then get random post
            const search_args = args.join('+');
            const res = await reddit.get(`/r/${search_args}/hot`, {
                limit: Math.floor(Math.random() * 100),
                show: 'all',
            });

            // throw error if results not found 
            const post = res.data.children[res.data.children.length-1];
            if (post === undefined) throw new Error (`Ho sang did not find any results for '${args.join(' ')}'`);

            // send to discord
            const { url, title, id } = post.data;
            const reddit_url = `(https://redd.it/${id})`;
            const message = await msg.channel.send(`${title} ${reddit_url}\n${url}`);
            console.log(message.content);

        } catch (err) {
            console.error(`Error: ${err.message}`);
            const message = await msg.channel.send(err.message);
            console.log(message.content);
        }
    },
}