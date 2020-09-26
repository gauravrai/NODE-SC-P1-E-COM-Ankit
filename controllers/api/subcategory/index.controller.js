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
        var subcategoryData = await await Subcategory.aggregate([ 
            {
                $match : {status:true, deletedAt: 0}
            },
            {
                $addFields: {
                    "thumbnailPath" : config.constant.SUBCATEGORYTHUMNAILPATH,
                    "smallPath" : config.constant.SUBCATEGORYSMALLPATH,
                    "largePath" : config.constant.SUBCATEGORYLARGEPATH
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
        
        var catId =  req.body.cat_id;
        var subcategoryDataByCat = [];
        if(catId){
            var subcategoryDataByCat = await Subcategory.find({categoryId:catId,status:true, deletedAt: 0},{name:1,slug:1,_id:1,categoryId:1}).sort( { name : 1} );
            if(subcategoryDataByCat.length > 0) {
                return res.status(200).json({ data: subcategoryDataByCat, status: 'success', message: "Data fetched successfully!!"});
            } else {
                return res.status(200).json({ data: subcategoryDataByCat, status: 'success', message: "No Data Found!!"});
            }
        } else {
            return res.status(200).json({ data: subcategoryDataByCat, status: 'success', message: "Please send category Id!!"}); 
        }return false;
        
    },
    
    

	
}