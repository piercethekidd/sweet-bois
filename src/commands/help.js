const _ = require('lodash');

module.exports = {
    description: 'List commands and their description',
    execute: async (args, msg, commands) => {
        let message = ('```css\nList of commands:');
        // List command descriptions from the description attribute
        _.forOwn(commands, (val, key) => {
            message += `\n_${key} - ${val.description}`
        });
        message += '```';
        try {
            const serverMsg = await msg.channel.send(message);
            console.log(`Replied to [${msg.author.tag}] with '${serverMsg}'`);
        } catch (err) {
            console.error(`Error: ${err.message}`);
        }
    },
}