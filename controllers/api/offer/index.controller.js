const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Offer = model.offer;
const Product = model.product;
const Category = model.category;
const Subcategory = model.sub_category;
const { validationResult } = require('express-validator');

module.exports = {

	getOffer: async function(req,res) {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let requestFrom = req.query.requestFrom;
            let offerData = await Offer.find( {deletedAt:0,status:true,from: { '$lte': new Date() },to: { '$gte':  new Date()}, $or : [
                { 
                    applyFor : "both"
                },
                { 
                    applyFor: requestFrom
                }
            ]}, {name: 1, from: 1, to: 1, bannerImage: 1 });
            if(offerData.length > 0)
            {
                return res.status(200).json({ 
                    data: offerData, 
                    status: 'success', 
                    message: "Offer data found successfully!!" 
                });	
            }else
            {
                return res.status(400).json({ 
                    data: [], 
                    status: 'success', 
                    message: "No Offer Data Found!!" 
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
    
    getOfferDetail: async function(req,res) {
        
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let offerId = req.query.offerId;
            let offerData = await Offer.aggregate([ 
                {
                    $match : {_id: mongoose.mongo.ObjectId(offerId), deletedAt:0,status:true,from: { '$lte': new Date() },to: { '$gte':  new Date()}}
                },
                {
                    $unwind: "$offerProductId"
                },
                {
                    $lookup:
                      {
                        from: "products",
                        localField: "offerProductId",
                        foreignField: "_id",
                        as: "productData"
                      }
                },
                {
                    $addFields: {
                        "path" : config.constant.OFFERBANNERSHOWPATH
                    }
                },
            ]);
            if(offerData)
            {
                return res.status(200).json({ 
                    data: offerData, 
                    status: 'success', 
                    message: "Offer data found successfully!!" 
                });	
            }else
            {
                return res.status(400).json({ 
                    data: [], 
                    status: 'success', 
                    message: "No Offer Data Found!!" 
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