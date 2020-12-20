const { unfollow } =  require('../util/twitter');

module.exports = {
    show: false,
    execute: (args, msg) => {
        unfollow(msg.channel.id);
        let message = 'Trailing Noises stream unfollowed';
        msg.channel.send(message)
            .then(message => console.log(`Replied to [${msg.author.tag}] with '${message}'`))
            .catch(console.error);
    },
}