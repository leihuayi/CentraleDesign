//MULTI-LANGUAGE SUPPORT

var i18n = require('i18n');


i18n.configure({
    //define how many languages we would support in our application
    locales:['en', 'fr'],

    //define the path to language json files, default is /locales
    directory: __dirname + '/../locales',

    //define the default language
    defaultLocale: 'en',

    // define a custom cookie name to parse locale settings from
    cookie: 'lang'
});


module.exports = function(req, res, next) {

    i18n.init(req, res);

    return next();
};