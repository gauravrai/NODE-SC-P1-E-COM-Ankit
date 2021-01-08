const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Messagetemplate = model.message_template;
const { validationResult } = require('express-validator')
const OTP = model.otp;
const Customer = model.customer;
const jwtSecret = config.constant.JWT_SECRET;

module.exports = {
    // @route       GET api/v1/addcustomer
    // @description Customer login and signup
    // @access      Public
    addCustomer:async function(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let mobile = req.body.mobile;
            let otp = Math.floor(1000 + Math.random() * 9000);

            let messageData = await Messagetemplate.findOne({slug: 'OTP-MESSAGE'});
            let slug = messageData.slug;
            let message = messageData.message;
            message = message.replace('[OTP]', otp);
            await config.helpers.sms.sendOTP(mobile, slug, message, async function (smsData) {
                let checkUser = await Customer.findOne({ mobile:mobile, status:true, deletedAt: 0 });
                if(checkUser) {
                    let otpData = {
                        otp  : otp
                    };
                    let updateCustomer = await Customer.updateOne( {mobile: mobile}, otpData );
                    let customerData = await Customer.findOne({mobile: mobile});
                    let returnData = {
                        profileUpdated: customerData.profileUpdated,                                
                    };
                    return res.status(200).json({ 
                            data: returnData, 
                            status: 'success', 
                            message: "Customer already exits. OTP send for customer login."
                        });                   
                } else {
                    let customerInsertData = {
                        mobile: mobile,
                        otp: otp
                    }
                    let customer = new Customer(customerInsertData);
                    customer.save();
                    let returnData = {
                        profileUpdated: false,                                
                    };
                    return res.status(200).json({ 
                            data: returnData, 
                            status: 'success', 
                            message: "Customer added successfully. OTP send for customer signin." 
                        });
                }
            });
        }
        catch (e){
            console.log(e)
            return res.status(500).json({ 
                status: 'error',
                errors: [{
                    msg: "Internal server error"
                }] 
            });
        }
          
    },

    // @route       GET api/v1/resendOtp
    // @description Resend OTP 
    // @access      Public
    resendOtp:async function(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let mobile = req.body.mobile;
            let otp = Math.floor(1000 + Math.random() * 9000);
            let otpcheck = await Customer.findOne({mobile:mobile, status:true, deletedAt: 0});
            if(otpcheck) {
                let otpData = {
                    otp  : otp
                };
                let updateOtp = await Customer.updateOne( {mobile: mobile}, otpData );
                
                let messageData = await Messagetemplate.findOne({slug: 'OTP-MESSAGE'});
                let slug = messageData.slug;
                let message = messageData.message;
                message = message.replace('[OTP]', otp);
                await config.helpers.sms.sendOTP(mobile, slug, message, async function (smsData) {
                    return res.status(200).json({ 
                                data: otpData, 
                                status: 'success', 
                                message: "OTP resend successfully."
                            });                   
                });         
            } else {
                    return res.status(400).json({
                                    data: {}, 
                                    status: 'error', 
                                    message: "Something went wrong. Can't send OTP."
                            });
            }
        }
        catch (e){
            console.log(e)
            return res.status(500).json({ 
                status: 'error',
                errors: [{
                    msg: "Internal server error"
                }] 
            });
        }
          
    },

    // @route       GET api/v1/checkcustomerotp
    // @description Customer validate otp and mobile exists 
    // @access      Public
    checkCustomerOtp: async function(req, res) {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let { mobile, otp } = req.body;
            let checkOtp = await Customer.findOne({ mobile, otp, status: true, deletedAt: 0 });
            if(checkOtp){
                if(typeof checkOtp.token != 'undefined' && checkOtp.token != '')
                { 
                    let payload = { mobile };
    
                    jwt.sign(payload, jwtSecret, {
                        expiresIn: 3600000
                    },async (error, token) => {
                        if(error) throw error
                        let data = {
                            token  : token
                        };
                        let updateCustomer = await Customer.updateOne( {mobile: mobile}, data );
                    });
                }
                let customerData = await Customer.findOne({mobile: mobile});
                return res.status(200).json({ 
                        data: customerData, 
                        status: 'success', 
                        message: "OTP verified successfully."
                    });
            }
            else{
                return res.status(400).json({ 
                        data: [],  
                        status: 'error', 
                        errors: [{
                            msg: "OTP doesn't match. Authentication failed."
                        }]
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

    customer: async function( req, res ) {
        const customercheck = await Customer.findOne({
                                        mobile: req.user.mobile,
                                        status: true, 
                                        deletedAt: 0
                                    })
                                    .select('-deletedAt');
        let message = "Data not found"
        if(customercheck) {
            message = "Customer data found"
        }
        return res.status(200).json({ 
                                data: customercheck, 
                                status: 'success', 
                                message
                            });
        
    },

    updateCustomer: async function( req, res ) {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try {
            let { mobile, sameAsBillingAddress, name, email, gst, billingAddress, billingCountry, billingState, billingCity, billingPincode, billingArea, billingSociety, billingTower, shippingAddress, shippingCountry, shippingState, shippingCity, shippingPincode, shippingArea, shippingSociety, shippingTower } = req.body;
            
            let billingAddressData = {
                address: billingAddress ? billingAddress : '',
                country: billingCountry ? billingCountry : '',
                state: billingState ? mongoose.mongo.ObjectId(billingState) : '',
                city: billingCity ? mongoose.mongo.ObjectId(billingCity) : '',
                pincode: billingPincode ? mongoose.mongo.ObjectId(billingPincode) : '',
                area: billingArea ? mongoose.mongo.ObjectId(billingArea) : '',
                society: billingSociety ? mongoose.mongo.ObjectId(billingSociety) : '',
                tower: billingTower ? mongoose.mongo.ObjectId(billingTower) : ''
            };
            
            // sameAsBillingAddress = parseInt(sameAsBillingAddress) ? true : false;
            let shippingAddressData = {};
            if(sameAsBillingAddress) {
                shippingAddressData = {
                    address: billingAddress ? billingAddress : '',
                    country: billingCountry ? billingCountry : '',
                    state: billingState ? mongoose.mongo.ObjectId(billingState) : '',
                    city: billingCity ? mongoose.mongo.ObjectId(billingCity) : '',
                    pincode: billingPincode ? mongoose.mongo.ObjectId(billingPincode) : '',
                    area: billingArea ? mongoose.mongo.ObjectId(billingArea) : '',
                    society: billingSociety ? mongoose.mongo.ObjectId(billingSociety) : '',
                    tower: billingTower ? mongoose.mongo.ObjectId(billingTower) : ''
                };
            }else {
                shippingAddressData = {
                    address: shippingAddress ? shippingAddress : '',
                    country: shippingCountry ? shippingCountry : '',
                    state: shippingState ? mongoose.mongo.ObjectId(shippingState) : '',
                    city: shippingCity ? mongoose.mongo.ObjectId(shippingCity) : '',
                    pincode: shippingPincode ? mongoose.mongo.ObjectId(shippingPincode) : '',
                    area: shippingArea ? mongoose.mongo.ObjectId(shippingArea) : '',
                    society: shippingSociety ? mongoose.mongo.ObjectId(shippingSociety) : '',
                    tower: shippingTower ? mongoose.mongo.ObjectId(shippingTower) : ''
                };
            }
            
            let CustomerData = {
                name : name,
                email : email,
                gst : gst && typeof gst != 'undefined' ? gst : '',
                sameAsBillingAddress: sameAsBillingAddress ? sameAsBillingAddress : false,
                billingAddress : billingAddressData,
                shippingAddress : shippingAddressData
            };
        
            let customer = await Customer.findOne({ mobile: mobile });
            
            if(!customer){
                //insert new customer profile
                let customerPObj = await new Customer({
                                            name : name,
                                            email : email,
                                            mobile : mobile,
                                            gst : gst && typeof gst != 'undefined' ? gst : '',
                                            sameAsBillingAddress: sameAsBillingAddress ? sameAsBillingAddress : false,
                                            billingAddress : billingAddressData,
                                            shippingAddress : shippingAddressData
                                        });
                customerPObj.save();
                return res.status(200).json({
                                data: customerPObj,
                                status: 'success', 
                                message: "Customer profile added successfully!!"
                            });
            }
            else{
                //update the customer profile
                await Customer.updateOne({ mobile: mobile }, CustomerData, async function( err, data ){
                    if(err) console.log(err)
                    data = await Customer.findOne({ mobile: mobile });
                    return res.status(200).json({
                                data: data,
                                status: 'success', 
                                message: "Customer profile updated successfully!!"
                            }); 
                })
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

	updateAddress: async function(req,res) {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let { userId, sameAsBillingAddress, billingAddress, billingCountry, billingState, billingCity, billingPincode, billingArea, billingSociety, billingTower, shippingAddress, shippingCountry, shippingState, shippingCity, shippingPincode, shippingArea, shippingSociety, shippingTower } = req.body;
            let billingAddressData = {
                address: billingAddress ? billingAddress : '',
                country: billingCountry ? billingCountry : '',
                state: billingState ? mongoose.mongo.ObjectId(billingState) : '',
                city: billingCity ? mongoose.mongo.ObjectId(billingCity) : '',
                pincode: billingPincode ? mongoose.mongo.ObjectId(billingPincode) : '',
                area: billingArea ? mongoose.mongo.ObjectId(billingArea) : '',
                society: billingSociety ? mongoose.mongo.ObjectId(billingSociety) : '',
                tower: billingTower ? mongoose.mongo.ObjectId(billingTower) : ''
            };
            
            let shippingAddressData = {};
            if(sameAsBillingAddress) {
                shippingAddressData = {
                    address: billingAddress ? billingAddress : '',
                    country: billingCountry ? billingCountry : '',
                    state: billingState ? mongoose.mongo.ObjectId(billingState) : '',
                    city: billingCity ? mongoose.mongo.ObjectId(billingCity) : '',
                    pincode: billingPincode ? mongoose.mongo.ObjectId(billingPincode) : '',
                    area: billingArea ? mongoose.mongo.ObjectId(billingArea) : '',
                    society: billingSociety ? mongoose.mongo.ObjectId(billingSociety) : '',
                    tower: billingTower ? mongoose.mongo.ObjectId(billingTower) : ''
                };
            }else {
                shippingAddressData = {
                    address: shippingAddress ? shippingAddress : '',
                    country: shippingCountry ? shippingCountry : '',
                    state: shippingState ? mongoose.mongo.ObjectId(shippingState) : '',
                    city: shippingCity ? mongoose.mongo.ObjectId(shippingCity) : '',
                    pincode: shippingPincode ? mongoose.mongo.ObjectId(shippingPincode) : '',
                    area: shippingArea ? mongoose.mongo.ObjectId(shippingArea) : '',
                    society: shippingSociety ? mongoose.mongo.ObjectId(shippingSociety) : '',
                    tower: shippingTower ? mongoose.mongo.ObjectId(shippingTower) : ''
                };
            }

            let userData = {
                sameAsBillingAddress: sameAsBillingAddress,
                billingAddress : billingAddressData,
                shippingAddress : shippingAddressData
            };
            let updateUserData = await Customer.update({_id:mongoose.mongo.ObjectID(userId)},userData);
            return res.status(200).json({ 
                data: userData, 
                status: 'success', 
                message: "Customer Address been updated successfully!!" 
            });	
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
    
	getUserData: async function(req,res) {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let userId = req.body.userId;
            let condition = {_id: mongoose.mongo.ObjectId(userId)};
            let userData = await Customer.findOne(condition);
            await config.helpers.state.getNameById(userData.billingAddress.state, async function (stateName) {
                userData.billingAddress.stateName = stateName.name ? stateName.name : '';
            })
            await config.helpers.city.getNameById(userData.billingAddress.city, async function (cityName) {
                userData.billingAddress.cityName = cityName.name ? cityName.name : '';
            })
            await config.helpers.pincode.getNameById(userData.billingAddress.pincode, async function (pincode) {
                userData.billingAddress.pincodeName = pincode.pincode ? pincode.pincode : '';
            })
            await config.helpers.area.getNameById(userData.billingAddress.area, async function (areaName) {
                userData.billingAddress.areaName = areaName.name ? areaName.name : '';
            })
            await config.helpers.society.getNameById(userData.billingAddress.society, async function (societyName) {
                userData.billingAddress.societyName = societyName.name ? societyName.name : '';
            })
            await config.helpers.tower.getNameById(userData.billingAddress.tower, async function (towerName) {
                userData.billingAddress.towerName = towerName.name ? towerName.name : '';
            })

            await config.helpers.state.getNameById(userData.shippingAddress.state, async function (stateName) {
                userData.shippingAddress.stateName = stateName.name ? stateName.name : '';
            })
            await config.helpers.city.getNameById(userData.shippingAddress.city, async function (cityName) {
                userData.shippingAddress.cityName = cityName.name ? cityName.name : '';
            })
            await config.helpers.pincode.getNameById(userData.shippingAddress.pincode, async function (pincode) {
                userData.shippingAddress.pincodeName = pincode.pincode ? pincode.pincode : '';
            })
            await config.helpers.area.getNameById(userData.shippingAddress.area, async function (areaName) {
                userData.shippingAddress.areaName = areaName.name ? areaName.name : '';
            })
            await config.helpers.society.getNameById(userData.shippingAddress.society, async function (societyName) {
                userData.shippingAddress.societyName = societyName.name ? societyName.name : '';
            })
            await config.helpers.tower.getNameById(userData.shippingAddress.tower, async function (towerName) {
                userData.shippingAddress.towerName = towerName.name ? towerName.name : '';
            })
            if(userData) {
                return res.status(200).json({ 
                    data: userData, 
                    status: 'success', 
                    message: "User data found successfully!!" 
                });	
            }else {
                return res.status(400).json({ 
                    data: [], 
                    status: 'success', 
                    message: "User data not found!!" 
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
	}
	
}