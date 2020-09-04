var indexController = require('../../controllers/admin/discount/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_discount', isloggedin, indexController.manageDiscount);
    router.all(config.constant.ADMINCALLURL+'/list_discount', isloggedin, indexController.listDiscount); 
    router.all(config.constant.ADMINCALLURL+'/add_discount',isloggedin, indexController.addDiscount);
    router.all(config.constant.ADMINCALLURL+'/edit_discount',isloggedin, indexController.editDiscount);
    router.all(config.constant.ADMINCALLURL+'/change_status_discount/:id',isloggedin, indexController.changeStatusDiscount);
    router.all(config.constant.ADMINCALLURL+'/delete_discount/:id',isloggedin, indexController.deleteDiscount);
    router.all(config.constant.ADMINCALLURL+'/checkcoupon',isloggedin, indexController.checkCouponNo);  

}