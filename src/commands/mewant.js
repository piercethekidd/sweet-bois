const reddit    = require('../util/reddit');
const _         = require('lodash');

module.exports = {
    description: 'Me want cookie',
    execute: async (args, msg) => {
        try {
            // throw error if args are missing
            if (args.length === 0) {
                const err_message = `Missing required arguments`;
                await msg.channel.send(err_message);
                throw err_message;
            }

            // search for results
            const q = args.join(' ');
            const res = await reddit.get(`/search`, {
                limit: 10,
                show: 'all',
                sort: 'top',
                q
            });

            // extract necessary info from resulting array
            let posts = res.data.children;
            posts = _.map(posts, (post) => {
                const { title, id, url, subreddit} = post.data;
                return { id, title, url, subreddit };
            });

            // format result message
            let msgcontent = '```fix\nSearch Results:\n---------------\n';
            posts.forEach((post, index) => {
                msgcontent += `${index+1}.) ${post.title} from r/${post.subreddit} (https://redd.it/${post.id})\n`;
            });
            msgcontent += '```';

            // send results
            const message = await msg.channel.send(msgcontent);
            console.log(message.content);

        } catch (err) {
            console.error(`Error: ${err.message}`);
            const message = await msg.channel.send(`Ho sang did not find any results for '${args.join(' ')}'`);
            console.log(message.content);
        }
    },
}