var indexController = require('../../controllers/api/wishlist/index.controller');
var config = require('../../config/index');

module.exports = function(router) {
      router.all(config.constant.APIURL+'/addwishlist', indexController.addwishlist); 
    //  router.post(config.constant.APIURL+'/checkcustomerotp',  indexController.checkCustomerOtp);
    //  router.get(config.constant.APIURL+'/customer_profile',  indexController.customerProfile);
    //  router.post(config.constant.APIURL+'/update_customerprofile',  indexController.updateCustomerProfile);

    
}