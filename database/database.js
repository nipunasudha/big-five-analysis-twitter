const fs = require('fs');
const path = require('path');
const dir_path = 'database';
const file_name = `db.json`;
const full_path = `${dir_path}/${file_name}`;

function ensureDirectoryExistence(filePath) {
    let dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

module.exports = {


    loadDb: function () {
        if (fs.existsSync(full_path)) {
            console.log(`${file_name} database exists, loading data`);
            return JSON.parse(fs.readFileSync(full_path, 'utf8'));
        }
        ensureDirectoryExistence(dir_path);
        fs.writeFileSync(full_path, JSON.stringify({}),
            {flag: 'w'});
        return {}
    },
    writeDb: function (data) {
        ensureDirectoryExistence(dir_path);
        fs.writeFileSync(full_path, JSON.stringify(data),
            {flag: 'w'});
        return {}
    },
};