'use strict';

var fs = require('fs');
var config = require('../config/config');
var constants = require('../constants');
var DesignerOrder = require('../config/db').DesignerOrder;

module.exports.create = function (req, res) {
    console.log('---------------- CREATE ORDER -------------------');
    if (req.user && req.user.role == constants.ROLE_DESIGNER) {
        DesignerOrder
            .create(req.body)
            .then(function(designerOrder){
                res.json(designerOrder);
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });
    } else {
        res.status(400).send(req.__('error_no_right'));
    }
};

module.exports.update = function (req, res) {
    console.log('---------------- UPDATE ORDER -------------------');
    if (req.user && req.user.role == constants.ROLE_DESIGNER) {
        DesignerOrder
            .update(req.body, {where: {id: req.params.id}})
            .then(function(designerOrder){
                res.json(designerOrder);
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });
    } else {
        res.status(400).send(req.__('error_no_right'));
    }
};