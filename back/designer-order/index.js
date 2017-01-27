'use strict';

var express = require('express');
var controller = require('./designer-order.controller');
var router = express.Router();

/**
 * @api {get} /api/designer-orders/
 * @apiDescription Get all designer-orders
 * @apiName GetDesignerOrders
 * @apiGroup DesignerOrder
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *
 * [
 ]
 *
 */
//router.get('/', controller.getAll);

/**
 * @api {post} /api/designer-orders/
 * @apiDescription Create an order
 * @apiName CreateDesignerOrder
 * @apiGroup DesignerOrder
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *
 * [
 ]
 *
 */
router.post('/', controller.create);

/**
 * @api {delete} /api/designer-orders/:id Edit User info
 * @apiDescription Edit name or image of a user
 * @apiName DeleteDesignerOrder
 * @apiGroup DesignerOrder
 * @apiParam (URL) {Number} id User ID
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *
 */
router.delete('/:id', controller.delete);


module.exports = router;