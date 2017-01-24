'use strict';

var express = require('express');
var controller = require('./user.controller');
var router = express.Router();
var multer = require('multer');

var upload = multer({ dest: 'temp/' });

/**
 * @api {get} /api/users/
 * @apiDescription Get all Users
 * @apiName GetUsers
 * @apiGroup User
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *
 [
 {
   "id": 4,
   "username": "Sassa",
   "email": "sarah.gross@student.ecp.fr",
   "password": "$2a$10$Wbky67JWmhY5bJE8R0KA..obZFjnYVAZnvXc/iOMwI62wjVn5S07q",
   "resetPasswordToken": null,
   "resetPasswordExpires": null,
   "role": 2,
   "createdAt": "2017-01-18T08:02:32.000Z",
   "updatedAt": "2017-01-23T16:28:49.000Z"
 },
 {
   "id": 5,
   "username": "Manu",
   "email": "akahime@via.ecp.fr",
   "password": "$2a$10$n1kphj7PdRr/GrjXZVXYt.Arw168reMTFeKgSNgR4iAx2nNtlYSg2",
   "resetPasswordToken": null,
   "resetPasswordExpires": null,
   "role": 0,
   "createdAt": "2017-01-23T10:24:51.000Z",
   "updatedAt": "2017-01-23T18:24:51.000Z"
 }
 ]
 *
 */
router.get('/', controller.getAll);

/**
 * @api {get} /api/users/designers
 * @apiDescription Get all designers
 * @apiName GetDesigners
 * @apiGroup User
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *
 * [
 ]
 *
 */
router.get('/designers', controller.getDesigners);

/**
 * @api {get} /api/users/:id
 * @apiDescription Get Users
 * ADD "format=json" TO HAVE A JSON RESPONSE
 * @apiName GetUsers
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
   "createdAt": null,
   "updatedAt": "2016-12-14T06:41:39.000Z"
 }
 *
 */
router.get('/:id', controller.profile);

/**
 * @api {put} /api/users/:id Edit User info
 * @apiDescription Edit name or image of a user
 * @apiName EditUser
 * @apiGroup User
 * @apiParam (URL) {Number} id User ID
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *
 */
router.put('/:id', controller.update);

/**
 * @api {delete} /api/users/:id Delete User
 * @apiDescription Delete a user and all of the objects related to him (subscriptions, views, ..)
 * @apiName DeleteUser
 * @apiGroup User
 * @apiParam (URL) {Number} id User ID
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *
 */
router.delete('/:id', controller.delete);

/**
 * @api {get} /api/user/reset/:token Go to page to reset token
 * @apiGroup Users
 * @apiParam (URL) {Number} token Code generated when one wants to reset their password
 */
router.get('/reset/:token', controller.resetPage);

/**
 * @api {post} /api/user/reset/:token Reset the password
 * @apiGroup Users
 * @apiParam (URL) {Number} token Code generated when one wants to reset their password
 * @apiParam (JSON) {String} new password
 */
router.post('/reset/:token', controller.resetPassword);

module.exports = router;