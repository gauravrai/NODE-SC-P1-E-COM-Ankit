const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Discount = model.discount;
const Customer = model.customer;
const Couponuses = model.coupon_uses;
const Cart = model.cart;
const Cartitem = model.cart_item;
const Order = model.order;
const { validationResult } = require('express-validator');

module.exports = {
    // @route       GET api/v1/applyCoupon
    // @description apply coupon
    // @access      Public
    applyCoupon : async function(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let couponNo = req.body.couponNo;
            let userId = req.body.userId;
            let cartId = req.body.cartId;
            let orderFrom = req.body.orderFrom; //app, website, both
            let couponData = await Discount.findOne({couponNo: couponNo,deletedAt:0,status:true,from: { '$lte': new Date() },to: { '$gte':  new Date()}});
            let cartData = await Cart.findOne({_id: mongoose.mongo.ObjectID(cartId)});
            if(couponData)
            {
                if(couponData.applyFor == orderFrom || couponData.applyFor == 'both')
                {
                    let couponUsesData = await Couponuses.find({userId: mongoose.mongo.ObjectID(userId),couponId: mongoose.mongo.ObjectID(couponData.id)});
                    if(couponUsesData.length < couponData.noOfUses)
                    {
                        if(couponData.firstOrder == true)
                        {
                            let orderData = await Order.findOne( {userId: mongoose.mongo.ObjectID(userId), $or : [
                                { 
                                    $and : [ 
                                          { payementType: "COD"},
                                          { orderStatus : "IN_PROCESS"}
                                        ]
                                },
                                { 
                                  payementStatus: "COMPLETED"
                                }
                              ] } );
                              console.log(orderData);
                            if(orderData)
                            {
                                return res.status(200).json({ 
                                    data: [], 
                                    status: 'error', 
                                    message: "This coupon is only valid for first order!!" 
                                });	
                            }
                        }
                        let couponUsesInsertData = {
                            couponId : couponData.id,
                            couponNo : couponData.couponNo,
                            userId : userId,
                        };
                        let couponuses = new Couponuses(couponUsesInsertData);
                        couponuses.save();
                        let couponAmount = 0;
                        if(couponData.offerType == 'percentage')
                        {
                            couponAmount = (cartData.grandTotal/100)*couponData.percentage;
                        }
                        else
                        {
                            couponAmount = couponData.fixed;
                        }
                        let cartUpdateData = {
                            couponId : couponData.id,
                            couponNo : couponData.couponNo,
                            couponAmount : couponAmount
                        }
                        await Cart.updateOne(
                            { _id: mongoose.mongo.ObjectId(cartId) },
                            cartUpdateData, function(err,data){
                                if(err){console.log(err)}
                        })

                        return res.status(200).json({ 
                            data: [], 
                            status: 'success', 
                            message: "Coupon applied successfully!!" 
                        });	
                    }
                    else{
                        return res.status(200).json({ 
                            data: [], 
                            status: 'error', 
                            message: "You have already used this coupon!!" 
                        });	
                    }
                }
                else
                {
                    return res.status(200).json({ 
                        data: [], 
                        status: 'error', 
                        message: "Invalid Coupon!!" 
                    });	
                }
            }
            else{
                return res.status(200).json({ 
                    data: [], 
                    status: 'error', 
                    message: "Invalid Coupon!!" 
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

	getCoupon: async function(req,res) {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let couponData = await Discount.find( {deletedAt:0,status:true,from: { '$lte': new Date() },to: { '$gte':  new Date()}}, {couponName: 1, couponNo: 1});
            return res.status(200).json({ 
                data: couponData, 
                status: 'success', 
                message: "Coupon data found successfully!!" 
            });	
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