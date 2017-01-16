'use strict';

var express = require('express');
var controller = require('./order.controller');
var router = express.Router();
var multer  = require('multer');

var upload = multer({ dest: 'temp/' });

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
 * @api {put} /api/orders/:id Edit User info
 * @apiDescription Edit name or image of a user
 * @apiName EditUser
 * @apiGroup User
 * @apiParam (URL) {Number} id User ID
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *
 */
//router.post('/', upload.single('image'), controller.update);

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
   "id": 1,
   "username": "mewme",
   "email": "sarah.gross@mewme.com",
   "password": "$2a$10$IJJWsD7thflNW2kVfjClqOYacvHcaHiUlW2UMu3/VIGNi.Pt8QfaC",
   "resetPasswordToken": null,
   "resetPasswordExpires": null,
   "profilePicture": null,
   "createdAt": null,
   "updatedAt": "2016-12-14T06:41:39.000Z"
 }
 *
 */
//router.get('/:id', controller.profile);

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
///router.put('/:id', upload.single('image'), controller.update);
