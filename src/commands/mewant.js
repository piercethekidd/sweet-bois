const reddit        = require('../util/reddit');
const _             = require('lodash');
const { firebase }  = require('../util/firebase');

module.exports = {
    description: 'Me want cookie',
    execute: async (args, msg) => {
        try {
            // throw error if args are missing
            if (args.length < 2) throw new Error(`Missing required arguments`);

            // check for --general flag
            let isGeneralSearch = false;
            args.forEach((arg, index) => {
                if (arg === '--general' || arg === '--g') {
                    isGeneralSearch = true;
                    args.splice(index, 1);
                }
            });

            let route, q;
            // enable general search or specific search
            if (!isGeneralSearch) {
                const [subreddit] = args.splice(0, 1);
                route = `/r/${subreddit}/search/`;
            } else route = `/search/`;
            
            q = args.join(' ');
            const res = await reddit.get(route, {
                limit: 10,
                show: 'all',
                sort: 'top',
                restrict_sr: true,
                q,
            });

            // extract necessary info from resulting array
            const { before, after } = res.data;
            let posts = res.data.children;
            if (posts.length === 0) throw new Error(`Ho sang did not find any results for '${args.join(' ')}'`);
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
            await Promise.all([
                message.react('⬆️'),
                message.react('⬇️'),
            ]);

            // save search and reply info from user
            await firebase.database().ref(`users/${msg.author.id}/search/${message.id}`).set({
                route,
                q,
                before,
                after,
                count: posts.length,
            });
            console.log(message.content);

        } catch (err) {
            console.error(`Error: ${err.message}`);
            const message = await msg.channel.send(err.message);
            console.log(message.content);
        }
    },
}