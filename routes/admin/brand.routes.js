var indexController = require('../../controllers/admin/brand/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_brand', isloggedin, indexController.manageBrand); 
    router.all(config.constant.ADMINCALLURL+'/list_brand', isloggedin, indexController.listBrand); 
    router.all(config.constant.ADMINCALLURL+'/add_brand',isloggedin, indexController.addBrand);   
    router.all(config.constant.ADMINCALLURL+'/edit_brand',isloggedin, indexController.editBrand);   
    router.all(config.constant.ADMINCALLURL+'/delete_brand/:id',isloggedin, indexController.deleteBrand);   
    router.all(config.constant.ADMINCALLURL+'/change_status_brand/:id',isloggedin, indexController.changeStatusBrand); 
}