const reddit = require('../util/reddit');

module.exports = {
    description: 'Feed your thirsty ass bitch',
    execute: async (args, msg) => {
        try {
            const res = await reddit.get('/r/kpopfap/hot', {
                count: 0,
                limit: 1,
                show: 'all',
            });

            const length = res.data.children.length;
            const { url, title } = res.data.children[length-1].data;
            
            const message = await msg.channel.send(`${title}\n${url}`);
            console.log(message.content);

        } catch (err) {
            console.error(err);
        }

    },
}