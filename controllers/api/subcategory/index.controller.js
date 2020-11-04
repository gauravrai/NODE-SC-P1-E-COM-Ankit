const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Subcategory = model.sub_category;
const ADMINCALLURL = config.constant.ADMINCALLURL;
const { validationResult } = require('express-validator');

module.exports = {
	
    // @route       GET api/v1/subcategories
    // @description Get all subcategories
    // @access      Public
	subCategories:async function(req,res){
        var subcategoryData = await await Subcategory.aggregate([ 
            {
                $match : {status:true, deletedAt: 0}
            },
            {
                $addFields: {
                    "thumbnailPath" : config.constant.SUBCATEGORYTHUMBNAILSHOWPATH,
                    "smallPath" : config.constant.SUBCATEGORYSMALLSHOWPATH,
                    "largePath" : config.constant.SUBCATEGORYLARGESHOWPATH
                }
            },
            {
                $project: { 
                    __v:0,
                    createdAt:0,
                    updatedAt:0
                    // reportedBy: { $arrayElemAt: ['$inventory', 0] } ,
                }
            }
        ]).sort( { name : 1} );
        // console.log(categoryData);
        // console.log(stringify(categoryData));return false;
        // var categoryData = {name:"chandan",email:"chandan@gmail.com"};
        if(subcategoryData.length>0) {
            return res.status(200).json({ data: subcategoryData, status: 'success', message: "Data fetched successfully!!"});
        } else {
            return res.status(200).json({ data: subcategoryData, status: 'success', message: "Data No Found!!"}); 
        }
        
		
    },
    // @route       GET api/v1/subcategories
    // @description Get all subcategories By Category Id
    // @access      Public
    subCategoriesByCatId:async function(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            var catId =  req.body.cat_id;
            
            let subcategoryData = await Subcategory.aggregate([ 
                {
                    $match : {categoryId:mongoose.mongo.ObjectId(catId),status:true, deletedAt: 0}
                },
                {
                    $addFields: {
                        "thumbnailPath" : config.constant.SUBCATEGORYTHUMBNAILSHOWPATH,
                        "smallPath" : config.constant.SUBCATEGORYSMALLSHOWPATH,
                        "largePath" : config.constant.SUBCATEGORYLARGESHOWPATH
                    }
                },
                {
                    $project: { 
                        __v:0,
                        createdAt:0,
                        updatedAt:0
                    }
                }
            ]).sort( { name : 1} );
            if(subcategoryData.length>0) {
                return res.status(200).json({ 
                                            data: subcategoryData, 
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
    
    

	
}