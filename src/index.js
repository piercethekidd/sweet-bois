'use strict'

require('dotenv').config();

const { twitterClient }                     = require('./util/twitter');
const { Scheduler }                         = require('./util/scheduler');
const { Client }                            = require('discord.js');
const discordStream                         = require('./streams/discord');
const twitterStream                         = require('./streams/twitter');
const express                               = require('express');

const app = new express();
const discordClient = new Client();
const scheduler = new Scheduler(discordClient);

// initialize functions and streams from discord and twitter
discordStream(discordClient);
twitterStream(twitterClient, discordClient);
scheduler.initializeScheduler();
 
const version = '1.0.0';
// use this route to ping the application
app.get('/', (req, res) => {
    console.log(`${req.ip} requested for a PING`);
    res.json({ version });
});

let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App listening to port ${port}`)
});