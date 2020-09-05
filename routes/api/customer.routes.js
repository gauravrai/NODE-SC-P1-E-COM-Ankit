var indexController = require('../../controllers/api/customer/index.controller');
var config = require('../../config/index');

module.exports = function(router) {
     router.all(config.constant.APIURL+'/addcustomer', indexController.addCustomer); 
     router.post(config.constant.APIURL+'/checkcustomerotp', indexController.checkCustomerOtp);
     router.post(config.constant.APIURL+'/customer_profile', indexController.customerProfile);

    
}