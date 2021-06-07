const { Scheduler } =  require('../util/scheduler');
const { PREFIX }    = process.env;

module.exports = {
    description: 'Unsubscribes the channel from some daily sweet bot content',
    help: `\n${PREFIX}unsubscribe`,
    execute: (args, msg) => {
        Scheduler.unsubscribe(msg.channel.id);
        let message = 'Unsubscribed';
        msg.channel.send(message)
            .then(message => console.log(`Replied to [${msg.author.tag}] with '${message}'`))
            .catch(console.error);
    },
}