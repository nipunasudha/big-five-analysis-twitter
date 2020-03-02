(function () {
    const Twitter = require('twitter-js-client').Twitter;
    const fs = require('fs');
    const demoji = require('demoji');
    const emojies = require('../lexicons/emojies.json');


//Get this data from your twitter apps dashboard
    const config = {
        "consumerKey": "lXuiHUsGVWIRvOQLPa63HzFJu",
        "consumerSecret": "2v2fDLnakSakCVnJBo2HRv0UkUrjUGQD1BEkvpFS9YI6TQwLRD",
        "accessToken": "1138449074313748481-9lPlLNRL3ztXURrV9kFcs4bUcKPZsQ",
        "accessTokenSecret": "kWu0ZKobbuUBTM5vfspUrVNlMysZBxh6RBRkaqX0Oepge",
        "callBackUrl": ""
    };

    const twit = new Twitter(config);

    function onError(error) {
        return console.log("ERROR: " + error);
    }

    function preprocess_tweet(raw_tweet) {
        for (let emoji in emojies) {
            const re = new RegExp(emoji, "g");
            raw_tweet = raw_tweet.replace(re, emojies[emoji])
        }
        return raw_tweet
    }

    const tweetCatcher = (config, callback) => {
        const dir_path = './tweets';
        const file_name = `${config['screen_name']}_tweets.json`;
        const full_path = `${dir_path}/${file_name}`;
        // check if tweets are already cached
        if (fs.existsSync(full_path)) {
            console.log(`${file_name} is already cached. Using the existing version.`);
            const tweets = JSON.parse(fs.readFileSync(full_path, 'utf8'));
            callback(tweets);
            return;
        }

        twit.getUserTimeline(config, onError, (data) => {
                const tweets = [];
                const tweets_full = JSON.parse(data);
                tweets_full.forEach((tweet) => {
                    let raw_tweet = tweet['text'];
                    tweets.push(preprocess_tweet(raw_tweet));
                });

                if (!fs.existsSync(dir_path)) {
                    fs.mkdirSync(dir_path);
                }
                fs.writeFile(full_path, JSON.stringify(tweets),
                    'utf8',
                    () => console.log('\nTweets cached for future use.'));
                callback(tweets);
            }
        );

    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = tweetCatcher;
        }
        exports.tweetCatcher = tweetCatcher;
    } else {
        global.tweetCatcher = tweetCatcher;
    }
})();
