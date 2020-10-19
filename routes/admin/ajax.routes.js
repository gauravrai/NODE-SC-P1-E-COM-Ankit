var indexController = require('../../controllers/admin/ajax/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/get_city/:id',isloggedin, indexController.getCity);
    router.all(config.constant.ADMINCALLURL+'/get_pincode/:id',isloggedin, indexController.getPincode);
    router.all(config.constant.ADMINCALLURL+'/get_area/:id',isloggedin, indexController.getArea);
    router.all(config.constant.ADMINCALLURL+'/get_society/:id',isloggedin, indexController.getSociety);
    router.all(config.constant.ADMINCALLURL+'/get_subcategory',isloggedin, indexController.getSubcategory);
    router.all(config.constant.ADMINCALLURL+'/get_product',isloggedin, indexController.getProduct);
    router.all(config.constant.ADMINCALLURL+'/get_filtered_store',isloggedin, indexController.getFilteredStore);
    router.all(config.constant.ADMINCALLURL+'/get_subcat_by_cat',isloggedin, indexController.getSubcatByCat);
    router.all(config.constant.ADMINCALLURL+'/get_product_by_cat_subcat',isloggedin, indexController.getProductByCatsubcat);
    router.all(config.constant.ADMINCALLURL+'/get_varient',isloggedin, indexController.getVarient);
}