var indexController = require('../../controllers/api/subcategory/index.controller');
var config = require('../../config/index');

module.exports = function(router) {
    router.get(config.constant.APIURL+'/subcategories', indexController.subCategories);
    router.get(config.constant.APIURL+'/getsubcategoriesbycat', indexController.subCategoriesByCatId);  
    
}