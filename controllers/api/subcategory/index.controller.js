const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Subcategory = model.sub_category;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	
    // @route       GET api/v1/subcategories
    // @description Get all subcategories
    // @access      Public
	subCategories:async function(req,res){
        var subcategoryData = await Subcategory.find({status:true, deletedAt: 0},{sub_cat_name:1,slug:1,_id:1,cat_id:1}).sort( { sub_cat_name : 1} );
        // console.log(categoryData);
        // console.log(stringify(categoryData));return false;
        // var categoryData = {name:"chandan",email:"chandan@gmail.com"};
        return res.status(200).json({ data: subcategoryData, status: 'success', message: "Data fetched successfully!!",code:200 });
		
    },
    
    

	
}