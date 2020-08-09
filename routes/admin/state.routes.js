var indexController = require('../../controllers/admin/state/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_state', isloggedin, indexController.manageState); 
    router.all(config.constant.ADMINCALLURL+'/list_state', isloggedin, indexController.listState); 
    router.all(config.constant.ADMINCALLURL+'/add_state',isloggedin, indexController.addState);   
    router.all(config.constant.ADMINCALLURL+'/edit_state',isloggedin, indexController.editState);   
    router.all(config.constant.ADMINCALLURL+'/delete_state/:id',isloggedin, indexController.deleteState);   
    router.all(config.constant.ADMINCALLURL+'/change_status_state/:id',isloggedin, indexController.changeStatusState); 
}