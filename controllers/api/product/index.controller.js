const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Subcategory = model.sub_category;
const Product     = model.product;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	
    // @route       GET api/v1/product
    // @description Get all product
    // @access      Public
	productList:async function(req,res){
        var productData = [];
        var productData = await Product.find({status:true, deletedAt: 0},{}).sort( { name : 1} );
        // console.log(categoryData);
        // console.log(stringify(categoryData));return false;
        // var categoryData = {name:"chandan",email:"chandan@gmail.com"};
        if(productData.length>0) {
            return res.status(200).json({ data: productData, status: 'success', message: "Data fetched successfully!!" });
        } else {
            return res.status(200).json({ data: productData, status: 'success', message: "Data No Found!!" });
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
        
    }
    
    

	
}