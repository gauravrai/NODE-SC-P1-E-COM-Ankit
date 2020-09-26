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
            const { filter, string, categoryId, subcategoryId, maxPrice, minPrice, brandId, featured, sortName, sortValue } = req.query;
            let pageno = req.query.pageno ? parseInt(req.query.pageno) : config.constant.PAGENO;
            let limit = config.constant.LIMIT;
            let skip = (pageno-1) * limit;
            let condition = {status:true, deletedAt: 0};
            if(parseInt(filter) == 1)
            {
                if(string)
                {
                    condition.name = new RegExp(string, 'i');
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
                    condition.inventory = { price: { $gte: parseInt(minPrice),$lte: parseInt(maxPrice) } };
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
                    $addFields: {
                        "thumbnailPath" : config.constant.PRODUCTTHUMNAILPATH,
                        "smallPath" : config.constant.PRODUCTSMALLPATH,
                        "largePath" : config.constant.PRODUCTLARGEPATH
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
            var productData = await Product.find({name:new RegExp(string, 'i'),status:true, deletedAt: 0},{name:1}).sort( { name : 1} ).limit(10);
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
			let brand = new Brand(userRequestData);
			brand.save(function(err, data){
				return res.status(200).json({ 
                    data: productData, 
                    status: 'success', 
                    message: "Request send successfully!!" 
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
    
    

	
}