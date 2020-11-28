const { firebase, getSearchDetails }    = require('./firebase');
const reddit                            = require('./reddit');
const _                                 = require('lodash');

const searchReddit = async (reaction, user) => {
    try {
        // get search details
        const details =  await getSearchDetails(user.id, reaction.message.id);
        if (!details) return;

        // add attributes to details object
        details.limit = 10;
        details.show = 'all';
        details.restrict_sr = true;

        // add next or prev options to details object
        if (reaction.emoji.name === '⬆️') details.after = null;
        else details.before = null;

        // if there are no next or prev page, dont return anything
        if (!details.before && !details.after) return;

        // get next or prev in search results
        const res = await reddit.get(details.route, details);

        // extract necessary info from resulting array
        const { before, after } = res.data;
        let posts = res.data.children;
        if (posts.length === 0) return
        posts = _.map(posts, (post) => {
            const { title, id, url, subreddit} = post.data;
            return { id, title, url, subreddit };
        });

        // determine count number of fetched items so far
        let count = (reaction.emoji.name === '⬆️')? details.count-posts.length : details.count+posts.length;
        count = (count <= 0)? 0: count;

        // format result message
        let msgcontent = '```fix\nSearch Results:\n---------------\n';
        posts.forEach((post, index) => {
            let postIndex = (reaction.emoji.name === '⬆️')? count-9: details.count+1;
            msgcontent += `${postIndex+index}.) ${post.title} from r/${post.subreddit} (https://redd.it/${post.id})\n`;
        });
        msgcontent += '```';

        // edit search results
        const message = await reaction.message.edit(msgcontent);

        // reset reactions
        await Promise.all([
            reaction.message.reactions.removeAll(),
            message.react('⬆️'),
            message.react('⬇️'),
        ]);

        // save search and reply info from user
        await firebase.database().ref(`users/${user.id}/search/${reaction.message.id}`).set({
            route: details.route,
            q: details.q,
            sort: details.sort,
            before: before || null,
            after: after || null,
            count: count,
        });
        console.log(message.content);

    } catch (err) {
        console.log(err);
    }
} 

module.exports = {
    searchReddit,
}