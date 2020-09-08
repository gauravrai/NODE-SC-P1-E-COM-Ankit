const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Pincode = model.pincode;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	
    // @route       GET api/v1/pincodeList
    // @description Get all pincodeList
    // @access      Public
	pincodeListByCity:async function(req,res){
        var cityId = req.body.cityId;
        if (cityId==null || cityId=='')
        {
            return res.status(200).json({ message: "City Id  is Not Empty" });
        }
        var pincodeData = [];
        var pincodeData = await Pincode.find({cityId:cityId,status:true, deletedAt: 0},{pincode:1,stateId:1,cityId:1,_id:1});
        
        if(pincodeData.length>0) {
            return res.status(200).json({ data: pincodeData, status: 'success', message: "Data fetched successfully!!",code:200 });
        } else {
            return res.status(200).json({ data: pincodeData, status: 'success', message: "Data No Found!!",code:200 });
        }
        
		
    },
    
    

	
}