const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Brand = model.brand;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	
    // @route       GET api/v1/areaList
    // @description Get all areaList
    // @access      Public
	brandList:async function(req,res){
        
        var brandData = [];
        var brandData = await Brand.find({status:true, deletedAt: 0},{name:1,_id:1});
        
        if(brandData.length>0) {
            return res.status(200).json({ data: brandData, status: 'success', message: "Data fetched successfully!!",code:200 });
        } else {
            return res.status(200).json({ data: brandData, status: 'success', message: "Data No Found!!",code:200 });
        }
        
		
    },
    
    

	
}