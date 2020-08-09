var indexController = require('../../controllers/admin/administrator/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_administrator', isloggedin, indexController.manageAdministrator); 
    router.all(config.constant.ADMINCALLURL+'/list_administrator', isloggedin, indexController.listAdministrator); 
    router.all(config.constant.ADMINCALLURL+'/add_administrator',isloggedin, indexController.addAdministrator);   
    router.all(config.constant.ADMINCALLURL+'/edit_administrator',isloggedin, indexController.editAdministrator);   
    router.all(config.constant.ADMINCALLURL+'/delete_administrator/:id',isloggedin, indexController.deleteAdministrator);   
    router.all(config.constant.ADMINCALLURL+'/change_status_administrator/:id',isloggedin, indexController.changeStatusAdministrator); 
}