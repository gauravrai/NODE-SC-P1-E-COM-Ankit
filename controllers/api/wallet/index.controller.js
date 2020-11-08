const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Wallet = model.wallet;
const Walletentry = model.wallet_entry;
const { validationResult } = require('express-validator');

module.exports = {
    // @route       GET api/v1/getWalletData
    // @description Search product
    // @access      Public
    getWalletData : async function(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let condition = { userId:  mongoose.mongo.ObjectId(req.body.userId)};
            let data = {};
            let walletData = await Wallet.findOne(condition);
            if(walletData) {
                data.walletData = walletData;
                let walletEntryData = await Walletentry.find(condition);
                data.walletEntryData = walletEntryData;
                return res.status(200).json({ 
                                            data: data, 
                                            status: 'success', 
                                            message: "Data fetched successfully!!" 
                                        });
            } else {
                return res.status(400).json({ 
                                            data: [], 
                                            status: 'error', 
                                            message: "No Data Found!!" 
                                        });
            }
        }
        catch (e){
            console.log(e)
            return res.status(500).json({ 
                                    data: [],  
                                    status: 'error', 
                                    errors: [{
                                        msg: "Internal server error"
                                    }]
                                });
        }
    },
}