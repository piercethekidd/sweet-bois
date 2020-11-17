const _ = require('lodash');

module.exports = {
    description: 'List commands and their description',
    execute: (args, msg, commands) => {
        let message = ('```css\nList of commands:');
        _.forOwn(commands, (val, key) => {
            message += `\n_${key} - ${val.description}`
        });
        message += '```';
        msg.channel.send(message)
        .then(message => console.log(`Replied to [${msg.author.tag}] with '${message}'`))
        .catch(console.error);
    },
}