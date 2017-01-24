'use strict';

var express = require('express');
var controller = require('./designer-order.controller');
var router = express.Router();

/**
 * @api {get} /api/orders/
 * @apiDescription Get all orders
 * @apiName Getorders
 * @apiGroup User
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *
 * [
 ]
 *
 */
//router.get('/', controller.getAll);

/**
 * @api {post} /api/orders/
 * @apiDescription Create an order
 * @apiName CreateOrder
 * @apiGroup User
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *
 * [
 ]
 *
 */
router.post('/', controller.create);

/**
 * @api {put} /api/orders/:id Edit User info
 * @apiDescription Edit name or image of a user
 * @apiName EditUser
 * @apiGroup User
 * @apiParam (URL) {Number} id User ID
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *
 */
router.put('/:id', controller.update);


module.exports = router;