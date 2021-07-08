'use strict'

require('dotenv').config();

const { DISCORD_TOKEN } = process.env;
const { parse_message, execute_command } = require('./util/helper');
const { searchReddit } = require('./util/search');
const { Scheduler } = require('./util/scheduler');
const { Client } = require('discord.js');
const express = require('express');

const app = new express();
const client = new Client();
const scheduler = new Scheduler(client);

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
});

// listen to messages
client.on('message', (message) => {
    if (message.author.bot) return;
    const [command, ...args] = parse_message(message);

    if (command) {
        console.log(`[${message.author.tag}]: ${message.content}`);
        console.log(`[${message.author.tag}] requested for the ${command} command.`);
        execute_command(command, args, message);
    }
});

// listen to reactions
client.on('messageReactionAdd', (reaction, user) => {
    if (reaction.message.author.tag === 'SweetBot#3263' &&
        (reaction.emoji.name === '⬆️' || reaction.emoji.name === '⬇️') && user.tag !== 'SweetBot#3263') {
        searchReddit(reaction, user);
    }
});

// initialize scheduled posts
scheduler.initializeScheduler();
client.login(DISCORD_TOKEN);

const version = '1.0.1';
// use this route to ping the application
app.get('/', (req, res) => {
    console.log(`${req.ip} requested for a PING`);
    res.json({ version });
});

let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App listening to port ${port}`)
});