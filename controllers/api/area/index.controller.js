const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Area = model.area;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	
    // @route       GET api/v1/areaList
    // @description Get all areaList
    // @access      Public
	areaListByPincode:async function(req,res){
        var pincodeId = req.body.pincodeId;
        if (pincodeId==null || pincodeId=='')
        {
            return res.status(200).json({ message: "Pincode Id  is Not Empty" });
        }
        var areaData = [];
        var areaData = await Area.find({pincodeId:pincodeId,status:true, deletedAt: 0},{name:1,stateId:1,cityId:1,pincodeId:1,_id:1});
        
        if(areaData.length>0) {
            return res.status(200).json({ data: areaData, status: 'success', message: "Data fetched successfully!!",code:200 });
        } else {
            return res.status(200).json({ data: areaData, status: 'success', message: "Data No Found!!",code:200 });
        }
        
		
    },
    
    

	
}