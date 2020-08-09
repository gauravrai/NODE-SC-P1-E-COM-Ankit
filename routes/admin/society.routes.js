var indexController = require('../../controllers/admin/society/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_society', isloggedin, indexController.manageSociety); 
    router.all(config.constant.ADMINCALLURL+'/list_society', isloggedin, indexController.listSociety); 
    router.all(config.constant.ADMINCALLURL+'/add_society',isloggedin, indexController.addSociety);   
    router.all(config.constant.ADMINCALLURL+'/edit_society',isloggedin, indexController.editSociety);   
    router.all(config.constant.ADMINCALLURL+'/delete_society/:id',isloggedin, indexController.deleteSociety);   
    router.all(config.constant.ADMINCALLURL+'/change_status_society/:id',isloggedin, indexController.changeStatusSociety); 
}