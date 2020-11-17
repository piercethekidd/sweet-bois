const reddit = require('../util/reddit');
const { SUBREDDIT } = process.env;

module.exports = {
    description: 'Feed your thirsty ass bitch',
    execute: async (args, msg) => {
        try {
            const res = await reddit.get(`/r/${SUBREDDIT}/hot`, {
                count: 0,
                limit: 1,
                show: 'all',
            });

            const { url, title } = res.data.children[res.data.children.length-1].data;
            
            const message = await msg.channel.send(`${title}\n${url}`);
            console.log(message.content);

        } catch (err) {
            console.error(err);
        }

    },
}