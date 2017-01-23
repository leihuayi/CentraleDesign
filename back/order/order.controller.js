'use strict';

var fs = require('fs');
var sharp = require('sharp');
var config = require('../config/config');
var Order = require('../config/db').Order;

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

module.exports.getAll = function(req,res) {
    if(req.user) {
        return Order
            .findAll({order: 'createdAt DESC'})
            .then(function(response){
                return response;
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });
    }
    else {
        Order
            .findAll({order: 'createdAt DESC'})
            .then(function(response){
                res.json(response);
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });
    }
};

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


module.exports.getOne = function(req,res) {
    if(req.user) {
        return Order
            .findOne({
                where: {
                    id: req.params.id
                }
            })
            .then(function(result){
                return result ;
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });
    }
    else{
        Order
            .findOne({
                where: {
                    id: req.params.id
                }
            })
            .then(function(result){
                res.json(result) ;
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });
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