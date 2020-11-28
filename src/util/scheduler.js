const reddit                        = require('./reddit');
const cron                          = require('node-cron');
const { firebase, getSubscribers }  = require('../util/firebase');

class Scheduler {
    #cron
    #postQueue
    #discordClient

    constructor (discordClient) {
        this.#cron = cron;
        this.#postQueue = [];
        this.#discordClient = discordClient;
    }

    // fetch posts from reddit
    #fetch = async () => {
        let hasFetched = false;
        while (!hasFetched) {
            try {
                const { SUBREDDIT } = process.env; 
                const res = await reddit.get(`/r/${SUBREDDIT}/hot`, {
                    limit: 48,
                    show: 'all',
                });
                this.#postQueue = res.data.children;
                hasFetched = !hasFetched;
                console.log('Fetch successful');
            } catch (error) {
                console.error(error);
            }
        }
    };

    // send a sweet message to all the sweet boy subscribers
    #post = async () => {
        const sendPromises = [];
        const post = this.#postQueue.splice(0, 1);
        // return if postQueue is empty
        if (post.length === 0) return;
        try {
            // get subscribers then send message for each subscriber
            const subscribers = await getSubscribers();
            subscribers.forEach((val, index) => {
                const { url, title, id } = post[0].data;
                const reddit_url = `(https://redd.it/${id})`;
                sendPromises.push(this.#discordClient.channels.cache.get(val.toString()).send(`${title} ${reddit_url}\n${url}`));
            });
            const response = await Promise.all(sendPromises);
            response.forEach((val, index) => {
                console.log(`${val.content} was sent to channel id ${val.channel.id}`);
            });
        } catch (error) {
            console.log(error);
        }
    };

    // add channel id to subscribers list
    static subscribe = async (channelId) => {
        try {
            await firebase.database().ref(`subscribers/${channelId}`).set({ channelId });
        } catch (error) {
            console.error(error);
        }
    }

    // remove channel id from subscribers list
    static unsubscribe = async (channelId) => {
        try {
            await firebase.database().ref(`subscribers/${channelId}`).remove();
        } catch (error) {
            console.error(error);
        }
    }

    // start scheduled fetching and posting
    initializeScheduler = () => {
        this.#cron.schedule('0 0 20 * * *', this.#fetch); // fetch data every 4 AM Philippine Time
        this.#cron.schedule('30 */30 * * * *', this.#post); // post every 30 minutes 
    }

} 

module.exports = { Scheduler };