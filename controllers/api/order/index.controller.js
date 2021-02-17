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
const Transaction = model.transaction;
const Emailtemplate = model.email_template;
const Wallet = model.wallet;
const Walletentry = model.wallet_entry;
const { validationResult } = require('express-validator');
const Razorpay = require('razorpay');
const request = require('request');

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
            let walletPayment = req.body.walletPayment; //true or false
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
                let receiptNo = 'RC'+moment().format('YMDhms');
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
                    receiptNo: receiptNo,
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
                        receiptNo: receiptNo,
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
                
                if(cartData.couponId){
                    let couponUsesInsertData = {
                        couponId : cartData.couponId,
                        couponNo : cartData.couponNo,
                        userId : userId,
                    };
                    let couponuses = new Couponuses(couponUsesInsertData);
                    couponuses.save();
                }
                if(paymentType == 'COD')
                {   
                    let messageData = await Messagetemplate.findOne({slug: 'NEW-ORDER'});
                    let slug = messageData.slug;
                    let message = messageData.message;
                    message = message.replace('[CUSTOMER]', userData.name);
                    message = message.replace('[ODID]', odid);
                    await config.helpers.sms.sendSMS(userData, slug, message, async function (smsData) {
                        let emailData = await Emailtemplate.findOne({slug: 'NEW-ORDER'});
                        let subject = emailData.subject;
                        let message1 = emailData.message;
                        message1 = message1.replace('[CUSTOMER]', userData.name);
                        message1 = message1.replace('[ODID]', odid);
                        await config.helpers.email.sendEmail(userData.email, subject, message1, async function (emailData) {
                            return res.status(200).json({ 
                                data: data, 
                                status: 'success', 
                                message: "Order placed successfully!!" 
                            });	
                        });
                    });
                }
                else
                {
                    if(walletPayment == true){
                        let walletAmount = req.body.walletAmount;
                        let transactionId = 'LBW-'+moment().format('YMDhms');
                        let walletEntryData = {
                            userId : userId,
                            transactionId: transactionId,
                            amount : walletAmount,
                            type : 'Sub',
                        };
                        let messageSlug = 'WALLET-DEBIT';
                        let messageData = await Messagetemplate.findOne({slug: messageSlug});
                        let slug = messageData.slug;
                        let message = messageData.message;
                        message = message.replace('[CUSTOMER]', userData.name);
                        message = message.replace('[AMOUNT]', walletAmount);
                        message = message.replace('[DATETIME]', moment().format('D-M-YYYY hh-mm A'));
                        message = message.replace('[DATETIME]', moment().format('D-M-YYYY hh-mm A'));

                        let walletentry = new Walletentry(walletEntryData);
                        walletentry.save();

                        
			            let wallet = await Wallet.findOne({userId: mongoose.mongo.ObjectID(userId)});
                        let walletData = {};
                        let totalAmount = wallet.totalAmount;
                        walletData.updatedAt = Date.now();
                        walletAmount = totalAmount - walletAmount;
                        walletData.totalAmount = walletAmount;
                        message = message.replace('[TOTALBALANCE]', walletAmount);
                        await Wallet.updateOne(
                            { userId: mongoose.mongo.ObjectId(userId) },
                            walletData, async function(err,data){
                                if(err){console.log(err)}
                                await config.helpers.sms.sendSMS(userData, slug, message, async function (smsData) {
                                });
                        })
                    }   
                    let instance = new Razorpay({ key_id: config.constant.RAZORPAY_KEY_ID, key_secret: config.constant.RAZORPAY_KEY_SECRET })
                    let payAmount = req.body.payAmount;
                    let options = {
                      amount: 100,  // amount in the smallest currency unit
                      currency: "INR",
                      receipt: receiptNo
                    };
                    instance.orders.create(options, function(err, paymentDetails) {
                        if(err)
                        {
                            console.log('Error-----------------',err);
                        }
                        data.paymentDetails = paymentDetails;
                        
                        let transactionData = {
                            userId : userId,
                            odid : odid,
                            receiptNo : receiptNo,
                            razorpayOrderId : paymentDetails.id,
                            paymentStatus: 'PENDING'
                        };
                        let transaction = new 
                        Transaction(transactionData);
                        transaction.save();
                        return res.status(200).json({ 
                            data: data, 
                            status: 'success', 
                            message: "Order placed successfully!!" 
                        });	
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

    // @route       GET api/v1/managePaymentResponse
    // @description Mange onlien Payment
    // @access      Public
    managePaymentResponse : async function(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let userId = req.body.userId;
            let razorpayOrderId = req.body.razorpayOrderId;
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
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        
        try{
            let paymentId = req.body.paymentId;
            let orderId = req.body.orderId;
            let userId = req.body.userId;
            let odid = req.body.odid;
            request('https://'+config.constant.RAZORPAY_KEY_ID+':'+config.constant.RAZORPAY_KEY_SECRET+'@api.razorpay.com/v1/payments/'+paymentId, async function (error, response, body) {
                let data = JSON.parse(body);
                let userData = await Customer.findOne({_id: mongoose.mongo.ObjectID(userId)});
                let transactionUpdateData = {
                    totalAmount : data.amount,
                    paymentStatus : 'COMPLETED',
                    razorpayOrderId : orderId,
                    razorpayPaymentId : paymentId,
                    razorpayResponse : data,
                }
                await Transaction.updateOne( { razorpayOrderId: orderId }, transactionUpdateData);

                if(data.status == "captured") {
                    let orderUpdateData = {
                        paymentStatus : 'COMPLETED',
                    }
                    await Order.updateOne( { odid: odid }, orderUpdateData);
                    let messageData = await Messagetemplate.findOne({slug: 'NEW-ORDER'});
                    let slug = messageData.slug;
                    let message = messageData.message;
                    message = message.replace('[CUSTOMER]', userData.name);
                    message = message.replace('[ODID]', odid);
                    await config.helpers.sms.sendSMS(userData, slug, message, async function (smsData) {
                        let emailData = await Emailtemplate.findOne({slug: 'NEW-ORDER'});
                        let subject = emailData.subject;
                        let message1 = emailData.message;
                        message1 = message1.replace('[CUSTOMER]', userData.name);
                        message1 = message1.replace('[ODID]', odid);
                        await config.helpers.email.sendEmail(userData.email, subject, message1, async function (emailData) {
                            return res.status(200).json({ 
                                data: data, 
                                status: 'success', 
                                message: "Order placed successfully!!" 
                            });	
                        });
                    });
                }else {
                    let walletAmount = req.body.walletAmount;
                    let transactionId = 'LBW-'+moment().format('YMDhms');
                    let walletEntryData = {
                        userId : userId,
                        transactionId: transactionId,
                        amount : walletAmount,
                        type : 'Add',
                    };
                    let messageSlug = 'WALLET-CREDIT';
                    let messageData = await Messagetemplate.findOne({slug: messageSlug});
                    let slug = messageData.slug;
                    let message = messageData.message;
                    message = message.replace('[CUSTOMER]', userData.name);
                    message = message.replace('[AMOUNT]', walletAmount);
                    message = message.replace('[DATETIME]', moment().format('D-M-YYYY hh-mm A'));
                    message = message.replace('[DATETIME]', moment().format('D-M-YYYY hh-mm A'));

                    let walletentry = new Walletentry(walletEntryData);
                    walletentry.save();

                    let wallet = await Wallet.findOne({userId: mongoose.mongo.ObjectID(userId)});
                    let walletData = {};
                    let totalAmount = wallet.totalAmount;
                    walletData.updatedAt = Date.now();
                    walletAmount = totalAmount + walletAmount;
                    walletData.totalAmount = walletAmount;
                    message = message.replace('[TOTALBALANCE]', walletAmount);
                    await Wallet.updateOne(
                        { userId: mongoose.mongo.ObjectId(userId) },
                        walletData, async function(err,data){
                            if(err){console.log(err)}
                            await config.helpers.sms.sendSMS(userData, slug, message, async function (smsData) {
                            });
                    })
                    return res.status(400).json({ 
                        data: [], 
                        status: 'error', 
                        message: "Payment not captured!!" 
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
                        status: 'error', 
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