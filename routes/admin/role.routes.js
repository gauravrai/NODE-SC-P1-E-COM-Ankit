var indexController = require('../../controllers/admin/role/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_role', isloggedin, indexController.manageRole); 
    router.all(config.constant.ADMINCALLURL+'/list_role', isloggedin, indexController.listRole); 
    router.all(config.constant.ADMINCALLURL+'/add_role', indexController.addRole);   
    router.all(config.constant.ADMINCALLURL+'/edit_role',isloggedin, indexController.editRole);   
    router.all(config.constant.ADMINCALLURL+'/delete_role/:id',isloggedin, indexController.deleteRole);   
    router.all(config.constant.ADMINCALLURL+'/change_status_role/:id',isloggedin, indexController.changeStatusRole);   
}