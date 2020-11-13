var indexController = require('../../controllers/api/offer/index.controller');
var config = require('../../config/index');
const auth = require('../../middleware/check-auth-jwt');
const { check } = require('express-validator')

module.exports = function(router) {
	router.get(
		config.constant.APIURL+'/getOffer', 
		[
			check('requestFrom', 'Request From is required').not().isEmpty(),
		], 
		indexController.getOffer
	); 
	router.get(
		config.constant.APIURL+'/getOfferDetail', 
		[
			check('offerId', 'Offer Id is required').not().isEmpty(),
		], 
		indexController.getOfferDetail
	); 
}