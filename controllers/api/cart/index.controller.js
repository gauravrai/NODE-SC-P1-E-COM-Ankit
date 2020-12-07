const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const mongoose = require('mongoose');
const Cart = model.cart;
const Cartitem = model.cart_item;
const Customer = model.customer;
const Product = model.product;
const Wishlist = model.wishlist;
const Pincode = model.pincode;
const { validationResult } = require('express-validator');

module.exports = {
    // @route       GET api/v1/addToCart
    // @description User request for product
    // @access      Public
    addToCart: async function(req,res){
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
            let userData = {};
            let cartId = '';
            let customerGST = '';
            let clientGST = config.constant.CLIENT_GST_NO;
            let clientGSTStateCode = config.constant.CLIENT_GST_STATE_CODE;
            let taxType;
            let tax, cgst, sgst, igst, totalTax = 0;
            if(userId){
                userData = await Customer.findOne({_id: mongoose.mongo.ObjectID(userId), deletedAt: 0, status: true});
                cartCondition.userId =userId;
                cartItemCondition.userId =userId;
                customerGST = userData.gst;
            }else 
            {
                cartCondition.sessionId = sessionId;
                cartItemCondition.sessionId = sessionId;
            }  

            let productData = await Product.findOne({_id: mongoose.mongo.ObjectID(productId), deletedAt: 0, status: true}, {tax: 1});
            let productTax = productData.tax;
            tax = productTax;
            if(customerGST){
                let customerGSTStateCode =  customerGST.substring(0, 2);
                if(customerGSTStateCode == clientGSTStateCode){
                    productTax = productTax/2;
                    cgst = ( price * quantity * tax )/100;
                    sgst = cgst;
                    totalTax = (cgst + sgst);
                    taxType = 1;
                }else {
                    igst = ( price * quantity * tax )/100;
                    totalTax = igst;
                    taxType = 2;
                }
            }
            else
            {
                productTax = productTax/2;
                cgst = ( price * quantity * tax )/100;
                sgst = cgst;
                totalTax = (cgst + sgst);
                taxType = 1;
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
                    let previousTotalTax = cartData[0].totalTax;
                    if(cartItemData.length>0) {
                        previousGrandTotal = previousGrandTotal - cartItemData[0].totalPrice;
                        previousQuantity = previousQuantity - cartItemData[0].quantity;
                        if(cartData[0].taxType == 1)
                        {
                            previousTotalTax = previousTotalTax - cartItemData[0].cgst - cartItemData[0].sgst;
                        }else{
                            previousTotalTax = previousTotalTax - cartItemData[0].igst;
                        }
                    }
                    let cartUpdateData = {
                        grandTotal : ( previousGrandTotal + price * quantity ),
                        quantity : ( previousQuantity + quantity ),
                        taxType : taxType,
                        totalTax : ( previousTotalTax + totalTax )
                    };
                    let updateCartData = await Cart.updateOne({_id:mongoose.mongo.ObjectID(cartData[0].id)},cartUpdateData);
                }
                else
                {
                    let cartInsertData = {
                        userId : userId,
                        sessionId : sessionId,
                        grandTotal : price * quantity,
                        quantity : quantity,
                        taxType : taxType,
                        totalTax : totalTax
                    };
                    let cart = new Cart(cartInsertData);
                    cart.save();
                    cartId = cart.id;
                }
                if(cartItemData.length>0) { 
                    let cartItemUpdateData = {
                        totalPrice : ( price * quantity ),
                        quantity : quantity,
                        taxType : taxType,
                        tax : tax,
                        cgst : cgst,
                        sgst : sgst,
                        igst : igst
                    };
                    let updateCartData = await Cartitem.updateOne({_id:mongoose.mongo.ObjectID(cartItemData[0].id)},cartItemUpdateData);
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
                        quantity : quantity,
                        taxType : taxType,
                        tax : tax,
                        cgst : cgst,
                        sgst : sgst,
                        igst : igst
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
                if(cartData.taxType == 1)
                {
                    cartUpdateData.totalTax = cartData.totalTax - deletedData.cgst - deletedData.sgst;
                }else{
                    cartUpdateData.totalTax = cartData.totalTax - deletedData.igst;
                }
                let updateCartData = await Cart.updateOne({_id:mongoose.mongo.ObjectID(cartData.id)},cartUpdateData);
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
                        "tax": { $first:"$tax" },
                        "cgst": { $first:"$cgst" },
                        "sgst": { $first:"$sgst" },
                        "igst": { $first:"$igst" },
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
	},
    
	getCheckoutData: async function(req,res) {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try {
            let data = {};
            data.billingAddress = {};
            data.shippingAddress = {};
            let userId = req.body.userId;
            let condition = {_id: mongoose.mongo.ObjectId(userId)};
            let userData = await Customer.findOne(condition);

            data.name = userData.name ? userData.name : '';
            data.address = userData.address ? userData.address : '';
            data.mobile = userData.mobile ? userData.mobile : '';
            data.gst = userData.gst ? userData.gst : '';
            data.sameAsBillingAddress = userData.sameAsBillingAddress ? userData.sameAsBillingAddress : false;

            data.billingAddress.address = userData.billingAddress.address ? userData.billingAddress.address : '';
            data.billingAddress.country = userData.billingAddress.country ? userData.billingAddress.country : '';
            await config.helpers.state.getNameById(userData.billingAddress.state, async function (stateName) {
                data.billingAddress.state = stateName.name ? stateName.name : '';
            })
            await config.helpers.city.getNameById(userData.billingAddress.city, async function (cityName) {
                data.billingAddress.city = cityName.name ? cityName.name : '';
            })
            await config.helpers.pincode.getNameById(userData.billingAddress.pincode, async function (pincode) {
                data.billingAddress.pincode = pincode.pincode ? pincode.pincode : '';
            })
            await config.helpers.area.getNameById(userData.billingAddress.area, async function (areaName) {
                data.billingAddress.area = areaName.name ? areaName.name : '';
            })
            await config.helpers.society.getNameById(userData.billingAddress.society, async function (societyName) {
                data.billingAddress.society = societyName.name ? societyName.name : '';
            })
            await config.helpers.tower.getNameById(userData.billingAddress.tower, async function (towerName) {
                data.billingAddress.tower = towerName.name ? towerName.name : '';
            })

            data.shippingAddress.address = userData.shippingAddress.address ? userData.shippingAddress.address : '';
            data.shippingAddress.country = userData.shippingAddress.country ? userData.shippingAddress.country : '';
            await config.helpers.state.getNameById(userData.shippingAddress.state, async function (stateName) {
                data.shippingAddress.state = stateName.name ? stateName.name : '';
            })
            await config.helpers.city.getNameById(userData.shippingAddress.city, async function (cityName) {
                data.shippingAddress.city = cityName.name ? cityName.name : '';
            })
            await config.helpers.pincode.getNameById(userData.shippingAddress.pincode, async function (pincode) {
                if(pincode.pincode)
                {
                    let shippingPrice = await Pincode.findOne({_id: mongoose.mongo.ObjectID(userData.shippingAddress.pincode)});
                    data.shippingPrice = shippingPrice.shippingCharges ? shippingPrice.shippingCharges : 0;
                }
                else
                {
                    data.shippingPrice = 0;
                }
                data.shippingAddress.pincode = pincode.pincode ? pincode.pincode : '';
            })
            await config.helpers.area.getNameById(userData.shippingAddress.area, async function (areaName) {
                data.shippingAddress.area = areaName.name ? areaName.name : '';
            })
            await config.helpers.society.getNameById(userData.shippingAddress.society, async function (societyName) {
                data.shippingAddress.society = societyName.name ? societyName.name : '';
            })
            await config.helpers.tower.getNameById(userData.shippingAddress.tower, async function (towerName) {
                data.shippingAddress.tower = towerName.name ? towerName.name : '';
            })
            
            let cartData = await Cart.findOne({userId: mongoose.mongo.ObjectId(userId)});
            data.grandTotal = cartData.grandTotal ? cartData.grandTotal : '';
            data.subTotal = cartData.grandTotal ? cartData.grandTotal - cartData.couponAmount: '';
            data.couponAmount = cartData.couponAmount ? cartData.couponAmount : '';
            data.totalTax = cartData.totalTax ? cartData.totalTax : '';
            data.tax = 0;
            if(data) {
                return res.status(200).json({ 
                    data: data, 
                    status: 'success', 
                    message: "checkout data found successfully!!" 
                });	
            }else {
                return res.status(400).json({ 
                    data: [], 
                    status: 'success', 
                    message: "checkout data not found!!" 
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