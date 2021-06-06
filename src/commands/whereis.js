const reddit        = require('../util/reddit');
const _             = require('lodash');
const { firebase }  = require('../util/firebase');
const { PREFIX }    = process.env;

module.exports = {
    description: 'Get a random post from the given search terms',
    help: `${PREFIX}whereis <search_terms>`,
            
    execute: async (args, msg) => {
        try {
            // initialize values for search options
            let sort = 'top', route = `/search/`, q = args.join(' ');

            const res = await reddit.get(route, {
                limit: Math.floor(Math.random() * 100),
                show: 'all',
                sort,
                restrict_sr: true,
                q,
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