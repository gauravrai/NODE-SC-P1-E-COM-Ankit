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

		let cartItemCondition = { cartId: mongoose.mongo.ObjectID(cartData.id), userId: mongoose.mongo.ObjectID(userId) };
		let cartItemDeleteCondition = { cartId: mongoose.mongo.ObjectID(cartData.id), productId: mongoose.mongo.ObjectID(productId), userId: mongoose.mongo.ObjectID(userId) };
		let deletedData = await Cartitem.findOne(cartItemDeleteCondition);
		await Cartitem.deleteOne(cartItemDeleteCondition);
		let cartItemData = await Cartitem.find(cartItemCondition);
		if(cartItemData.length > 0) {
			console.log(cartData);
			console.log(deletedData);
			let cartUpdateData = {
				grandTotal : ( parseInt(cartData.grandTotal) - parseInt(deletedData.totalPrice) ),
				quantity : ( parseInt(cartData.quantity) - parseInt(deletedData.quantity) )
			};
			console.log(cartUpdateData);
			let updateCartData = await Cart.update({_id:mongoose.mongo.ObjectID(cartData.id)},cartUpdateData);
			cb();
		}else {
			await Cart.deleteOne({_id: mongoose.mongo.ObjectID(cartData.id)});
			cb();
		}
	}
};


