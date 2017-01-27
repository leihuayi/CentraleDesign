'use strict';

var express = require('express');
var controller = require('./order.controller');
var router = express.Router();
var multer  = require('multer');

var upload = multer({ dest: 'uploads/' });

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
router.get('/', controller.getAll);


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
router.post('/', upload.array('images'), controller.create);

/**
 * @api {get} /api/orders/:id
 * @apiDescription Get orders
 * ADD "format=json" TO HAVE A JSON RESPONSE
 * @apiName Getorders
 * @apiGroup User
 * @apiParam (URL) {Number} id User ID
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *
 {
 }
 *
 */
router.get('/:id', controller.getOne);

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
router.put('/:id', upload.single('image'), controller.update);

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
router.get('/assigned', controller.getAssignedOrders);


module.exports = router;