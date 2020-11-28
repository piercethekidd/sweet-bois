const _             = require('lodash');
const { PREFIX }    = process.env;

module.exports = {
    description: 'List commands and their description',
    help: `${PREFIX}help <command> to display information on how to use the command`,
    execute: async (args, msg, commands) => {
        try {
            let message ;
            // list all commands
            if (args.length === 0) {
                message = '```fix\nList of commands:\n-----------------';
                // List command descriptions from the description attribute
                _.forOwn(commands, (val, key) => {
                    message += `\n_${key} - ${val.description}`
                });
                message += `\n\n${PREFIX}help <command> to display information on how to use the command`;
                message += '```';
            }
            // describe a command in detail
            else {
                const command = args.splice(0,1);
                if (commands[command] === undefined) return;
                message = '```fix\n' + command + '\n\n'  + commands[command].help + '```';
            }
            
            const serverMsg = await msg.channel.send(message);
            console.log(`Replied to [${msg.author.tag}] with '${serverMsg}'`);
        } catch (err) {
            console.error(`Error: ${err.message}`);
        }
    },
}