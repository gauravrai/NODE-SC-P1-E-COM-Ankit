const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const mongoose = require('mongoose');
const moment = require('moment');
const Cart = model.cart;
const Cartitem = model.cart_item;
const Customer = model.customer;
const { validationResult } = require('express-validator');

module.exports = {
    // @route       GET api/v1/placeOrder
    // @description Place order
    // @access      Public
    placeOrder : async function(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let userId = req.body.userId;
            let cartId = req.body.cartId;
            let paymentType = req.body.paymentType;
            let orderFrom = req.body.orderFrom;
            // return res.status(200).json({ 
            //     data: [], 
            //     status: 'success', 
            //     message: "Cart has been added successfully!!" 
            // });	
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