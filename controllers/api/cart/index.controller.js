const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Cart = model.cart;
const Cartitem = model.cart_item;
const Wishlist = model.wishlist;
const { validationResult } = require('express-validator');

module.exports = {
    // @route       GET api/v1/addToCart
    // @description User request for product
    // @access      Public
    addToCart : async function(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let userId = req.query.userId;
            let productId = req.query.productId;
            let sessionId = req.query.sessionId;
            let quantity = req.query.quantity;
            let price = req.query.price;
            let moveToWishlist = req.query.moveToWishlist;
            var cartCondition = {} ;
            var userData = {} ;
            var cartId = '' ;
            if(userId){
                userData = await userData.findOne({id: mongoose.mongo.ObjectID(userId), deletedAt: 0, status: true});
                cartCondition.userId =userId;
            }else 
            {
                cartCondition.sessionId = sessionId;
            }   
            var cartData = await Cart.find(cartCondition);
            if(cartData.length>0) {
                cartId = cartData.id;
                let cartUpdateData = {
                    userId : req.body.userId,
                    sessionId : req.body.sessionId,
                    grandTotal : ( cartData.grandTotal + req.body.price ),
                    quantity : ( cartData.quantity + req.body.quantity )
                };
                var updateCartData = Cart.update({id:mongoose.mongo.ObjectID(cartData.id)},cartUpdateData);
            }
            else
            {
                let cartInsertData = {
                    userId : req.body.userId,
                    sessionId : req.body.sessionId,
                    grandTotal : req.body.price,
                    quantity : req.body.quantity,
                    customerDetail : userData,
                    address : userData.address,
                    pincode : userData.pincode,
                };
                let cart = new Cart(cartInsertData);
                cart.save();
                cartId = cart.id;
            }
            let cartItemInsertData = {
                cartId : cartId,
                userId : req.body.userId,
                sessionId : req.body.sessionId,
                productId : req.body.productId,
                price : req.body.price,
                quantity : req.body.quantity
            };
            let cartitem = new Cart(cartItemInsertData);
            cartitem.save(function(err, data){
				return res.status(200).json({ 
                    data: userRequestData, 
                    status: 'success', 
                    message: "Cart has been updated successfully!!" 
                });	
			})
        }
        catch (e){
            console.log(e)
            return res.status(500).json({ 
                                    data: [],  
                                    status: 'error', 
                                    errors: [{
                                        msg: "Internal server error"
                                    }]
                                });
        }
    },
}