var indexController = require('../../controllers/api/customer/index.controller');
var config = require('../../config/index');
const checkAuth = require('../../middleware/check-auth-jwt');

module.exports = function(router) {
     router.all(config.constant.APIURL+'/addcustomer', indexController.addCustomer); 
     router.post(config.constant.APIURL+'/checkcustomerotp', indexController.checkCustomerOtp);
     router.get(config.constant.APIURL+'/customer_profile', checkAuth, indexController.customerProfile);
     router.post(config.constant.APIURL+'/update_customerprofile', checkAuth, indexController.updateCustomerProfile);

    
}