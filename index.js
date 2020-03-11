(function () {
    const express = require("express");
    const helper = require("./helper");
    const app = express();

    app.use(express.static('public'));
    app.get('/api/getbigfive', async (req, res) => {
        const results = await helper.get_bigfive(req.query.username);
        return res.send(JSON.stringify(results));
    });

    app.listen(8888, () =>
        console.log(`App is served at http://localhost:8888`),
    );

})();
