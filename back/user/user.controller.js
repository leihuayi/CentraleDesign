'use strict';

var User = require('../config/db').User;
var async = require('async');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var propertyCtrl = require('../property/property.controller');
var config = require('./../config/config');
var fs = require('fs');
var sharp = require('sharp');
var passport = require('passport');

var smtpTransport = nodemailer.createTransport('SMTP', {
    host: 'smtp.mewlink.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'info@mewme.com',
        pass: 'forinfo01'
    }
});

module.exports.getAll = function(req,res) {
    User.findAll()
        .then(function(response){
            res.json(response);
        })
};

/**
 * Get all the info on a user : profile and properties created
 * Purpose: display on web
 * Info : creator username, profile picture, and infos on his created properties
 * Use : profile page (included my page)
 * @param req
 * @param res
 */
module.exports.profile = function(req,res) {
    var format = req.query.format;
    console.log('------- PROFILE '+ req.params.id +' --------');
    return User
            .findOne({
                where: {
                    id: req.params.id
                }
            })
            .then(function (user) {
                if(format && format == 'json'){
                    res.json(user);
                }
                else{
                    return user.get({plain: true});
                }

            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });
};

/**
 * Created the reset password token
 * @param req
 * @param res
 * @param next
 */
module.exports.createResetToken = function(req,res,next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User
                .findOne({
                    where: {
                        email: req.body.email
                    }
                })
                .then(function (user) {
                    if (!user) {
                        req.flash('forgetMessage', req.__("error_no_user"));
                        return res.redirect('/forget');
                    }
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save()
                    .then(function() {
                            console.log('saved!');
                            var mailOptions = {
                                to: user.email,
                                from: 'vr@mewme.com',
                                subject: req.__("reset")+' '+req.__("password"),
                                text: req.__("email_reset_token", {host: req.headers.host, token : token})
                            };
                            smtpTransport.sendMail(mailOptions, function(err) {
                                req.flash('forgetMessage', req.__("email_reset_token_confirm", user.email));
                                done(err, 'done');
                            });
                        });
                })
                .catch(function (err) {
                    res.status(500).send(err.toString());
                });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/forget');
    });
};

/**
 * Check if reset pwd token is valid and redirect to change pwd page
 * @param req
 * @param res
 */
module.exports.resetPage = function(req,res){
    User
        .findOne({
            where: {
                resetPasswordToken: req.params.token,
                resetPasswordExpires: { $gt: Date.now() }
            }
        })
        .then(function(user) {
            if (!user) {
                req.flash('forgetMessage', req.__("error_email"));
                return res.redirect('/forget');
            }
            res.render('reset', {
                user: req.user,
                lang: res
            });
        })
        .catch(function (err) {
            res.status(500).send(err.toString());
        });
};

/**
 * Validates password reseting after the new one has been entered
 * @param req
 * @param res
 */
module.exports.resetPassword = function(req,res){
    async.waterfall([
        function(done) {
            User
                .findOne({
                    where: {
                        resetPasswordToken: req.params.token,
                        resetPasswordExpires: { $gt: Date.now() }
                    }
                })
                .then(function(user) {
                    if (!user) {
                        req.flash('forgetMessage', req.__("error_email"));
                        return res.redirect('back');
                    }

                    if(req.body.password !== req.body.confirm) {
                        req.flash('renderMessage', req.__("error_password_match"));
                        res.render('reset', {
                            user: req.user,
                            lang: res,
                            message: req.flash('renderMessage')
                        });
                    }

                    //Hash the new password before storing it in database
                    user.password = bcrypt.hashSync(req.body.password, null, null);
                    user.resetPasswordToken = null;
                    user.resetPasswordExpires = null;

                    user.save()
                        .then(function() {
                            req.logIn(user, function(err) {
                                done(err, user);
                            });
                        });
                })
                .catch(function (err) {
                    res.status(500).send(err.toString());
                });
        },
        function(user, done) {
            req.flash('success', req.__("email_reset_success_confirm"));
            done();
        }
    ], function(err) {
        res.redirect('/');
    });
};

/**
 * Update the fields of a user
 * Purpose: api
 * @param req
 * @param res
 */
module.exports.update = function(req,res){
    var userId = req.params.id;
    if(req.user && req.user.id == req.params.id) {
        console.log('user id to edit : '+req.params.id);
        User
            .findOne({
                where: {
                    id: userId
                }
            })
            .then(function (user) {
                console.log(req.body);
                if (user) {
                    if(!bcrypt.compareSync(req.body.password, user.password)) {
                        res.status(404).send('Wrong password');
                    }
                    else {
                        if(req.body.newPassword !== '') {
                            req.body.password = bcrypt.hashSync(req.body.newPassword, null, function(err){
                                res.status(500).send(err.toString());
                            });

                            User
                                .update(req.body, {where: {id: userId}})
                                .then(function (response) {
                                    res.json(response)
                                })
                                .catch(function (err) {
                                    res.status(500).send(err.toString());
                                });
                        }
                        else {
                            delete req.body.password;
                            User
                                .update(req.body, {where: {id: userId}})
                                .then(function (response) {
                                    res.json(response)
                                })
                                .catch(function (err) {
                                    res.status(500).send(err.toString());
                                });
                        }
                    }

                } else {
                    res.status(404).send('User not found');
                }
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });

    }
    else {
        res.status(404).send('You have no right to edit this account');
    }
};

module.exports.delete = function(req,res){
    var userId = req.params.id;
    if(req.user.id && req.user.id == userId){
        req.session.destroy(function() {
            res.clearCookie('connect.sid');
            User
                .destroy({
                    where : {
                        id : userId
                    }
                })
                .then(function(){
                    //delete user picture
                    console.log("User deleted")
                })
        });
    }
    else{
        res.status(404).send('You have no right to delete this account');
    }

};