'use strict'

require('dotenv').config();

const { DISCORD_TOKEN }                     = process.env;
const { parse_message, execute_command }    = require('./util/helper');
const { Client }                            = require('discord.js');
const cron                                  = require('node-cron');
const express                               = require('express');
const { fetch, post }                       = require('./util/sch-fxn');

const app = new express();
const client = new Client();

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

cron.schedule('0 0 0 * * *', fetch);
cron.schedule('* */30 * * * *', post);

client.login(DISCORD_TOKEN);

app.listen(3000);