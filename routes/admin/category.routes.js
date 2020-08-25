var indexController = require('../../controllers/admin/category/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_category', isloggedin, indexController.manageCategory); 
    router.all(config.constant.ADMINCALLURL+'/list_category', isloggedin, indexController.listCategory); 
    router.all(config.constant.ADMINCALLURL+'/add_category',isloggedin, indexController.addCategory);   
    router.all(config.constant.ADMINCALLURL+'/edit_category',isloggedin, indexController.editCategory);   
    router.all(config.constant.ADMINCALLURL+'/delete_category/:id',isloggedin, indexController.deleteCategory);   
    router.all(config.constant.ADMINCALLURL+'/change_status_category/:id',isloggedin, indexController.changeStatusCategory); 
    //router.all(config.constant.ADMINCALLURL+'/check_slug_category',isloggedin, indexController.checkSlugCategory); 
}