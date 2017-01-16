// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./config');
var connection = mysql.createConnection({
    'host': dbconfig.database.host,
    'user': dbconfig.database.user,
    'password': dbconfig.database.password
});

connection.query('USE ' + dbconfig.database.vrDbName);
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM user WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
                usernameField : 'email',
                passwordField : 'password',
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, email, password, done) {
                console.log(req.body);
                if(req.body.username == "" || req.body.confirm == ""){
                    return done(null, false, req.flash('signupMessage', req.__("error_fields_empty")));
                }

                if(req.body.password !== req.body.confirm) {
                    return done(null, false, req.flash('signupMessage', req.__("error_password_match")));
                }
                // we are checking to see if the user trying to login already exists
                connection.query("SELECT * FROM user WHERE email = ?",[email], function(err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', req.__("error_email")));
                    } else {
                        // if there is no user with that username
                        // create the user
                        var newUserMysql = {
                            username: req.body.username,
                            email: email,
                            password: bcrypt.hashSync(password, null, null),  // use the generateHash function in our user model,
                            createdAt: (new Date()).toISOString().substring(0, 19).replace('T', ' ')
                        };

                        var insertQuery = "INSERT INTO user ( username, email, password, createdAt ) values (?,?,?,?)";

                        connection.query(insertQuery,[newUserMysql.username, newUserMysql.email, newUserMysql.password, newUserMysql.createdAt],function(err, rows) {
                            newUserMysql.id = rows.insertId;

                            return done(null, newUserMysql);
                        });
                    }
                });
            })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
                // by default, local strategy uses email and password, we will override with email
                usernameField : 'email',
                passwordField : 'password',
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, email, password, done) { // callback with email and password from our form
                connection.query("SELECT * FROM user WHERE email = ?",[email], function(err, rows){
                    if (err)
                        return done(err);
                    if (!rows.length) {
                        return done(null, false, req.flash('loginMessage', req.__("error_no_user"))); // req.flash is the way to set flashdata using connect-flash
                    }

                    // if the user is found but the password is wrong
                    if (!bcrypt.compareSync(password, rows[0].password))
                        return done(null, false, req.flash('loginMessage', req.__("error_password"))); // create the loginMessage and save it to session as flashdata

                    // all is well, return successful user
                    return done(null, rows[0]);
                });
            })
    );
};