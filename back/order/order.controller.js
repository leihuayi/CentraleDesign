'use strict';

var fs = require('fs');
var sharp = require('sharp');
var config = require('../config/config');
var constants = require('../config/constants');
var smtpTransport = require('./../config/stmp');
var database = require('../config/db').database;
var Order = require('../config/db').Order;
var DesignerOrder = require('../config/db').DesignerOrder;
var User = require('../config/db').User;

module.exports.create = function (req, res) {
    console.log('---------------- CREATE ORDER -------------------');
    if (req.user) {
        req.body.user_id = req.user.id;
        Order
            .create(req.body)
            .then(function(order){
                if(req.files.length) {
                    updateOrderFiles(req,res,order.id);
                }
                else{
                    res.json(order);
                }
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
                if(req.files.length) {
                    req.files.forEach(function (file){
                        fs.unlink(file.path);
                    });
                }
            });
    } else {
        res.status(400).send(req.__('error_no_log'));
    }
};

/**
 * Get all the orders (admin designer function)
 * @param req
 * @param res
 * @returns Array of orders or JSON
 */
module.exports.getAll = function(req,res) {
    var select = "`order`.id, `order`.user_id, `order`.deadline, `order`.type, `order`.title, `order`.createdAt, u1.username as creator, GROUP_CONCAT(designer_order.id) as designer_order_ids, GROUP_CONCAT(u2.email) as designer_emails";
    var options = "INNER JOIN user as u1 ON order.user_id = u1.id " +
                    "LEFT JOIN designer_order " +
                        "INNER JOIN user as u2 ON designer_order.designer_id = u2.id " +
                    "ON order.id = designer_order.order_id";
    var grouping = " GROUP BY `order`.id"; //We can have many designers working on the same order.
    var ordering = " ORDER BY `order`.createdAt DESC";

    return database
        .query("SELECT "+select+" FROM `order` "+options+grouping+ordering, {model: Order, raw: true})
        .catch(function (err) {
            res.status(500).send(err.toString());
        })
        .then(function (result) {
            if (req.user) {
                if(req.user.role == constants.ROLE_DESIGNER) {
                    return (result);
                }
                else {
                    res.status(400).send(req.__('error_no_right'));
                }
            }
            else{
                res.json(result);
            }
        });
};

/**
 * Get all the orders I made
 * @param req
 * @param res
 * @returns Array of orders
 */
module.exports.getUserOrders = function(req,res) {
    if(req.user) {
        return Order
            .findAll({
                where: {
                    user_id: req.user.id
                },
                order: 'createdAt DESC'
            })
            .then(function(result){
                return result ;
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });
    }
    else{
        res.status(400).send(req.__('error_no_log'));
    }
};

/**
 * Get all the orders assigned to me (admin designer function)
 * @param req
 * @param res
 * @returns Array of orders or JSON
 */
module.exports.getAssignedOrders = function(req,res) {
    if(req.user) {
        var select = "`order`.id, `order`.user_id, `order`.deadline, `order`.type, `order`.title, `order`.createdAt, user.username as creator";
        var options = "INNER JOIN user ON order.user_id = user.id INNER JOIN designer_order ON order.id = designer_order.order_id WHERE designer_order.designer_id = "+req.user.id;
        var ordering = " ORDER BY `order`.createdAt DESC";

        return database
            .query("SELECT "+select+" FROM `order` "+options+ordering, {model: Order, raw: true})
            .catch(function (err) {
                res.status(500).send(err.toString());
            })
            .then(function(result){
                if (req.user) {
                    if(req.user.role == constants.ROLE_DESIGNER) {
                        return (result);
                    }
                    else {
                        res.status(400).send(req.__('error_no_right'));
                    }
                }
                else{
                    res.json(result);
                }
            })
    }
    else {
        res.status(400).send(req.__('error_no_logged'));
    }
};

module.exports.getOne = function(req,res) {
    var select = "`order`.*, u1.username as orderer_name, u1.email as orderer_email, GROUP_CONCAT(designer_order.id) as designer_order_ids, GROUP_CONCAT(u2.email) as designer_emails";
    var options =
        "INNER JOIN user as u1 ON `order`.user_id = u1.id " +
        "LEFT JOIN designer_order " +
            "INNER JOIN user as u2 ON designer_order.designer_id = u2.id " +
        "ON `order`.id = designer_order.order_id " +
        "WHERE `order`.id = " + req.params.id ;
    var grouping = " GROUP BY `order`.id"; //We can have many designers working on the same order.

    return database
        .query("SELECT "+select+" FROM `order` "+options+grouping, {model: Order, raw: true})
        .catch(function (err) {
            res.status(500).send(err.toString());
        })
        .then(function(result){
            if (req.user) {
                if(req.user.role == constants.ROLE_DESIGNER || req.user.id == result[0].user_id) {
                    return (result[0]);
                }
                else {
                    res.status(400).send(req.__('error_no_right'));
                }
            }
            else{
                res.json(result[0]);
            }
        })
};


/**
 * Update the fields of an order
 * @param req
 * @param res
 * @return JSON
 */
module.exports.update = function(req,res){
    var orderId = req.params.id;
    Order
        .findOne({
            where: {
                id: orderId
            }
        })
        .then(function (order) {
            if(req.user && (req.user.id == order.user_id || req.user.role == constants.ROLE_DESIGNER)) {
                var changer = req.user;
                Order
                    .update(req.body, {where: {id: orderId}})
                    .then(function () {
                        Order
                            .findOne({
                                where: {
                                    id: orderId
                                }
                            })
                            .then(function(order){
                                //Send email to warn about the update
                                var updateString = "";
                                for (var key in req.body){
                                    updateString += "\n"+key+" : "+req.body[key];
                                }
                                if(changer.id == order.user_id){
                                    database
                                        .query("SELECT designer_order.id, user.email FROM designer_order INNER JOIN user ON designer_order.designer_id = user.id WHERE designer_order.order_id = "+orderId, {model: DesignerOrder, raw: true})
                                        .catch(function (err) {
                                            res.status(500).send(err.toString());
                                        })
                                        .then(function(result){
                                            for(var i=0;i<result.length;i++){
                                                sendUpdateEmail(order,result[i].email,changer,updateString);
                                            }
                                            res.json(order)
                                        });
                                }
                                else{
                                    User.findOne({
                                        where: {
                                            id: order.user_id
                                        }
                                    })
                                    .then(function(user){
                                        sendUpdateEmail(order,user.email,changer,updateString);
                                        res.json(order);
                                    });
                                }
                            }).catch(function (err) {
                                res.status(500).send(err.toString());
                            });

                    })
                    .catch(function (err) {
                        res.status(500).send(err.toString());
                    });
            }
            else {
                res.status(404).send(req.__('error_no_right'));
            }
        })
        .catch(function (err) {
            res.status(500).send(err.toString());
        });

    function sendUpdateEmail(order,email,changer,updateString){
        var mailOptions = {
            to: email,
            from: req.__("asso_email"),
            subject: req.__("email_update_order_title", order.id),
            text: req.__("email_update_order", {host: req.headers.host, name: changer.username, email:changer.email, order_id:order.id, order_title:order.title, updates:updateString})
        };
        smtpTransport.sendMail(mailOptions, function(err) {});
    }
};

/**
 * Helper function which stores the image in local server with Sharp
 * @param req
 * @param res
 * @param orderId
 */
function updateOrderFiles(req, res, orderId) {

    // Now that we have stored the scene we can update the image url with the scene id.
    var targetFolder = __dirname+'/../../public/images/orders/' + orderId + '/';
    var targetUrl = '/public/images/orders/' + orderId + '/';

    fs.stat(targetFolder, function (errMkdir) {
        if (errMkdir) {
            // Create the property folder
            fs.mkdirSync(targetFolder);
        }
        var images = [];
        for(var i=0;i<req.files.length;i++){
            (function(index){
                sharp(req.files[index].path).resize(500, null).toFile(targetFolder+index+".png", function (err) {
                    if (err) {
                        res.status(500).send(err.toString());
                    } else {
                        fs.unlink(req.files[index].path);
                        images.push(targetUrl+index+".png");

                        if(index == req.files.length-1){
                            Order
                                .update({
                                    images: images
                                }, {
                                    where: {
                                        id: orderId
                                    }
                                })
                                .then(function (response) {
                                    res.json(response);
                                });
                        }
                    }
                });
            }(i))
        }

    });
}