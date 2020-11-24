const _         = require('lodash');
const firebase  = require('firebase');
const { 
    FIREBASE_API_KEY, 
    FIREBASE_AUTH_DOMAIN, 
    FIREBASE_DB_URL 
} = process.env;

// initialize firebase app
const app = firebase.initializeApp({
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    databaseURL: FIREBASE_DB_URL,
});

// get subscribers from database
const getSubscribers = async () => {
    try {
        const snapshot = await app.database().ref('/subscribers').once('value'); 
        const subscibers = _.keys(snapshot.val());
        return subscibers;
    } catch (error) {
        console.error(error);
        return [];
    }
}

module.exports = {
    firebase: app,
    getSubscribers
};