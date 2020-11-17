const importer = require('anytv-node-importer');
const commands = importer.dirloadSync(__dirname + '/../commands');

const parse_message = (message) => {
    const { PREFIX } = process.env;
    if (message.content.startsWith(PREFIX)) {
        return message.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);
    }
    return [];
};

const execute_command = (command, args, message) => {
    if (commands[command]) commands[command].execute(args, message, commands);
    else console.log(`Request for the ${command} command rejected. Command does not exist.`);
};

module.exports = { parse_message, execute_command };