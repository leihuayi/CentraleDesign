'use strict';

var fs = require('fs');
var config = require('../config/config');
var constants = require('../config/constants');
var smtpTransport = require('./../config/stmp');
var DesignerOrder = require('../config/db').DesignerOrder;
var User = require('../config/db').User;

module.exports.create = function (req, res) {
    console.log('---------------- CREATE DESIGNER-ORDER -------------------');
    console.log(req.body);

    if (req.user && req.user.role == constants.ROLE_DESIGNER) {
        var sender = req.user;
        DesignerOrder
            .create(req.body)
            .then(function(designerOrder){
                //If we assigned the order to someone else
                if(req.body.designer_id !== req.user.id) {
                    User.findOne({
                        where: {
                            id : req.body.designer_id
                        }
                    })
                    .then(function(user){
                        var mailOptions = {
                            to: user.email,
                            from: req.__("asso_email"),
                            subject: req.__("assigned_orders"),
                            text: req.__("email_assigned_order", {host: req.headers.host, name: sender.username, email:sender.email, order_id:req.body.order_id})
                        };
                        smtpTransport.sendMail(mailOptions, function(err) {});
                    });
                }
                res.json(designerOrder);
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });
    } else {
        res.status(400).send(req.__('error_no_right'));
    }
};

module.exports.delete = function (req, res) {
    console.log('---------------- DELETE DESIGNER-ORDER -------------------');
    if (req.user && req.user.role == constants.ROLE_DESIGNER) {
        DesignerOrder
            .destroy({where: {id: req.params.id}})
            .then(function(){
                res.send('designer-order deleted');
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });
    } else {
        res.status(400).send(req.__('error_no_right'));
    }
};