const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const City = model.city;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	
    // @route       GET api/v1/citeList
    // @description Get all citeList
    // @access      Public
	citeListByState:async function(req,res){
        var stateId = req.body.stateId;
        if (stateId ==null || stateId == '')
        {
            return res.status(200).json({ message: "State Id  is Not Empty" });
        }
        var cityData = [];
        var cityData = await City.find({stateId:stateId,status:true, deletedAt: 0},{name:1,stateId:1,_id:1}).sort( { name : 1} );
        
        if(cityData.length>0) {
            return res.status(200).json({ data: cityData, status: 'success', message: "Data fetched successfully!!",code:200 });
        } else {
            return res.status(200).json({ data: cityData, status: 'success', message: "Data No Found!!",code:200 });
        }
        
		
    },
    
    

	
}