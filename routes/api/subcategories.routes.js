var indexController = require('../../controllers/api/subcategory/index.controller');
var config = require('../../config/index');
const { check } = require('express-validator');

module.exports = function(router) {
    router.get(config.constant.APIURL+'/subcategories', indexController.subCategories);
    router.get(
		config.constant.APIURL+'/getsubcategoriesbycat', 
		[
		    check('cat_id', 'Category Id is required').not().isEmpty()
		], 
		indexController.subCategoriesByCatId
	); 
}