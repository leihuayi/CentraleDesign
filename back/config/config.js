var config;

try {
    config = require('./config.json');
    // do stuff
} catch (ex) {
    config = {
        "database": {
            "host": "localhost",
            "user": "csdesign",
            "password": "CSBest4Design!",
            "port": 3306,
            "dbName": "csdesign"
        },
        "server": {
            "port": 8888,
            "host": "localhost"
        },
        "forceDb": false
    };
}

module.exports.database = {
    host: process.env.DB_HOST || config.database.host,
    port: process.env.DB_PORT || config.database.port,
    user: process.env.DB_USER || config.database.user,
    password: process.env.DB_PASSWORD || config.database.password,
    dbName: process.env.DB_NAME || config.database.dbName
};

module.exports.server = {
    port: process.env.SERVER_PORT || config.server.port,
    host: process.env.SERVER_HOST || config.server.host
};

module.exports.forceDb = process.env.FORCE_DB || config.forceDb;