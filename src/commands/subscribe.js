const { Scheduler } =  require('../util/scheduler');

module.exports = {
    description: 'Subscribes the channel for some sweet boy content',
    execute: (args, msg) => {
        Scheduler.subscribe(msg.channel.id);
        let message = 'Subscribed';
        msg.channel.send(message)
            .then(message => console.log(`Replied to [${msg.author.tag}] with '${message}'`))
            .catch(console.error);
    },
}