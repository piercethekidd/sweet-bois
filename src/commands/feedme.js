const reddit = require('../util/reddit');

module.exports = {
    description: 'Feed your thirsty ass bitch',
    execute: async (args, msg) => {
        try {
            // throw error if args are missing
            if (args.length === 0) {
                const err_message = `Missing required arguments`;
                await msg.channel.send(err_message);
                throw err_message;
            }

            // search for results
            const search_args = args.join('+');
            const res = await reddit.get(`/r/${search_args}/hot`, {
                limit: Math.floor(Math.random() * 100),
                show: 'all',
            });

            // send to discord
            const { data } = res.data.children[res.data.children.length-1];
            const { url, title, id } = data;
            const reddit_url = `(https://redd.it/${id})`;
            const message = await msg.channel.send(`${title} ${reddit_url}\n${url}`);
            console.log(message.content);

        } catch (err) {
            console.error(`Error: ${err.message}`);
            const message = await msg.channel.send(`Ho sang did not find any results for '${args.join(' ')}'`);
            console.log(message.content);
        }
    },
}