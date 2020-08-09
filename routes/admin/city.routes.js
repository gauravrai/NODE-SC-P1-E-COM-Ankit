var indexController = require('../../controllers/admin/city/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_city', isloggedin, indexController.manageCity); 
    router.all(config.constant.ADMINCALLURL+'/list_city', isloggedin, indexController.listCity); 
    router.all(config.constant.ADMINCALLURL+'/add_city',isloggedin, indexController.addCity);   
    router.all(config.constant.ADMINCALLURL+'/edit_city',isloggedin, indexController.editCity);   
    router.all(config.constant.ADMINCALLURL+'/delete_city/:id',isloggedin, indexController.deleteCity);   
    router.all(config.constant.ADMINCALLURL+'/change_status_city/:id',isloggedin, indexController.changeStatusCity); 
}