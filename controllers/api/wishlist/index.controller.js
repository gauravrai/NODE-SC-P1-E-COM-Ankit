const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Wishlist = model.wishlist;
const { validationResult } = require('express-validator');

module.exports = {
    // @route       GET api/v1/addWishlist
    // @description User request for product
    // @access      Public
    addWishlist : async function(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let wishlistData = {
                userId : mongoose.mongo.ObjectId(req.body.userId),
                productId : mongoose.mongo.ObjectId(req.body.productId)
			};
			let wishlist = new Wishlist(wishlistData);
			wishlist.save(function(err, data){
				return res.status(200).json({ 
                    data: wishlistData, 
                    status: 'success', 
                    message: "Wishlist added successfully!!" 
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
    // @route       GET api/v1/getWishlistOfUser
    // @description Search product
    // @access      Public
    getWishlistOfUser : async function(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let pageno = req.query.pageno ? parseInt(req.query.pageno) : config.constant.PAGENO;
            let limit = config.constant.LIMIT;
            let skip = (pageno-1) * limit;
            var userId = req.query.userId;
            var wishlistData = await Wishlist.aggregate([ 
                {
                    $match : { userId: mongoose.mongo.ObjectID(req.query.userId), status: true, deletedAt: 0 }
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
                        updatedAt:0,
                        "productData.inventory":0
                    }
                }
            ]).skip(skip).limit(limit);
            if(wishlistData.length>0) {
                return res.status(200).json({ 
                                            data: wishlistData, 
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
    // @route       GET api/v1/removeWishlist
    // @description User request for product
    // @access      Public
    removeWishlist : async function(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
			Wishlist.deleteOne({ userId : mongoose.mongo.ObjectId(req.body.userId), productId : mongoose.mongo.ObjectId(req.body.productId) }, function(err, data){
				return res.status(200).json({ 
                    data: [], 
                    status: 'success', 
                    message: "Wishlist removed successfully!!" 
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