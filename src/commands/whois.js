const reddit        = require('../util/reddit');
const _             = require('lodash');
const { PREFIX }    = process.env;

module.exports = {
    description: 'Get a random post from the given user',
    help: `\n${PREFIX}whois <username> [-s, -m, -l]\n`+
                '-s [-small] to randomize between 10 posts\n'+
                '-m [-medium] to randomize between 40 posts\n'+
                '-l [-large] to randomize between 100 posts\n'+
                '\nIf no flags are indicated, default is to randomize between 25 posts.\n',
            
    execute: async (args, msg) => {
        try {
            // throw error if args are missing
            if (args.length === 0) throw new Error(`Missing required arguments`);

            // initialize values for search options
            let sort = 'top', route, q;
            let limit, max = 25;
            let searchArgs = [];

            // flags for deciding limit size
            args.forEach(arg => {
                if (arg === '-small' || arg === '-s') 
                    max = 10;
                else if (arg === '-medium' || arg === '-m')
                    max = 40;
                else if (arg === '-large' || arg === '-l')
                    max = 100;
                else searchArgs.push(arg);
            });

            limit = Math.floor(Math.random() * max);
            q = searchArgs.splice(0,1);
            route = `/user/${q}/submitted`;

            console.log(limit);
            const res = await reddit.get(route, {
                limit,
                show: 'all',
                sort,
                restrict_sr: true,
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