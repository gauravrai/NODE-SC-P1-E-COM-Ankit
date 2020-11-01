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
const { validationResult } = require('express-validator');

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
                let shippingPrice = await Pincode.findOne({_id: mongoose.mongo.ObjectID(userData.pincodeId)});
                let odid = 'OD'+moment().format('YMDhms');
                let customerDetail = {
                    name : userData.name ? userData.name : '',
                    mobile : userData.mobile ? userData.mobile : '',
                    email : userData.email ? userData.email : '',
                    address : userData.address ? userData.address : '',
                    country : userData.country ? userData.country : '',
                    stateId : userData.stateId ? mongoose.mongo.ObjectID(userData.stateId) : '',
                    cityId : userData.cityId ? mongoose.mongo.ObjectID(userData.cityId) : '',
                    pincodeId : userData.pincodeId ? mongoose.mongo.ObjectID(userData.pincodeId) : '',
                    areaId : userData.areaId ? mongoose.mongo.ObjectID(userData.userId) : '',
                    societyId : userData.societyId ? mongoose.mongo.ObjectID(userData.areaId) : '',
                    towerId : userData.towerId ? mongoose.mongo.ObjectID(userData.towerId) : ''
                }
                let orderInsertData = {
                    odid: odid,
                    userId: mongoose.mongo.ObjectID(cartData.userId),
                    customerDetail : customerDetail,
                    sessionId: cartData.sessionId,
                    grandTotal: ( cartData.grandTotal + shippingPrice.shippingCharges ),
                    subTotal: ( cartData.grandTotal  + shippingPrice.shippingCharges - cartData.couponAmount ),
                    shippingPrice: shippingPrice.shippingCharges,
                    quantity: cartData.quantity,
                    couponId: mongoose.mongo.ObjectID(cartData.couponId),
                    couponNo: cartData.couponNo,
                    couponAmount: cartData.couponAmount,
                    orderStatus: 'NEW',
                    orderFrom: orderFrom == 'app' ? 'APP' : 'WEB',
                    paymentStatus: 'PENDING',
                    paymentType: paymentType
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
                    }
                    let orderdetail = new Orderdetail(orderDetailInsertData);
                    orderdetail.save();
                    dataOrderDetail.push(orderdetail);
                    for (let j = 0; j < offerData.length; j++) {
                        let productFound = offerData[j].offerProductId.includes(cartItemData[i].productId);
                        if(productFound)
                        {
                            if(offerData[j].multipleOf == cartItemData[i].quantity)
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
                await Cartitem.delete({ userId : mongoose.mongo.ObjectId(userId)});
                if(paymentType == 'COD')
                {
                    return res.status(200).json({ 
                        data: data, 
                        status: 'success', 
                        message: "Order placed successfully!!" 
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
}