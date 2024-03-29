const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const mongoose = require('mongoose');
const Product     = model.product;
const Wishlist     = model.wishlist;
const Requestproduct = model.request_product;
const Emailtemplate = model.email_template;
const { validationResult } = require('express-validator');
module.exports = {
	
    // @route       GET api/v1/product
    // @description Get all product
    // @access      Public
	productList:async function(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            const { filter, string, categoryId, subcategoryId, maxPrice, minPrice, brandId, featured, sortName, sortValue, userId } = req.query;
            let pageno = req.query.pageno ? parseInt(req.query.pageno) : config.constant.PAGENO;
            let limit = config.constant.LIMIT;
            let skip = (pageno-1) * limit;
            let condition = {status:true, deletedAt: 0};
            if(parseInt(filter) == 1)
            {
                if(string)
                {
                    // condition.name = new RegExp(string, 'i');
                    condition.$or = [ { name: new RegExp(string, 'i') }, { searchTag: new RegExp(string, 'i') } ];
                }
                if(categoryId)
                {
                    condition.categoryId = mongoose.mongo.ObjectId(categoryId);
                }
                if(subcategoryId)
                {
                    condition.subcategoryId = mongoose.mongo.ObjectId(subcategoryId);
                }
                if(minPrice && maxPrice)
                {
                    condition.price = { $gte: parseInt(minPrice),$lte: parseInt(maxPrice) };
                }
                if(brandId)
                {
                    let brandArr = brandId.split(',');
                    for (let i = 0; i < brandArr.length; i++) {
                        brandArr[i] = mongoose.mongo.ObjectId(brandArr[i]);
                        
                    }
                    condition.brandId = {$in: brandArr };
                }
                if(featured)
                {
                    condition.featured = featured == 1 ? true : false;
                }
            }
            let sort = {};
            if(sortName)
            {
                sort[sortName] = parseInt(sortValue);
            }else{
                sort = { name: 1 };
            }
            let productData = await Product.aggregate([ 
                {
                    $match : condition
                },
                {
                    $unwind: "$inventory"
                },
                {
                    $group: {
                        "_id":"$_id",
                        "inventory": { $first:"$inventory" },
                        "status": { $first:"$status" },
                        "deletedAt": { $first:"$deletedAt" },
                        "categoryId": { $first:"$categoryId" },
                        "subcategoryId": { $first:"$subcategoryId" },
                        "name": { $first:"$name" },
                        "brandId": { $first:"$brandId" },
                        "price": { $first:"$price" },
                        "offer": { $first:"$offer" },
                        "discount": { $first:"$discount" },
                        "stock": { $first:"$stock" },
                        "searchTag": { $first:"$searchTag" },
                        "description": { $first:"$description" },
                        "featured": { $first:"$featured" },
                        "outOfStock": { $first:"$outOfStock" },
                        "image": { $first:"$image" }
                    }
                },
                {
                    $addFields: {
                        "thumbnailPath" : config.constant.PRODUCTTHUMBNAILSHOWPATH,
                        "smallPath" : config.constant.PRODUCTSMALLSHOWPATH,
                        "largePath" : config.constant.PRODUCTLARGESHOWPATH,
                        "wishlist" : false
                    }
                },
                {
                    $project: { 
                        __v:0,
                        createdAt:0,
                        updatedAt:0
                    }
                }
            ]).sort(sort).skip(skip).limit(limit);
            if(productData.length>0) {
                if(userId) {
                    for (let i = 0; i < productData.length; i++) {
                    let wishlistData = await Wishlist.findOne({userId : mongoose.mongo.ObjectID(userId), productId: mongoose.mongo.ObjectID(productData[i]._id)});
                        let wishlist = false;
                        if(wishlistData)
                        {
                            wishlist = true;
                        }
                        productData[i].wishlist = wishlist;
                    }
                }
                return res.status(200).json({ 
                                            data: productData, 
                                            status: 'success', 
                                            message: "Data fetched successfully!!" 
                                        });
            } else {
                return res.status(400).json({ 
                                            data: [], 
                                            status: 'error', 
                                            message: "No Data Found!!" 
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

    // @route       GET api/v1/featuredProductList
    // @description Get all featured product
    // @access      Public
	featuredProductList:async function(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let condition = {featured: true, status:true, deletedAt: 0};
            
            let productData = await Product.aggregate([ 
                {
                    $match : condition
                },
                {
                    $unwind: "$inventory"
                },
                {
                    $group: {
                        "_id":"$_id",
                        "inventory": { $first:"$inventory" },
                        "status": { $first:"$status" },
                        "deletedAt": { $first:"$deletedAt" },
                        "categoryId": { $first:"$categoryId" },
                        "subcategoryId": { $first:"$subcategoryId" },
                        "name": { $first:"$name" },
                        "brandId": { $first:"$brandId" },
                        "price": { $first:"$price" },
                        "offer": { $first:"$offer" },
                        "discount": { $first:"$discount" },
                        "stock": { $first:"$stock" },
                        "description": { $first:"$description" },
                        "featured": { $first:"$featured" },
                        "outOfStock": { $first:"$outOfStock" },
                        "image": { $first:"$image" }
                    }
                },
                {
                    $addFields: {
                        "thumbnailPath" : config.constant.PRODUCTTHUMBNAILSHOWPATH,
                        "smallPath" : config.constant.PRODUCTSMALLSHOWPATH,
                        "largePath" : config.constant.PRODUCTLARGESHOWPATH,
                        "wishlist" : false
                    }
                },
                {
                    $project: { 
                        __v:0,
                        createdAt:0,
                        updatedAt:0
                    }
                }
            ]).sort({createdAt: 1});
            if(productData.length>0) {
                let userId = req.query.userId;
                if(userId) {
                    for (let i = 0; i < productData.length; i++) {
                    let wishlistData = await Wishlist.findOne({userId : mongoose.mongo.ObjectID(userId), productId: mongoose.mongo.ObjectID(productData[i]._id)});
                        let wishlist = false;
                        if(wishlistData)
                        {
                            wishlist = true;
                        }
                        productData[i].wishlist = wishlist;
                    }
                }
                return res.status(200).json({ 
                                            data: productData, 
                                            status: 'success', 
                                            message: "Data fetched successfully!!" 
                                        });
            } else {
                return res.status(400).json({ 
                                            data: [], 
                                            status: 'error', 
                                            message: "No Data Found!!" 
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

    // @route       GET api/v1/productDetail
    // @description Get all productDetail
    // @access      Public
	productDetail : async function(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            const { productId } = req.query;
            let condition = {status:true, deletedAt: 0};
            condition._id = mongoose.mongo.ObjectId(productId);
            let productData = await Product.aggregate([ 
                {
                    $match : condition
                },
                {
                    $addFields: {
                        "thumbnailPath" : config.constant.PRODUCTTHUMBNAILSHOWPATH,
                        "smallPath" : config.constant.PRODUCTSMALLSHOWPATH,
                        "largePath" : config.constant.PRODUCTLARGESHOWPATH
                    }
                },
                {
                    $project: { 
                        __v:0,
                        createdAt:0,
                        updatedAt:0
                    }
                },
                { 
                    $unwind : "$inventory"
                }
            ]);
            if(productData.length>0) {
                return res.status(200).json({ 
                                            data: productData[0], 
                                            status: 'success', 
                                            message: "Data fetched successfully!!" 
                                        });
            } else {
                return res.status(400).json({ 
                                            data: [], 
                                            status: 'error', 
                                            message: "No Data Found!!" 
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
    // @route       GET api/v1/searchproduct
    // @description Search product
    // @access      Public
    searchProduct : async function(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            var string = req.query.string;
            let condition = {status:true, deletedAt: 0};
            condition.$or = [ { name: new RegExp(string, 'i') }, { searchTag: new RegExp(string, 'i') } ];
            var productData = await Product.find(condition,{name:1}).sort( { name : 1} ).limit(10);
            if(productData.length>0) {
                return res.status(200).json({ 
                                            data: productData, 
                                            status: 'success', 
                                            message: "Data fetched successfully!!" 
                                        });
            } else {
                return res.status(400).json({ 
                                            data: [], 
                                            status: 'error', 
                                            message: "No Data Found!!" 
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
    // @route       GET api/v1/userRequestForProduct
    // @description User request for product
    // @access      Public
    userRequestForProduct : async function(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let userRequestData = {
				name : req.body.name,
				email : req.body.email,
				mobile : req.body.mobile,
				address : req.body.address,
				pincode : req.body.pincode,
				description : req.body.description,
            };
            if(req.body.productId){
                userRequestData.productId = mongoose.mongo.ObjectId(req.body.productId);
            }
            if(req.body.userId){
                userRequestData.userId = mongoose.mongo.ObjectId(req.body.userId);
            }
			let requestproduct = new Requestproduct(userRequestData);
			requestproduct.save(async function(err, data){
                let emailData = await Emailtemplate.findOne({slug: 'REQUEST-PRODUCT'});
                let subject = emailData.subject;
                let message = emailData.message;
                message = message.replace('[NAME]', req.body.name);
                await config.helpers.email.sendEmail(req.body.email, subject, message, async function (emailData) {
                    return res.status(200).json({ 
                        data: userRequestData, 
                        status: 'success', 
                        message: "Request for product send successfully!!" 
                    });	
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
    }
    
    

	
}