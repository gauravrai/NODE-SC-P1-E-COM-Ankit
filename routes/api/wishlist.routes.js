var indexController = require('../../controllers/api/wishlist/index.controller');
var config = require('../../config/index');
const { check } = require('express-validator')

module.exports = function(router) {
  router.post(
		config.constant.APIURL+'/addWishlist', 
		[
      check('productId', 'Product Id is required').not().isEmpty(),
      check('userId', 'User Id is required').not().isEmpty()
		], 
		indexController.addWishlist
	); 
  router.get(
    config.constant.APIURL+'/getWishlistOfUser', 
    [
      check('userId', 'User Id is required').not().isEmpty()
    ], 
    indexController.getWishlistOfUser
  );    
  router.post(
    config.constant.APIURL+'/removeWishlist', 
    [
      check('productId', 'Product Id is required').not().isEmpty(),
      check('userId', 'User Id is required').not().isEmpty()
    ], 
    indexController.removeWishlist
  );     
}