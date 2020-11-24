const reddit    = require('./reddit');
const cron      = require('node-cron'); 

class Scheduler {
    #cron
    #postQueue
    #discordClient
    static #subscribers = [];

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
        let post = this.#postQueue.splice(0, 1);
        if (post.length === 0) return;
        Scheduler.#subscribers.forEach(async (val, index) => {
            try {
                const { url, title, id } = post[0].data;
                const reddit_url = `(https://redd.it/${id})`;
                const message = await this.#discordClient.channels.cache.get(val.toString()).send(`${title} ${reddit_url}\n${url}`);
                console.log(`${message.content} was sent to channel id ${val}`);
            } catch (error) {
                console.error(error);
            }
        });
    };

    // add channel id to subscribers list
    static subscribe = (channelId) => {
        // change code to support data persistence
        this.#subscribers.push(channelId);
        this.#subscribers = [...new Set(this.#subscribers)];
    }

    // remove channel id from subscribers list
    static unsubscribe = (channelId) => {
        // change code to support data persistence
        const index = this.#subscribers.indexOf(channelId);
        if (index > -1) {
            this.#subscribers.splice(index, 1);
        }
    }

    static getSubscribers = () => {
        return this.#subscribers;
    }

    // start scheduled fetching and posting
    initializeScheduler = () => {
        this.#cron.schedule('0 0 0 * * *', this.#fetch); // fetch data every 7:30 PM
        this.#cron.schedule('30 */30 * * * *', this.#post); // post every 30 minutes 
    }

} 

module.exports = { Scheduler };