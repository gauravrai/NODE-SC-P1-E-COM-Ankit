var indexController = require('../../controllers/api/customer/index.controller');
var config = require('../../config/index');

module.exports = function(router) {
     router.all(config.constant.APIURL+'/addcustomer', indexController.addCustomer); 
     router.post(config.constant.APIURL+'/logincustomer', indexController.loginCustomer);
    // router.get(config.constant.APIURL+'/getproductBySubcat', indexController.productListBySubCatId);

    
}