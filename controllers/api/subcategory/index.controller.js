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
        return res.status(200).json({ data: subcategoryData, status: 'success', message: "Data fetched successfully!!"});
		
    },
    // @route       GET api/v1/subcategories
    // @description Get all subcategories By Category Id
    // @access      Public
    subCategoriesByCatId:async function(req,res){
        
        var catId =  req.body.cat_id;
        if(catId){
            var subcategoryDataByCat = await Subcategory.find({cat_id:catId,status:true, deletedAt: 0},{sub_cat_name:1,slug:1,_id:1,cat_id:1}).sort( { sub_cat_name : 1} );
            if(subcategoryDataByCat.length > 0) {
                return res.status(200).json({ data: subcategoryDataByCat, status: 'success', message: "Data fetched successfully!!"});
            } else {
                return res.status(200).json({ status: 'success', message: "No Data Found!!"});
            }
        } else {
            return res.status(200).json({status: 'success', message: "Please send category Id!!"}); 
        }return false;
        
    },
    
    

	
}