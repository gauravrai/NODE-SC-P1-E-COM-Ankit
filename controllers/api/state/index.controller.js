const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const State = model.state;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	
    // @route       GET api/v1/stateList
    // @description Get all stateList
    // @access      Public
	stateList:async function(req,res){
        var stateData = [];
        var stateData = await State.find({status:true, deletedAt: 0},{name:1,_id:1}).sort( { name : 1} );
        
        if(stateData.length>0) {
            return res.status(200).json({ data: stateData, status: 'success', message: "Data fetched successfully!!",code:200 });
        } else {
            return res.status(200).json({ data: stateData, status: 'success', message: "Data No Found!!",code:200 });
        }
        
		
    },
    
    

	
}