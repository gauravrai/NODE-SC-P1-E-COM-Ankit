const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Society = model.society;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	
    // @route       GET api/v1/societiesList
    // @description Get all areaList
    // @access      Public
	societiesListByAreaId:async function(req,res){
        var areaId = req.body.areaId;
        if (areaId==null || areaId=='')
        {
            return res.status(200).json({ message: "Area Id Id  is Not Empty" });
        }
        var societiesData = [];
        var societiesData = await Society.find({areaId:areaId, status:true, deletedAt: 0},{name:1,stateId:1,cityId:1,pincodeId:1,areaId:1,_id:1});
        
        if(societiesData.length>0) {
            return res.status(200).json({ data: societiesData, status: 'success', message: "Data fetched successfully!!",code:200 });
        } else {
            return res.status(200).json({ data: societiesData, status: 'success', message: "Data No Found!!",code:200 });
        }
        
		
    },
    
    

	
}