const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Wishlist = model.wishlist;

module.exports = {
    // add wishlist 
    addwishlist:async function(req,res){
        var productId = req.body.productId;
        var userId = req.body.userId;

        if (productId ==null || productId == '')
        {
            return res.status(400).json({ message: "Product Id is Not Empty" });
        } 
        if (userId ==null || userId == '')
        {
            return res.status(400).json({ message: "User ID is Not Empty" });
        } 

        let wishlistData = {
            productId : productId,
            userId  : userId
        };
        let wishlist = new Wishlist(wishlistData);
        wishlist.save(function(err, data){
            if(err){console.log(err)}
            
            return res.status(200).json({ data:data, status: 'success', message: "Wishlist  Add successfully!!"});
        })      
    },
}