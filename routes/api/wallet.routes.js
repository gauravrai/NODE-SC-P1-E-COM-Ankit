var indexController = require('../../controllers/api/wallet/index.controller');
var config = require('../../config/index');
const { check } = require('express-validator')

module.exports = function(router) {
  router.get(
    config.constant.APIURL+'/getWalletData', 
    [
      check('userId', 'User Id is required').not().isEmpty()
    ], 
    indexController.getWalletData
  );    
}