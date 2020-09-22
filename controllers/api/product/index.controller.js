const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const mongoose = require('mongoose');
const Product     = model.product;
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
            const { filter, categoryId, maxPrice, minPrice, brandId, sortName, sortValue } = req.body;
            let pageno = req.body.pageno ? parseInt(req.body.pageno) : config.constant.PAGENO;
            let limit = config.constant.LIMIT;
            let skip = (pageno-1) * limit;
            let condition = {status:true, deletedAt: 0};
            if(parseInt(filter) == 1)
            {
                if(categoryId)
                {
                    condition.categoryId = mongoose.mongo.ObjectId(categoryId);
                }
                if(minPrice && maxPrice)
                {
                    condition.inventory = { price: { $gte: parseInt(minPrice),$lte: parseInt(maxPrice) } };
                }
                if(brandId)
                {
                    condition.brandId = mongoose.mongo.ObjectId(brandId);
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
                    $addFields: {
                        "thumbnailPath" : config.constant.THUMNAILPATH,
                        "smallPath" : config.constant.SMALLPATH,
                        "largePath" : config.constant.LARGEPATH
                    }
                },
                {
                    $project: { 
                        createdAt:0,
                        updatedAt:0
                    }
                }
            ]).sort(sort).skip(skip).limit(limit);
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
    productListByCatId:async function(req,res){
        var productData = [];
        var catId =  req.body.cat_id;
        var productData = await Product.find({cate_id:catId,status:true, deletedAt: 0},{}).sort( { name : 1} );
        if(productData.length>0) {
            return res.status(200).json({ data: productData, status: 'success', message: "Data fetched successfully!!" });
        } else {
            return res.status(200).json({ data: productData, status: 'success', message: "Data No Found!!" });
        }
        
    },
    productListBySubCatId: async function(req,res){
        var productData = [];
        var subcatId =  req.body.sub_catid;
        var productData = await Product.find({s_cate_id:subcatId,status:true, deletedAt: 0},{}).sort( { name : 1} );
        if(productData.length>0) {
            return res.status(200).json({ data: productData, status: 'success', message: "Data fetched successfully!!" });
        } else {
            return res.status(200).json({ data: productData, status: 'success', message: "Data No Found!!" });
        }
        
    },
    searchProduct : async function(req,res){
        var   productName  = req.body.productName;
        if (productName ==null || productName == '')
        {
            return res.status(400).json({ message: "Product Name is Not Empty" });
        }
        var productData = await Product.find({name:new RegExp(productName, 'i'),status:true, deletedAt: 0},{}).sort( { name : 1} );
        if(productData.length>0) {
            return res.status(200).json({ data: productData, status: 'success', message: "Data fetched successfully!!" });
        } else {
            return res.status(200).json({ data: productData, status: 'success', message: "Data No Found!!" });
        }
    }
    
    

	
}