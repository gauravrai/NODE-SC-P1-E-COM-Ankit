var indexController = require('../../controllers/api/pincode/index.controller');
var config = require('../../config/index');

module.exports = function(router) {
     router.all(config.constant.APIURL+'/pincode', indexController.pincodeList); 

    
}