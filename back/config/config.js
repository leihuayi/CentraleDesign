var config = require('./config.json');

module.exports.database = {
    host: process.env.DB_HOST || config.database.host || 'localhost',
    port: process.env.DB_PORT || config.database.port || 3306,
    user: process.env.DB_USER || config.database.user || 'csdesign',
    password: process.env.DB_PASSWORD || config.database.password || 'CSBest4Design!',
    dbName: process.env.MEWME_DB_NAME || config.database.mewmeDbName || 'csdesign'
};

module.exports.server = {
    port: process.env.SERVER_PORT || config.server.port || 80,
    host: process.env.SERVER_HOST || config.server.host || 'localhost'
};

module.exports.forceDb = process.env.FORCE_DB || config.forceDb || false;