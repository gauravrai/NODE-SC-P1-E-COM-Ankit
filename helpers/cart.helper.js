const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
var Wishlist = model.wishlist;
var Cart = model.cart;
var Cartitem = model.cart_item;

module.exports = {
	moveToWishlist: async function(productId, userId, cartData, cb) {
		let wishlistData = {
			userId : mongoose.mongo.ObjectId(userId),
			productId : mongoose.mongo.ObjectId(productId)
		};
		let wishlist = new Wishlist(wishlistData);
		wishlist.save();
		let cartItemCondition = { productId: mongoose.mongo.ObjectID(productId), userId: mongoose.mongo.ObjectID(userId) };
		// let cartUpdateData = {
		// 	grandTotal : ( cartData.grandTotal + req.body.price * req.body.quantity ),
		// 	quantity : ( cartData.quantity + req.body.quantity )
		// };
		// let updateCartData = Cart.update({id:mongoose.mongo.ObjectID(cartData.id)},cartUpdateData);
		await Cartitem.deleteOne(cartItemCondition);
		cb(data);
	}
};


