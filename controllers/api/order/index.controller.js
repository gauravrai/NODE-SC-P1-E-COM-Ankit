const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const mongoose = require('mongoose');
const moment = require('moment');
const Cart = model.cart;
const Cartitem = model.cart_item;
const Customer = model.customer;
const Offer = model.offer;
const Pincode = model.pincode;
const Order = model.order;
const Orderdetail = model.order_detail;
const Freeitem = model.free_item;
const Product = model.product;
const Couponuses = model.coupon_uses;
const Messagetemplate = model.message_template;
const { validationResult } = require('express-validator');
const Razorpay = require('razorpay');

module.exports = {
    // @route       GET api/v1/placeOrder
    // @description Place order
    // @access      Public
    placeOrder : async function(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let userId = req.body.userId;
            let paymentType = req.body.paymentType;
            let orderFrom = req.body.orderFrom;
            let userData = await Customer.findOne({_id: mongoose.mongo.ObjectID(userId)});
            let cartData = await Cart.findOne({userId: mongoose.mongo.ObjectID(userId)});
            let data = {};
            if(cartData)
            {
                let shippingPrice = 0;
                if(userData.shippingAddress.pincode){
                    shippingPrice = await Pincode.findOne({_id: mongoose.mongo.ObjectID(userData.shippingAddress.pincode)});
                    shippingPrice = shippingPrice ? shippingPrice.shippingCharges : 0;
                }
                let odid = 'OD'+moment().format('YMDhms');
                let customerDetail = {
                    name : userData.name ? userData.name : '',
                    mobile : userData.mobile ? userData.mobile : '',
                    email : userData.email ? userData.email : '',
                    gst : userData.gst ? userData.gst : '',
                    sameAsBillingAddress: userData.sameAsBillingAddress ? userData.sameAsBillingAddress : false,
                    billingAddress: userData.billingAddress ? userData.billingAddress : {},
                    shippingAddress: userData.shippingAddress ? userData.shippingAddress : {}
                }
                let shippingCharges = shippingPrice;
                let couponAmount = cartData.couponAmount ? cartData.couponAmount : 0;
                let orderInsertData = {
                    odid: odid,
                    userId: mongoose.mongo.ObjectID(cartData.userId),
                    customerDetail : customerDetail,
                    sessionId: cartData.sessionId,
                    grandTotal: ( cartData.grandTotal + shippingCharges ),
                    subTotal: ( cartData.grandTotal  + shippingCharges - couponAmount ),
                    shippingPrice: shippingCharges,
                    quantity: cartData.quantity,
                    orderStatus: 'NEW',
                    orderFrom: orderFrom == 'app' ? 'APP' : 'WEB',
                    paymentStatus: 'PENDING',
                    paymentType: paymentType,
                    taxType: cartData.taxType,
                    totalTax: cartData.totalTax
                }
                if(cartData.couponId){
                    orderInsertData.couponId =  mongoose.mongo.ObjectID(cartData.couponId);
                    orderInsertData.couponNo =  cartData.couponNo;
                    orderInsertData.couponAmount =  couponAmount;
                }
                let order = new Order(orderInsertData);
                order.save();
                data.order = order;

                let offerData = await Offer.find({deletedAt:0, status:true, from: { '$lte': new Date() }, to: { '$gte':  new Date()}, $or : [
                    { 
                        applyFor : "both"
                    },
                    { 
                        applyFor: orderFrom
                    }
                ]});

                let cartItemData = await Cartitem.find({userId: mongoose.mongo.ObjectID(userId)});
                let dataOrderDetail = [];
                for (let i = 0; i < cartItemData.length; i++) {
                    let orderDetailInsertData = {
                        userId: mongoose.mongo.ObjectID(cartItemData[i].userId),
                        odid: odid,
                        productId: mongoose.mongo.ObjectID(cartItemData[i].productId),
                        varientId: mongoose.mongo.ObjectID(cartItemData[i].varientId), 
                        price: cartItemData[i].price,
                        totalPrice: cartItemData[i].totalPrice,
                        quantity: cartItemData[i].quantity,
                        customerDetail : customerDetail,
                        taxType: cartItemData[i].taxType,
                        tax: cartItemData[i].tax,
                        cgst: cartItemData[i].cgst,
                        sgst: cartItemData[i].sgst,
                        igst: cartItemData[i].igst
                    }
                    let orderdetail = new Orderdetail(orderDetailInsertData);
                    orderdetail.save();
                    dataOrderDetail.push(orderdetail);
                    for (let j = 0; j < offerData.length; j++) {
                        let productFound = offerData[j].offerProductId.includes(cartItemData[i].productId);
                        if(productFound)
                        {
                            if(cartItemData[i].quantity >= offerData[j].multipleOf)
                            {
                                let offerProductData = await Product.findOne({ _id: mongoose.mongo.ObjectID(cartItemData[i].productId) });
                                let inventory = offerProductData.inventory[0];
                                let freeProductData = await Product.findOne({ _id: mongoose.mongo.ObjectID(offerData[j].freeProductId) });
                                
                                let freeItemInsertData = {
                                    odid: odid,
                                    orderId: mongoose.mongo.ObjectID(order.id),
                                    orderDetailId: mongoose.mongo.ObjectID(orderdetail.id),
                                    userId: mongoose.mongo.ObjectID(cartItemData[i].userId),
                                    categoryId: mongoose.mongo.ObjectID(offerData[j].freeCategoryId), 
                                    subcategoryId: mongoose.mongo.ObjectID(offerData[j].freeSubcategoryId),
                                    productId: mongoose.mongo.ObjectID(offerData[j].freeProductId),
                                    varientId: mongoose.mongo.ObjectID(offerData[j].freeVarientId),
                                    price : freeProductData.price,
                                    quantity : offerData[j].freeItem
                                }
                                if(offerData[j].offerVarient == 'default')
                                {
                                    function search(nameKey, myArray){
                                        for (var i=0; i < myArray.length; i++) {
                                            if (String(myArray[i].varientId) === nameKey) {
                                                return myArray[i];
                                            }
                                        }
                                    }
                                    var resultObject = search(cartItemData[i].varientId, inventory);
                                    if(typeof resultObject != 'undefined' && resultObject.default == true)
                                    {
                                        let freeitem = new Freeitem(freeItemInsertData);
                                        freeitem.save();
                                    }
                                }
                                else
                                {
                                    let freeitem = new Freeitem(freeItemInsertData);
                                    freeitem.save();
                                }
                            }
                        }
                        
                    }
                }
                data.orderdetail = dataOrderDetail;
                await Cart.deleteOne({ userId : mongoose.mongo.ObjectId(userId)});
                await Cartitem.deleteMany({ userId : mongoose.mongo.ObjectId(userId)});
                if(paymentType == 'COD')
                {   
                    if(cartData.couponId){
                        let couponUsesInsertData = {
                            couponId : cartData.couponId,
                            couponNo : cartData.couponNo,
                            userId : userId,
                        };
                        let couponuses = new Couponuses(couponUsesInsertData);
                        couponuses.save();
                    }
                    let messageData = await Messagetemplate.findOne({slug: 'NEW-ORDER'});
                    let slug = messageData.slug;
                    let message = messageData.message;
                    message = message.replace('[CUSTOMER]', userData.name);
                    message = message.replace('[ODID]', odid);
                    await config.helpers.sms.sendSMS(userData, slug, message, async function (smsData) {
                        return res.status(200).json({ 
                            data: data, 
                            status: 'success', 
                            message: "Order placed successfully!!" 
                        });	
                    });
                }
                else
                {
                    //code for online payment
                    return res.status(200).json({ 
                        data: data, 
                        status: 'success', 
                        message: "Order placed successfully!!" 
                    });	
                }
            }
            else
            {
                return res.status(200).json({ 
                    data: [], 
                    status: 'error', 
                    message: "Your cart is empty!!" 
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

    // @route       GET api/v1/getOrderData
    // @description Get Order list of user
    // @access      Public
	getOrderData: async function(req,res) {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let userId = req.body.userId;
            let condition = {userId: mongoose.mongo.ObjectId(userId)};
            let orderData = await Order.find(condition);
            if(orderData.length > 0) {
                return res.status(200).json({ 
                    data: orderData, 
                    status: 'success', 
                    message: "Order data found successfully!!" 
                });	
            }else {
                return res.status(400).json({ 
                    data: [], 
                    status: 'success', 
                    message: "Order has been empty!!" 
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
    
    checkPayment : async function(req,res){
        // var instance = new Razorpay({ key_id: config.constant.RAZORPAY_KEY_ID, key_secret: config.constant.RAZORPAY_KEY_SECRET })

        // var options = {
        //   amount: 50000,  // amount in the smallest currency unit
        //   currency: "INR",
        //   receipt: "order_rcptid_11"
        // };
        // instance.orders.create(options, function(err, order) {
        //     if(err)
        //     {
        //         console.log('Error-----------------',err);
        //     }
        //     console.log(order);
        //     return res.status(400).json({ 
        //         data: order, 
        //         status: 'success', 
        //         message: "Order has been empty!!" 
        //     });	
        // });
        var request = require('request');
        request({
        method: 'POST',
        url: 'https://'+config.constant.RAZORPAY_KEY_ID+':'+config.constant.RAZORPAY_KEY_SECRET+'@api.razorpay.com/v1/payments/pay_G4EGqgABQ2c14J/capture',
        form: {
            amount: 100,
            currency: "INR"
        }
        }, function (error, response, body) {
            if(error)
            {
                console.log('Error-----------------',error);
            }
            console.log('Status:', response.statusCode);
            console.log('Headers:', JSON.stringify(response.headers));
            console.log('Response:', body);
                return res.status(response.statusCode).json({ 
                    data: response, 
                });	
        });
    },

    getInvoiceData: async function(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        
        try{
            
			let odid = req.query.odid;
			await config.helpers.order.getInvoiceData(odid, async function (data) {
                if(data) {
                    return res.status(200).json({ 
                        data: data, 
                        status: 'success', 
                        message: "Invoice data found successfully!!" 
                    });	
                }else {
                    return res.status(400).json({ 
                        data: [], 
                        status: 'success', 
                        message: "Invoice has been empty!!" 
                    });	
                }
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