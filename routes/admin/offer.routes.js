var indexController = require('../../controllers/admin/offer/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_offer', isloggedin, indexController.manageOffer);
    router.all(config.constant.ADMINCALLURL+'/list_offer', isloggedin, indexController.listOffer); 
    router.all(config.constant.ADMINCALLURL+'/add_offer',isloggedin, indexController.addOffer);
    router.all(config.constant.ADMINCALLURL+'/edit_offer',isloggedin, indexController.editOffer);
    router.all(config.constant.ADMINCALLURL+'/change_status_offer/:id',isloggedin, indexController.changeStatusOffer);
    router.all(config.constant.ADMINCALLURL+'/delete_offer/:id',isloggedin, indexController.deleteOffer); 
}