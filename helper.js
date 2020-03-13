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
        const personalityPercentage = this.toPercentage(username, personality);
        return personalityPercentage;
    },
    toPercentage(username, personality) {
        const db = loadDb();
        let dbLength = Object.keys(db).length;
        console.log(dbLength);
        console.log('============= dont care ================');
        if (dbLength === 0) {
            return {
                'O': 1,
                'C': 1,
                'E': 1,
                'A': 1,
                'N': 1,
            }
        }
        let O = 0, C = 0, E = 0, A = 0, N = 0;
        for (let key in db) {
            if (key === username) continue;
            // check if the property/key is defined in the object itself, not in parent
            if (!db.hasOwnProperty(key)) continue;
            const five = db[key];
            if (personality.O > five.O) O += 1;
            if (personality.C > five.C) C += 1;
            if (personality.E > five.E) E += 1;
            if (personality.A > five.A) A += 1;
            if (personality.N > five.N) N += 1;
        }
        return {
            'O': O / dbLength,
            'C': C / dbLength,
            'E': E / dbLength,
            'A': A / dbLength,
            'N': N / dbLength,
        };
    }
};
