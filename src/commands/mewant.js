const reddit    = require('../util/reddit');
const _         = require('lodash');

module.exports = {
    description: 'Me want cookie',
    execute: async (args, msg) => {
        try {
            // throw error if args are missing
            if (args.length < 2) {
                const err_message = `Missing required arguments`;
                await msg.channel.send(err_message);
                return;
            }

            // check for --general flag
            let isGeneralSearch = false;
            args.forEach((arg, index) => {
                if (arg === '--general' || arg === '--g') {
                    isGeneralSearch = true;
                    args.splice(index, 1);
                }
            });

            let res;
            // enable general search
            if (isGeneralSearch) {
                res = await reddit.get(`/search`, {
                    limit: 10,
                    show: 'all',
                    sort: 'top',
                    q: args.join(' '),
                });
            }

            // enable subreddit search
            else {
                const [subreddit] = args.splice(0, 1);
                res = await reddit.get(`/r/${subreddit}/search/`, {
                    limit: 10,
                    show: 'all',
                    sort: 'top',
                    q: args.join(' '),
                    restrict_sr: true,
                });
            }

            // extract necessary info from resulting array
            let posts = res.data.children;
            if (posts.length === 0) throw 'Did not find any results';
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