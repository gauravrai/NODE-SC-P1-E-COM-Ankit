var indexController = require('../../controllers/api/city/index.controller');
var config = require('../../config/index');

module.exports = function(router) {
     router.all(config.constant.APIURL+'/city', indexController.citeList); 

    
}