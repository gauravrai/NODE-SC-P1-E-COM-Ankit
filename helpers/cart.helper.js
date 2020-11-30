const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
var Wishlist = model.wishlist;
var Cart = model.cart;
var Cartitem = model.cart_item;

module.exports = {
	moveToWishlist: async function(productId, varientId, userId, cartData, cb) {
		let wishlistData = {
			userId : mongoose.mongo.ObjectId(userId),
			productId : mongoose.mongo.ObjectId(productId),
			varientId : mongoose.mongo.ObjectId(varientId)
		};
		let wishlist = new Wishlist(wishlistData);
		wishlist.save();

		let cartItemCondition = { cartId: mongoose.mongo.ObjectID(cartData.id), userId: mongoose.mongo.ObjectID(userId) };
		let cartItemDeleteCondition = { cartId: mongoose.mongo.ObjectID(cartData.id), productId: mongoose.mongo.ObjectID(productId), varientId: mongoose.mongo.ObjectID(varientId), userId: mongoose.mongo.ObjectID(userId) };
		let deletedData = await Cartitem.findOne(cartItemDeleteCondition);
		await Cartitem.deleteOne(cartItemDeleteCondition);
		let cartItemData = await Cartitem.find(cartItemCondition);
		if(cartItemData.length > 0) {
			let cartUpdateData = {
				grandTotal : ( parseInt(cartData.grandTotal) - parseInt(deletedData.totalPrice) ),
				quantity : ( parseInt(cartData.quantity) - parseInt(deletedData.quantity) )
			};
			
			if(cartData.taxType == 1)
			{
				cartUpdateData.totalTax = cartData.totalTax - deletedData.cgst - deletedData.sgst;
			}else{
				cartUpdateData.totalTax = cartData.totalTax - deletedData.igst;
			}
			let updateCartData = await Cart.update({_id:mongoose.mongo.ObjectID(cartData.id)},cartUpdateData);
			cb();
		}else {
			await Cart.deleteOne({_id: mongoose.mongo.ObjectID(cartData.id)});
			cb();
		}
	}
};


