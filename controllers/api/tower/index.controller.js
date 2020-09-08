const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Tower = model.tower;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	
    // @route       GET api/v1/societiesList
    // @description Get all areaList
    // @access      Public
	towerListBySocietyId:async function(req,res){
        var societyId = req.body.societyId;
        if (societyId==null || societyId=='')
        {
            return res.status(200).json({ message: "Society Id  is Not Empty" });
        }
        var towerData = [];
        var towerData = await Tower.find({societyId:societyId, status:true, deletedAt: 0},{name:1,stateId:1,cityId:1,pincodeId:1,areaId:1,_id:1});
        
        if(towerData.length>0) {
            return res.status(200).json({ data: towerData, status: 'success', message: "Data fetched successfully!!",code:200 });
        } else {
            return res.status(200).json({ data: towerData, status: 'success', message: "Data No Found!!",code:200 });
        }
        
		
    },
    
    

	
}