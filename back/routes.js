'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var config = require('./config/config');
var fs = require('fs');

var subscribers = [];

module.exports = function(app,passport) {
    // HTTP Request settings
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Templating settings
    app.set('view engine', 'jade');
    app.set('views', './public/views');

    // Static routes (__dirname is the 'project_path/back/' path)
    app.use('/img/property', express.static(__dirname + '/../' + config.multimedia.dest + '/property'));
    app.use('/img/user', express.static(__dirname + '/../' + config.multimedia.dest + '/user'));
    app.use('/assets', express.static(__dirname + '/../bower_components'));
    app.use('/api/docs', express.static(__dirname + '/../doc'));
    app.use('/styles', express.static(__dirname + '/../public/styles'));
    app.use('/js', express.static(__dirname + '/../public/js'));


    // LOGIN ===============================
    // show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.jade', {
            message: req.flash('loginMessage'),
            lang: res
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }),
        function(req, res) {
            subscriptionController.subscribersList(req.user.id)
                .then(function(sublist){
                    subscribers = sublist;
                    if (req.body.remember) {
                        req.session.cookie.maxAge = 1000 * 60 * 3;
                    } else {
                        req.session.cookie.expires = false;
                    }
                    var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
                    delete req.session.redirectTo;
                    // is authenticated ?
                    res.redirect(redirectTo);
                });
        });

    // SIGNUP ==============================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.jade', {
            message: req.flash('signupMessage'),
            lang: res
        });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // LOGOUT ==============================

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    // FORGET PASSWORD ==============================
    app.get('/forget', function(req, res) {
        res.render('forget', {
            message: req.flash('forgetMessage'),
            lang: res
        });
    });

    app.post('/forget', function(req, res,next) {
        userController.createResetToken(req,res,next);
    });

    // HOME PAGE (with login links) ========
    app.get('/', function(req, res) {
        req.query.page = 1;
        req.query.order = 'createdAt';
        propertyController
            .all(req, res)
            .then(function (propertiesAll) {
                req.query.order = 'numClick';
                propertyController
                    .all(req, res)
                    .then(function (propertiesPopular){
                        if(req.user){
                            propertyController
                                .history(req, res)
                                .then(function (propertiesHistory){
                                    res.render('index.jade', {
                                        propertiesAll: propertiesAll.propertiesVR,
                                        propertiesPopular: propertiesPopular.propertiesVR,
                                        propertiesHistory: propertiesHistory.propertiesVR,
                                        user : req.user,
                                        subscribers : subscribers,
                                        lang: res
                                    });
                                });
                        }

                        else{
                            res.render('index.jade', {
                                propertiesAll: propertiesAll.propertiesVR,
                                propertiesPopular: propertiesPopular.propertiesVR,
                                user : req.user,
                                subscribers : subscribers,
                                lang: res
                            });
                        }

                    })
            });
    });


    // MY PROPERTIES PAGE   ===============
    app.get('/order', isLoggedIn, function(req, res) {
        req.query.page = req.query.page > 1 ? req.query.page : 1;
        propertyController
            .userProperties(req,res,0)
            .then(function (properties) {
                //If we are asking for a page bigger than the last page
                if(properties.total>propertyController.maxOnPage && req.query.page > Math.ceil(properties.total/ propertyController.maxOnPage)) {
                    res.redirect("/my?page="+Math.ceil(properties.total/ propertyController.maxOnPage));
                }

                subscriptionController.subscriptions(req,res)
                    .then(function(subscriptions){
                        console.log(subscriptions);
                        res.render('profile.jade', {
                            properties: properties.propertiesVR,
                            profile_user : req.user,
                            subscriptions: subscriptions,
                            user : req.user,
                            pagination: {total: properties.total, maxOnPage: propertyController.maxOnPage, currentPage: parseInt(req.query.page)},
                            subscribers : subscribers,
                            lang: res
                        });
                    })
            });
    });

    //Render jade page
    app.post('/render',function(req,res) {
        if(req.body.page && req.body.property) {
            res.render(req.body.page+'.jade', {property : req.body.property, lang: res},function(err, layout){
                if (err) res.status(500).send(err);
                res.send(layout);
            });
        }
    });

    // ERROR ==============================
    app.get('/error', function(req, res) {
        res.render('error.jade', {user : req.user, subscribers : subscribers, lang:res});
    });


    // CHANGE TO ENGLISH   =================
    app.get('/en', function (req, res) {
        res.cookie('lang', 'en');
        var backURL=req.header('Referer') || '/';
        res.redirect(backURL)
    });


    // CHANGE TO SIMPLIFIFED CHINESE   =====
    app.get('/fr', function (req, res) {
        res.cookie('lang', 'fr');
        var backURL=req.header('Referer') || '/';
        res.redirect(backURL)
    });

    // TRANSLATIONS   ======================
    app.get('/translation',function(req,res) {
        var lang = getLangCookie(req);
        readJSONFile(__dirname + "/locales/"+ lang +".json", function (err, json) {
            if(err) {
                throw err;
            } else {
                res.json(json);
            }
        });
    });

    // API routes
    app.use('/api/users', require('./user'));

    //The 404 Route (ALWAYS Keep this as the last route)
    app.get('*', function(req, res){
        res.redirect('/error');
    });
};

function readJSONFile(filename, callback) {
    fs.readFile(filename, function (err, data) {
        if(err) {
            callback(err);
            return;
        }
        try {
            callback(null, JSON.parse(data));
        } catch(exception) {
            callback(exception);
        }
    });
}

function getLangCookie(request) {
    var lang = 'en',
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        if(parts[0] == 'lang' || parts[0] == ' lang'){
            lang = parts[1];
        }
    });

    return lang;
}

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    req.session.redirectTo = req.url;
    res.redirect('/login');
}