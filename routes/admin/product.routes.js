var indexController = require('../../controllers/admin/product/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_product', isloggedin, indexController.manageProduct);
    router.all(config.constant.ADMINCALLURL+'/list_product', isloggedin, indexController.listProduct); 
    router.all(config.constant.ADMINCALLURL+'/add_product',isloggedin, indexController.addProduct);
    router.all(config.constant.ADMINCALLURL+'/edit_product',isloggedin, indexController.editProduct);
    router.all(config.constant.ADMINCALLURL+'/change_status_product/:id',isloggedin, indexController.changeStatusProduct);
    router.all(config.constant.ADMINCALLURL+'/delete_product/:id',isloggedin, indexController.deleteProduct); 
    router.all(config.constant.ADMINCALLURL+'/checkStockkeeping',isloggedin, indexController.checkStockkeeping); 
    
}