const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Cart = model.cart;
const Cartitem = model.cart_item;
const Customer = model.customer;
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
            let userId = req.body.userId;
            let productId = req.body.productId;
            let sessionId = req.body.sessionId;
            let quantity = req.body.quantity;
            let price = req.body.price;
            let moveToWishlist = req.body.moveToWishlist;
            let cartCondition = {} ;
            let cartItemCondition = { productId: mongoose.mongo.ObjectID(productId) } ;
            let userData = {} ;
            let cartId = '' ;
            if(userId){
                userData = await Customer.findOne({_id: mongoose.mongo.ObjectID(userId), deletedAt: 0, status: true});
                cartCondition.userId =userId;
                cartItemCondition.userId =userId;
            }else 
            {
                cartCondition.sessionId = sessionId;
                cartItemCondition.sessionId = sessionId;
            }  
             console.log({id: mongoose.mongo.ObjectID(userId), deletedAt: 0, status: true});
             console.log(userData);
            let cartData = await Cart.find(cartCondition);
            if(moveToWishlist)
            {
                await config.helpers.cart.moveToWishlist(productId, userId, cartData, async function (wishlistData) {
                    console.log(wishlistData);
                    return res.status(200).json({ 
                        data: wishlistData, 
                        status: 'success', 
                        message: "Product moved to wishlist successfully!!" 
                    });	
                });
            }
            if(cartData.length>0) {
                cartId = cartData.id;
                let cartUpdateData = {
                    userId : req.body.userId,
                    sessionId : req.body.sessionId,
                    grandTotal : ( cartData.grandTotal + req.body.price * req.body.quantity ),
                    quantity : ( cartData.quantity + req.body.quantity )
                };
                let updateCartData = Cart.update({id:mongoose.mongo.ObjectID(cartData.id)},cartUpdateData);
            }
            else
            {
                let cartInsertData = {
                    userId : req.body.userId,
                    sessionId : req.body.sessionId,
                    grandTotal : req.body.price * req.body.quantity,
                    quantity : req.body.quantity,
                    customerDetail : userData ? userData : {},
                    address : userData.address ? userData.address : '',
                    pincode : userData.pincode ? userData.pincode : '',
                };
                let cart = new Cart(cartInsertData);
                cart.save();
                cartId = cart.id;
            }
            let cartItemData = await Cartitem.find(cartItemCondition);
            if(cartItemData.length>0) { 
                let cartItemUpdateData = {
                    price : ( cartItemData.price + req.body.price ),
                    totalPrice : ( cartItemData.totalPrice + req.body.price * req.body.quantity ),
                    quantity : ( cartItemData.quantity + req.body.quantity )
                };
                let updateCartData = Cartitem.update({id:mongoose.mongo.ObjectID(cartItemData.id)},cartItemUpdateData);
                return res.status(200).json({ 
                    data: updateCartData, 
                    status: 'success', 
                    message: "Cart has been updated successfully!!" 
                });	
            }
            else
            {
                let cartItemInsertData = {
                    cartId : cartId,
                    userId : req.body.userId,
                    sessionId : req.body.sessionId,
                    productId : req.body.productId,
                    price : req.body.price,
                    totalPrice : req.body.price * req.body.quantity,
                    quantity : req.body.quantity
                };
                let cartitem = new Cartitem(cartItemInsertData);
                cartitem.save(function(err, data){
                    return res.status(200).json({ 
                        data: cartitem, 
                        status: 'success', 
                        message: "Cart has been added successfully!!" 
                    });	
                })
            }
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