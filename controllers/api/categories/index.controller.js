const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Category = model.category;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	
    // @route       GET api/v1/category
    // @description Get all categories
    // @access      Public
	categories:async function(req,res){
        var categoryData = await Category.find({status:true, deletedAt: 0},{name:1,slug:1,_id:1}).sort( { name : 1} );
        // console.log(categoryData);
        // console.log(stringify(categoryData));return false;
        // var categoryData = {name:"chandan",email:"chandan@gmail.com"};
        if(categoryData.length>0) {
            return res.status(200).json({ data: categoryData, status: 'success', message: "Data fetched successfully!!",code:200 });
        } else {
            return res.status(200).json({ data: categoryData, status: 'success', message: "Data No Found!!",code:200 });
        }
        
		
    },
    
    

	
}