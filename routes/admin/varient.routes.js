var indexController = require('../../controllers/admin/varient/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_varient', isloggedin, indexController.manageVarient); 
    router.all(config.constant.ADMINCALLURL+'/list_varient', isloggedin, indexController.listVarient); 
    router.all(config.constant.ADMINCALLURL+'/add_varient',isloggedin, indexController.addVarient);   
    router.all(config.constant.ADMINCALLURL+'/edit_varient',isloggedin, indexController.editVarient);   
    router.all(config.constant.ADMINCALLURL+'/delete_varient/:id',isloggedin, indexController.deleteVarient);   
    router.all(config.constant.ADMINCALLURL+'/change_status_varient/:id',isloggedin, indexController.changeStatusVarient); 
}