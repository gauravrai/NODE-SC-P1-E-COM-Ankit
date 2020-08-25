var indexController = require('../../controllers/admin/store/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_store', isloggedin, indexController.manageStore);
    router.all(config.constant.ADMINCALLURL+'/list_store', isloggedin, indexController.listStore); 
    router.all(config.constant.ADMINCALLURL+'/add_store',isloggedin, indexController.addStore);
    router.all(config.constant.ADMINCALLURL+'/edit_store',isloggedin, indexController.editStore);
    router.all(config.constant.ADMINCALLURL+'/change_status_store/:id',isloggedin, indexController.changeStatusStore); 
    router.all(config.constant.ADMINCALLURL+'/delete_store/:id',isloggedin, indexController.deleteStore);  
    
}