const { Scheduler } =  require('../util/scheduler');
const { PREFIX }    = process.env;

module.exports = {
    description: 'Subscribes the channel for some daily sweet bot content',
    help: `\n${PREFIX}subscribe`,
    execute: (args, msg) => {
        Scheduler.subscribe(msg.channel.id);
        let message = 'Subscribed';
        msg.channel.send(message)
            .then(message => console.log(`Replied to [${msg.author.tag}] with '${message}'`))
            .catch(console.error);
    },
}