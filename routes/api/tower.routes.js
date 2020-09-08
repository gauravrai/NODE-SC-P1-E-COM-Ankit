var indexController = require('../../controllers/api/tower/index.controller');
var config = require('../../config/index');

module.exports = function(router) {
     router.all(config.constant.APIURL+'/tower', indexController.towerListBySocietyId); 

    
}