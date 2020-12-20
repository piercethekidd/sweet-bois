module.exports = (client) => {
    
    const { DISCORD_TOKEN }                     = process.env;
    const { parse_message, execute_command }    = require('../util/helper');
    const { searchReddit }                      = require('../util/search');

    // discord functions and events
    client.on('ready', () => {
        console.log(`${client.user.tag} has logged in.`);
    });

    client.on('message', (message) => {
        if (message.author.bot) return;
        const [command, ...args] = parse_message(message);
        
        if (command) {
            console.log(`[${message.author.tag}]: ${message.content}`);
            console.log(`[${message.author.tag}] requested for the ${command} command.`);
            execute_command(command, args, message);
        }
    });

    client.on('messageReactionAdd', (reaction, user) => {
        if(reaction.message.author.tag === 'SweetBot#3263' &&
            (reaction.emoji.name === '⬆️' || reaction.emoji.name === '⬇️') && user.tag !== 'SweetBot#3263') {
            searchReddit(reaction, user);
        }
    });

    client.login(DISCORD_TOKEN);
}