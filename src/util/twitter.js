const Twitter                       = require('twitter');
const { firebase, getSubscribers }  = require('../util/firebase');

const {
    TW_CONSUMER_KEY,
    TW_CONSUMER_SECRET,
    TW_ACCESS_TOKEN_KEY,
    TW_ACCESS_TOKEN_SECRET,
} = process.env;

const client = new Twitter({
    consumer_key: TW_CONSUMER_KEY,
    consumer_secret: TW_CONSUMER_SECRET,
    access_token_key: TW_ACCESS_TOKEN_KEY,
    access_token_secret: TW_ACCESS_TOKEN_SECRET,
});

// add channel id to twitter subscribers list
const follow = async (channelId) => {
    try {
        await firebase.database().ref(`twitter/subscribers/${channelId}`).set({ channelId });
    } catch (error) {
        console.error(error);
    }
}

// remove channel id from twitter subscribers list
const unfollow = async (channelId) => {
    try {
        await firebase.database().ref(`twitter/subscribers/${channelId}`).remove();
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    twitterClient: client,
    follow,
    unfollow,
};