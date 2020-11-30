const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Messagetemplate = model.message_template;
const { validationResult } = require('express-validator')

//models import
const OTP     = model.otp;
const Customer     = model.customer;
const jwtSecret = config.constant.JWT_SECRET;
var http = require('http'),
    url = require('url');

module.exports = {
    // @route       GET api/v1/addcustomer
    // @description Customer login page check mobile number exists in otps collection, if yes update with new otp, if not intert mobile and new otp 
    // @access      Public
    addCustomer:async function(req,res){
        var mobile_number = req.body.mobile;
        const otp = Math.floor(1000 + Math.random() * 9000);

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        try{
            
            let messageData = await Messagetemplate.findOne({slug: 'OTP-MESSAGE'});
            let slug = messageData.slug;
            let message = messageData.message;
            message = message.replace('[OTP]', otp);
            await config.helpers.sms.sendOTP(mobile_number, slug, message, async function (smsData) {
                const otpcheck = await OTP.findOne({mobile:mobile_number, status:true, deletedAt: 0});
                if(otpcheck) {
                    let otpData = {
                            otp  : otp
                    };
                    const numberInOtp = await OTP.updateOne(
                                                    {mobile: mobile_number},
                                                    {
                                                        $set: {
                                                            otp: otp
                                                        }
                                                    }
                                                )
                    
                    const getCustomer = await Customer.findOne({
                                                    mobile: mobile_number
                                                })
                    let profileUpdated = false
                    
                    if(getCustomer)
                        profileUpdated = true

                    const returnData = {
                                profileUpdated,                                
                            }
                    return res.status(200).json({ 
                                data: returnData, 
                                status: 'success', 
                                message: "Customer OTP and mobile number verified"
                            });                   
                } else {
                        const otpObj = new OTP({
                                                "mobile": mobile_number,
                                                otp
                                            });
                        otpObj.save()
                        return res.status(200).json({
                                        data: {
                                        profileUpdated: false
                                        }, 
                                        status: 'success', 
                                        message: "Customer added successfully"
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
        var mobile_number = req.body.mobile;
        const otp = Math.floor(1000 + Math.random() * 9000);

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        try{
            let otpcheck = await OTP.findOne({mobile:mobile_number, status:true, deletedAt: 0});
            if(otpcheck) {
                let otpData = {
                    otp  : otp
                };
                let updateOtp = await OTP.updateOne( {mobile: mobile_number}, otpData );
                
                let messageData = await Messagetemplate.findOne({slug: 'OTP-MESSAGE'});
                let slug = messageData.slug;
                let message = messageData.message;
                message = message.replace('[OTP]', otp);
                await config.helpers.sms.sendOTP(mobile_number, slug, message, async function (smsData) {
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

        const { mobile, otp } = req.body
        
        try{
            const customerCheck = await OTP.findOne({
                                            mobile,
                                            otp,
                                            status: true, 
                                            deletedAt: 0
                                        });
            
            if(customerCheck){
                const customer = await Customer.findOne({
                                                mobile,
                                                status: true, 
                                                deletedAt: 0
                                            });
                let profileUpdated = false
                if(customer)
                    profileUpdated = true

                const payload = {
                        mobile
                    }

                jwt.sign(payload, jwtSecret, {
                    expiresIn: 3600000
                }, (error, token) => {
                    if(error) throw error

                    return res.status(200).json({ 
                            data: {
                                customer,
                                profileUpdated,
                                token 
                            }, 
                            status: 'success', 
                            message: "Customer verification successfull!!"
                        });
                })
            }
            else{
               return res.status(400).json({ 
                                data: [],  
                                status: 'error', 
                                errors: [{
                                    msg: "Authentication failed"
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
        
        sameAsBillingAddress = parseInt(sameAsBillingAddress) ? true : false;
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
            gst : gst,
            sameAsBillingAddress: sameAsBillingAddress,
            billingAddress : billingAddressData,
            shippingAddress : shippingAddressData
        };
        try {
            let customer = await Customer.findOne({ mobile: mobile });
            
            if(!customer){
                //insert new customer profile
                let customerPObj = await new Customer({
                                            name,
                                            "mobile": mobile,
                                            email,
                                            gst,
                                            sameAsBillingAddress: sameAsBillingAddress,
                                            billingAddress : billingAddressData,
                                            shippingAddress : shippingAddressData
                                        });
                customerPObj.save()
                return res.status(200).json({
                                data: customerPObj,
                                status: 'success', 
                                message: "Customer profile added successfully!!"
                            });
            }
            else{
                //update the customer profile
                await Customer.updateOne({ mobile: mobile }, CustomerData, function( err, data ){
                    if(err) console.log(err)
                    return res.status(200).json({
                                data: CustomerData,
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
            
            sameAsBillingAddress = parseInt(sameAsBillingAddress) ? true : false;
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
            let data = {};
            data.billingAddress = {};
            data.shippingAddress = {};
            let userId = req.body.userId;
            let condition = {_id: mongoose.mongo.ObjectId(userId)};
            let userData = await Customer.findOne(condition);
            data.name = userData.name ? userData.name : '';
            data.email = userData.email ? userData.email : '';
            data.mobile = userData.mobile ? userData.mobile : '';
            data.gst = userData.gst ? userData.gst : '';
            data.sameAsBillingAddress = userData.sameAsBillingAddress ? userData.sameAsBillingAddress : '';

            data.billingAddress.address = userData.billingAddress.address ? userData.billingAddress.address : '';
            data.billingAddress.country = userData.billingAddress.country ? userData.billingAddress.country : '';
            await config.helpers.state.getNameById(userData.billingAddress.state, async function (stateName) {
                data.billingAddress.state = stateName.name ? stateName.name : '';
            })
            await config.helpers.city.getNameById(userData.billingAddress.city, async function (cityName) {
                data.billingAddress.city = cityName.name ? cityName.name : '';
            })
            await config.helpers.pincode.getNameById(userData.billingAddress.pincode, async function (pincode) {
                data.billingAddress.pincode = pincode.pincode ? pincode.name : '';
            })
            await config.helpers.area.getNameById(userData.billingAddress.area, async function (areaName) {
                data.billingAddress.area = areaName.name ? areaName.name : '';
            })
            await config.helpers.society.getNameById(userData.billingAddress.society, async function (societyName) {
                data.billingAddress.society = societyName.name ? societyName.name : '';
            })
            await config.helpers.tower.getNameById(userData.billingAddress.tower, async function (towerName) {
                data.billingAddress.tower = towerName.name ? towerName.name : '';
            })

            data.shippingAddress.address = userData.shippingAddress.address ? userData.shippingAddress.address : '';
            data.shippingAddress.country = userData.shippingAddress.country ? userData.shippingAddress.country : '';
            await config.helpers.state.getNameById(userData.shippingAddress.state, async function (stateName) {
                data.shippingAddress.state = stateName.name ? stateName.name : '';
            })
            await config.helpers.city.getNameById(userData.shippingAddress.city, async function (cityName) {
                data.shippingAddress.city = cityName.name ? cityName.name : '';
            })
            await config.helpers.pincode.getNameById(userData.shippingAddress.pincode, async function (pincode) {
                data.shippingAddress.pincode = pincode.pincode ? pincode.name : '';
            })
            await config.helpers.area.getNameById(userData.shippingAddress.area, async function (areaName) {
                data.shippingAddress.area = areaName.name ? areaName.name : '';
            })
            await config.helpers.society.getNameById(userData.shippingAddress.society, async function (societyName) {
                data.shippingAddress.society = societyName.name ? societyName.name : '';
            })
            await config.helpers.tower.getNameById(userData.shippingAddress.tower, async function (towerName) {
                data.shippingAddress.tower = towerName.name ? towerName.name : '';
            })
            if(data) {
                return res.status(200).json({ 
                    data: data, 
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