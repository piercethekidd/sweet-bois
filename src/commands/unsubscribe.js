const { Scheduler } =  require('../util/scheduler');
const { PREFIX }    = process.env;

module.exports = {
    description: 'Unsubscribes the channel from some sweet boy content',
    help: `${PREFIX}unsubscribe to unsubscribe from daily sweet boy updates`,
    execute: (args, msg) => {
        Scheduler.unsubscribe(msg.channel.id);
        let message = 'Unsubscribed';
        msg.channel.send(message)
            .then(message => console.log(`Replied to [${msg.author.tag}] with '${message}'`))
            .catch(console.error);
    },
}