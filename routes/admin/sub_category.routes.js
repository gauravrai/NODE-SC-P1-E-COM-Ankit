var indexController = require('../../controllers/admin/subcategory/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_subcategory', isloggedin, indexController.manageSubCategory);
    router.all(config.constant.ADMINCALLURL+'/list_subcategory', isloggedin, indexController.listSubCategory); 
    router.all(config.constant.ADMINCALLURL+'/add_subcategory',isloggedin, indexController.addSubCategory);
    router.all(config.constant.ADMINCALLURL+'/edit_subcategory',isloggedin, indexController.editSubCategory);
    router.all(config.constant.ADMINCALLURL+'/change_status_subcategory/:id',isloggedin, indexController.changeStatusSubCategory);
    router.all(config.constant.ADMINCALLURL+'/delete_subcategory/:id',isloggedin, indexController.deleteSubCategory); 
    
}