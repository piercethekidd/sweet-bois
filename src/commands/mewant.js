const reddit        = require('../util/reddit');
const _             = require('lodash');
const { firebase }  = require('../util/firebase');
const { PREFIX }    = process.env;

module.exports = {
    show: true,
    description: 'Me want cookie',
    help: `${PREFIX}mewant <search_terms> [-g, -t, -n, -r, -h] to search in reddit\n`+
            '-g general search\n' +
            '-t sort by top\n' +
            '-n sort by new\n' +
            '-r sort by relevance\n' +
            '-h sort by hot\n',
    execute: async (args, msg) => {
        try {
            // throw error if args are missing
            if (args.length < 2) throw new Error(`Missing required arguments`);

            // check for search options, then push searchArg to new array
            let isGeneralSearch = false, sort = 'top', searchArgs = [];
            args.forEach(arg => {
                if (arg === '-general' || arg === '-g') 
                    isGeneralSearch = true;
                else if (arg === '-top' || arg === '-t')
                    sort = 'top';
                else if (arg === '-relevance' || arg === '-r')
                    sort = 'relevance';
                else if (arg === '-hot' || arg === '-h')
                    sort = 'hot';
                else if (arg === '-new' || arg === '-n')
                    sort = 'new';
                else searchArgs.push(arg);
            });

            let route, q;
            // enable general search or specific search
            if (!isGeneralSearch) {
                const [subreddit] = searchArgs.splice(0, 1);
                route = `/r/${subreddit}/search/`;
            } else route = `/search/`;
            
            q = searchArgs.join(' ');
            const res = await reddit.get(route, {
                limit: 10,
                show: 'all',
                sort,
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
                sort,
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