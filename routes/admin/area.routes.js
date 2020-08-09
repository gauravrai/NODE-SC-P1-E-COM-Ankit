var indexController = require('../../controllers/admin/area/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_area', isloggedin, indexController.manageArea); 
    router.all(config.constant.ADMINCALLURL+'/list_area', isloggedin, indexController.listArea); 
    router.all(config.constant.ADMINCALLURL+'/add_area',isloggedin, indexController.addArea);   
    router.all(config.constant.ADMINCALLURL+'/edit_area',isloggedin, indexController.editArea);   
    router.all(config.constant.ADMINCALLURL+'/delete_area/:id',isloggedin, indexController.deleteArea);   
    router.all(config.constant.ADMINCALLURL+'/change_status_area/:id',isloggedin, indexController.changeStatusArea); 
}