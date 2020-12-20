module.exports = (twitterClient, discordClient) => {
    
    const { getTwitterSubscribers } = require('../util/firebase');

    // twitter functions and events
    const stream = twitterClient.stream('statuses/filter', {
        track: 'trailing noises',
    });
    
    stream.on('data', async (event) => {

        const username = event.user.screen_name;
        const tweet_id = event.id_str;
        const tweet = event.text;
        const url = `https://twitter.com/${username}/status/${tweet_id}`
        const sendPromises = [];

        try {
            // get subscribers then send message for each subscriber
            const subscribers = await getTwitterSubscribers();
            subscribers.forEach((val, index) => {
                const message = '```css\n@' + username + ': ' + tweet + '\n```\n' + url;
                sendPromises.push(discordClient.channels.cache.get(val.toString()).send(message));
            });
            const response = await Promise.all(sendPromises);
            response.forEach((val, index) => {
                console.log(`${val.content} was sent to channel id ${val.channel.id}`);
            });
        } catch (error) {
            console.log(error);
        }
    });
    
    stream.on('error', (error) => {
        throw error;
    });
}