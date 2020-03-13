const bigfive = require('./core/bigfive');
const {writeDb} = require("./database/database");
const {loadDb} = require("./database/database");
const opts = {   // These are the default options
    'encoding': 'binary',
    'locale': 'US',
    'logs': 3,
    'max': Number.POSITIVE_INFINITY,
    'min': Number.NEGATIVE_INFINITY,
    'nGrams': [2, 3],
    'output': 'lex',
    'places': 9,
    'sortBy': 'lex',
    'wcGrams': 'false',
};
module.exports = {
    saveResults: function (username, personality) {
        const db = loadDb();
        db[username] = personality;
        writeDb(db);
    },
    //example cached offline users: BebeRexha, katyperry, AnneMarie
    get_bigfive: async function (username) {
        const config = {
            screen_name: username,
            count: 200, //max is 200 for a single request
            include_rts: 1
        };
        const tweetCatcher = require('./core/tweet-catcher');
        const tweets = await tweetCatcher(config);

        const all_tweets_string = tweets.join(' ');
        const personality = bigfive(all_tweets_string, opts);
        this.saveResults(username, personality);
        console.log(`\n===== Analysis results for "${username}" (${tweets.length} tweets) =====`);
        console.log(`Big Five Personality Traits:\n`);
        console.log(`Openness: ${personality['O']}`);
        console.log(`Conscientiousness: ${personality['C']}`);
        console.log(`Extraversion: ${personality['E']}`);
        console.log(`Agreeableness: ${personality['A']}`);
        console.log(`Neuroticism: ${personality['N']}`);
        return personality;
    }
};
