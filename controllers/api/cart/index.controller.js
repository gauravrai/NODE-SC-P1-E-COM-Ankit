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
            let cartItemData = await Cartitem.find(cartItemCondition);
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
                    let previousGrandTotal = parseInt(cartData[0].grandTotal);
                    let previousQuantity = parseInt(cartData[0].quantity);
                    if(cartItemData.length>0) {
                        previousGrandTotal = previousGrandTotal - cartItemData[0].totalPrice;
                        previousQuantity = previousQuantity - cartItemData[0].quantity;
                    }
                    let cartUpdateData = {
                        grandTotal : ( previousGrandTotal + price * quantity ),
                        quantity : ( previousQuantity + quantity )
                    };
                    let updateCartData = await Cart.update({_id:mongoose.mongo.ObjectID(cartData[0].id)},cartUpdateData);
                }
                else
                {
                    let cartInsertData = {
                        userId : userId,
                        sessionId : sessionId,
                        grandTotal : price * quantity,
                        quantity : quantity
                    };
                    let cart = new Cart(cartInsertData);
                    cart.save();
                    cartId = cart.id;
                }
                if(cartItemData.length>0) { 
                    let cartItemUpdateData = {
                        totalPrice : ( price * quantity ),
                        quantity : quantity
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
    
	removeFromCart: async function(req,res) {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let cartItemId = req.body.cartItemId;
            let cartItemCondition = { _id: mongoose.mongo.ObjectID(cartItemId) } ;
            
            let deletedData = await Cartitem.findOne(cartItemCondition);
            let cartId = deletedData.cartId;
            let cartData = await Cart.findOne({_id:mongoose.mongo.ObjectID(cartId)});
            await Cartitem.deleteOne(cartItemCondition);

            let cartItemData = await Cartitem.find( {cartId : mongoose.mongo.ObjectID(cartId)} );
            if(cartItemData.length > 0) {
                let cartUpdateData = {
                    grandTotal : ( parseInt(cartData.grandTotal) - parseInt(deletedData.totalPrice) ),
                    quantity : ( parseInt(cartData.quantity) - parseInt(deletedData.quantity) )
                };
                let updateCartData = await Cart.update({_id:mongoose.mongo.ObjectID(cartData.id)},cartUpdateData);
                return res.status(200).json({ 
                    data: [], 
                    status: 'success', 
                    message: "Cart has been updated successfully!!" 
                });	
            }else {
                await Cart.deleteOne({_id: mongoose.mongo.ObjectID(cartId)});
                return res.status(200).json({ 
                    data: [], 
                    status: 'success', 
                    message: "Cart has been updated successfully!!" 
                });	
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
    
	getCartData: async function(req,res) {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let userId = req.body.userId;
            let sessionId = req.body.sessionId;
            let condition = { } ;
            if(userId){
                condition.userId = mongoose.mongo.ObjectId(userId);
            }else 
            {
                condition.sessionId = sessionId;
            }  
            let cartItemData = await Cartitem.aggregate([ 
                {
                    $match : condition
                },
                {
                    $lookup:
                      {
                        from: "products",
                        localField: "productId",
                        foreignField: "_id",
                        as: "productData"
                      }
                },
                {
                    $project: { 
                        __v:0,
                        createdAt:0,
                        updatedAt:0,
                        status:0,
                        deletedAt:0,
                        "productData.__v":0,
                        "productData.createdAt":0,
                        "productData.updatedAt":0,
                        "productData.status":0,
                        "productData.deletedAt":0
                    }
                },
                {
                    $unwind: "$productData"
                },
                {
                    $unwind: "$productData.inventory"
                },
                {
                    $group: {
                        "_id":"$_id",
                        "cartId": { $first:"$cartId" },
                        "userId": { $first:"$userId" },
                        "productId": { $first:"$productId" },
                        "varientId": { $first:"$varientId" },
                        "price": { $first:"$price" },
                        "totalPrice": { $first:"$totalPrice" },
                        "quantity": { $first:"$quantity" },
                        "productData": { $first:"$productData" }
                    }
                },
                {
                    $addFields: {
                        "thumbnailPath" : config.constant.PRODUCTTHUMBNAILSHOWPATH,
                        "smallPath" : config.constant.PRODUCTSMALLSHOWPATH,
                        "largePath" : config.constant.PRODUCTLARGESHOWPATH
                    }
                },
            ]);
            
            if(cartItemData.length > 0) {
                let data = {};
                data.cartItemData = cartItemData;
                let cartData = await Cart.findOne(condition);
                data.cartData = cartData;
                return res.status(200).json({ 
                    data: data, 
                    status: 'success', 
                    message: "Cart data found successfully!!" 
                });	
            }else {
                return res.status(400).json({ 
                    data: [], 
                    status: 'success', 
                    message: "Cart has been empty!!" 
                });	
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
	}
}