var express = require('express');

module.exports = function(app) {

	//routes
	var categoryRoutes = require('./api/categories.routes');
	var subcategoryRoutes = require('./api/subcategories.routes');
	var productRoutes = require('./api/product.routes');
	var customerRoutes = require('./api/customer.routes');
	var stateRoutes = require('./api/state.routes');
	var cityRoutes = require('./api/city.routes');
	var pincodeRoutes = require('./api/pincode.routes');
	var areaRoutes = require('./api/area.routes');
	var societiesRoutes = require('./api/societies.routes');
	var towerRoutes = require('./api/tower.routes');
	var brandRoutes = require('./api/brand.routes');
	var wishlistRoutes = require('./api/wishlist.routes');
	var cartRoutes = require('./api/cart.routes');
	var couponRoutes = require('./api/coupon.routes');
	var orderRoutes = require('./api/order.routes');
	var walletRoutes = require('./api/wallet.routes');
	var offerRoutes = require('./api/offer.routes');
	
	var router = express.Router();
	app.use('',router);

	//import api routes
	categoryRoutes(router);
	subcategoryRoutes(router);
	productRoutes(router);
	customerRoutes(router);
	stateRoutes(router);
	cityRoutes(router);
	pincodeRoutes(router);
	areaRoutes(router);
	societiesRoutes(router);
	towerRoutes(router);
	brandRoutes(router);
	wishlistRoutes(router);
	cartRoutes(router);
	couponRoutes(router);
	orderRoutes(router);
	walletRoutes(router);
	offerRoutes(router);
	
}