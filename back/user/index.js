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
 * [
         {
           "id": 1,
           "username": "mewme",
           "email": "sarah.gross@mewme.com",
           "password": "$2a$10$IJJWsD7thflNW2kVfjClqOYacvHcaHiUlW2UMu3/VIGNi.Pt8QfaC",
           "resetPasswordToken": null,
           "resetPasswordExpires": null,
           "createdAt": null,
           "updatedAt": "2016-12-14T06:41:39.000Z"
         },
         {
           "id": 2,
           "username": "sassa",
           "email": "grsassa@gmail.com",
           "password": "$2a$10$jK8fCZpS1O8jSNwBDmVcxuCfNkGbhuIte/q0H3iynf/WoZ71VMIuu",
           "resetPasswordToken": "2a59fa5cbc66f88446de37935dfa50dd4928df5a",
           "resetPasswordExpires": "2016-12-06T11:07:54.000Z",
           "createdAt": null,
           "updatedAt": "2016-12-06T10:07:54.000Z"
         }
     ]
 *
 */
router.get('/', controller.getAll);

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