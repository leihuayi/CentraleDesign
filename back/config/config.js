var config = require('./config.json');

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

module.exports.email = {
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
        user: config.email.auth.user,
        pass: config.email.auth.pass
    }
};

module.exports.forceDb = process.env.FORCE_DB || config.forceDb;