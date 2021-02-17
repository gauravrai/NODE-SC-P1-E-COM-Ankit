var indexController = require('../../controllers/api/notification/index.controller');
var config = require('../../config/index');
const auth = require('../../middleware/check-auth-jwt');
const { check } = require('express-validator')

module.exports = function(router) {
	router.get(
		config.constant.APIURL+'/getNotification',
		[
			// auth,
			// [
				check('userId', 'User Id is required').not().isEmpty()
			// ]
		],  indexController.getNotification
	); 
}