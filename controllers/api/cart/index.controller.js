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
            let varientId = req.body.varientId;
            let sessionId = req.body.sessionId;
            let quantity = parseInt(req.body.quantity);
            let price = parseInt(req.body.price);
            let moveToWishlist = req.body.moveToWishlist;
            let cartCondition = {} ;
            let cartItemCondition = { productId: mongoose.mongo.ObjectID(productId), varientId: mongoose.mongo.ObjectID(varientId) } ;
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
            let cartData = await Cart.find(cartCondition);
            if(moveToWishlist)
            {
                await config.helpers.cart.moveToWishlist(productId, varientId, userId, cartData[0], async function (wishlistData) {
                    return res.status(200).json({ 
                        data: [], 
                        status: 'success', 
                        message: "Product moved to wishlist successfully!!" 
                    });	
                });
            }
            else
            {
                if(cartData.length>0) {
                    cartId = cartData[0].id;
                    let cartUpdateData = {
                        userId : userId,
                        sessionId : sessionId,
                        grandTotal : ( parseInt(cartData[0].grandTotal) + price * quantity ),
                        quantity : ( parseInt(cartData[0].quantity) + quantity )
                    };
                    let updateCartData = await Cart.update({_id:mongoose.mongo.ObjectID(cartData[0].id)},cartUpdateData);
                }
                else
                {
                    let cartInsertData = {
                        userId : userId,
                        sessionId : sessionId,
                        grandTotal : price * quantity,
                        quantity : quantity,
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
                        totalPrice : ( parseInt(cartItemData[0].totalPrice) + price * quantity ),
                        quantity : ( parseInt(cartItemData[0].quantity) + quantity )
                    };
                    let updateCartData = await Cartitem.update({_id:mongoose.mongo.ObjectID(cartItemData[0].id)},cartItemUpdateData);
                    return res.status(200).json({ 
                        data: [], 
                        status: 'success', 
                        message: "Cart has been updated successfully!!" 
                    });	
                }
                else
                {
                    let cartItemInsertData = {
                        cartId : cartId,
                        userId : userId,
                        sessionId : sessionId,
                        productId : productId,
                        varientId : varientId,
                        price : price,
                        totalPrice : price * quantity,
                        quantity : quantity
                    };
                    let cartitem = new Cartitem(cartItemInsertData);
                    cartitem.save(function(err, data){
                        return res.status(200).json({ 
                            data: [], 
                            status: 'success', 
                            message: "Cart has been added successfully!!" 
                        });	
                    })
                }
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