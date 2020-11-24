const { Scheduler } =  require('../util/scheduler');

module.exports = {
    description: 'Subscribes the current channel for some sweet boy content',
    execute: (args, msg) => {
        Scheduler.unsubscribe(msg.channel.id);
        let message = 'Unsubscribed';
        msg.channel.send(message)
            .then(message => console.log(`Replied to [${msg.author.tag}] with '${message}'`))
            .catch(console.error);
    },
}