var indexController = require('../../controllers/admin/tower/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_tower', isloggedin, indexController.manageTower); 
    router.all(config.constant.ADMINCALLURL+'/list_tower', isloggedin, indexController.listTower); 
    router.all(config.constant.ADMINCALLURL+'/add_tower',isloggedin, indexController.addTower);   
    router.all(config.constant.ADMINCALLURL+'/edit_tower',isloggedin, indexController.editTower);   
    router.all(config.constant.ADMINCALLURL+'/delete_tower/:id',isloggedin, indexController.deleteTower);   
    router.all(config.constant.ADMINCALLURL+'/change_status_tower/:id',isloggedin, indexController.changeStatusTower); 
}