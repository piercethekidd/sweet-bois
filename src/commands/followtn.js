const { follow } =  require('../util/twitter');

module.exports = {
    show: false,
    execute: (args, msg) => {
        follow(msg.channel.id);
        let message = 'Trailing Noises stream followed';
        msg.channel.send(message)
            .then(message => console.log(`Replied to [${msg.author.tag}] with '${message}'`))
            .catch(console.error);
    },
}