var express = require('express');

module.exports = function(app) {

	//routes
	var loginRoutes = require('./admin/login.routes');
	var dashboardRoutes = require('./admin/dashboard.routes');
	var roleRoutes = require('./admin/role.routes');
	var administratorRoutes = require('./admin/administrator.routes');
	var categoryRoutes = require('./admin/category.routes');
	var subcategoryRoutes = require('./admin/sub_category.routes');
	var stateRoutes = require('./admin/state.routes');
	var cityRoutes = require('./admin/city.routes');
	var pincodeRoutes = require('./admin/pincode.routes');
	var areaRoutes = require('./admin/area.routes');
	var societyRoutes = require('./admin/society.routes');
	var towerRoutes = require('./admin/tower.routes');
	var storeRoutes = require('./admin/store.routes');
	var productRoutes = require('./admin/product.routes');
	var offerRoutes   = require('./admin/offer.routes');
	var discountRoutes   = require('./admin/discount.routes');
	var brandRoutes      =  require('./admin/brand.routes');
	var stockRoutes      =  require('./admin/stock.routes');
	var walletRoutes      =  require('./admin/wallet.routes');
	var varientRoutes      =  require('./admin/varient.routes');
	var customerRoutes      =  require('./admin/customer.routes');
	var orderRoutes = require('./admin/order.routes');
	var productRequestRoutes = require('./admin/productrequest.routes');

	var ajaxRoutes = require('./admin/ajax.routes');
	var router = express.Router();
	app.use('',router);

	//import admin routes
	loginRoutes(router);
	dashboardRoutes(router);
	roleRoutes(router);
	administratorRoutes(router);
	categoryRoutes(router);
	subcategoryRoutes(router);
	stateRoutes(router);
	cityRoutes(router);
	pincodeRoutes(router);
	areaRoutes(router);
	societyRoutes(router);
	towerRoutes(router);
	storeRoutes(router);
	productRoutes(router);
	offerRoutes(router);
	discountRoutes(router);
    brandRoutes(router);
    stockRoutes(router);
    walletRoutes(router);
    varientRoutes(router);
    customerRoutes(router);
	orderRoutes(router);
	productRequestRoutes(router);
	
	ajaxRoutes(router);
}
