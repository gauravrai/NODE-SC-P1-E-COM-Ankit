const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const jwt = require("jsonwebtoken");

//models import
const OTP     = model.otp;
const CustomerProfile     = model.customer;

const jwtSecret = config.constant.JWT_SECRET;
var http = require('http'),
    url = require('url');

module.exports = {
	
    // @route       GET api/v1/product
    // @description Get all product
    // @access      Public
	productList:async function(req,res){
        var productData = await Product.find({status:true, deletedAt: 0},{}).sort( { name : 1} );
        return res.status(200).json({ data: productData, status: 'success', message: "Data fetched successfully!!" });
		
    },

    // @route       GET api/v1/addcustomer
    // @description Customer login page check mobile number exists in otps collection, if yes update with new otp, if not intert mobile and new otp 
    // @access      Public
    addCustomer:async function(req,res){
        var mobile_number = req.body.mobile;
        const otp = Math.floor(1000 + Math.random() * 9000);
        var phoneRegex = /^(0|[+91]{3})?[7-9][0-9]{9}$/;
        
        if (mobile_number ==null || mobile_number == '')
        {
            return res.status(400).json({ message: "Mobile cannot be empty" });
        }

        if(mobile_number.match(phoneRegex)){
            
            try{
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
                    
                    const getCustomerProfile = CustomerProfile.findOne({
                        mobile: mobile_number
                    })
                    let registration = true

                    if(getCustomerProfile)
                        registration = false

                    const returnData = {
                                registration,                                
                            }
                    return res.status(200).json({ data: returnData, status: 'success', message: "Customer OTP and mobile number verified"});                   
                } else {
                        const otpObj = new OTP({
                                                "mobile": mobile_number,
                                                otp
                                            });
                        otpObj.save()
                        return res.status(200).json({
                                     data: {
                                        registration: true
                                     }, 
                                     status: 'success', 
                                     message: "Customer added successfully"
                                });
                }
            }
            catch (e){
                console.log(e)
                return res.status(500).json({ message: 'Internal server error' });
            }
            
        } else {

            return res.status(400).json({ message: "Invaild Mobile Number" });
        }
          
    },
    // @route       GET api/v1/checkcustomerotp
    // @description Customer validate otp and mobile exists 
    // @access      Public
    checkCustomerOtp: async function(req, res) {
        const mobileNumber = req.body.mobile;
        const otp           = req.body.otp;
        if (mobileNumber ==null || mobileNumber == ''){
            return res.status(400).json({ message: "Mobile number required" });
        }

        if (otp ==null || otp == ''){
            return res.status(400).json({ message: "OTP required" });
        }
        try{
            const customerCheck = await OTP.findOne({
                                            mobile: mobileNumber,
                                            otp: otp,
                                            status: true, 
                                            deletedAt: 0
                                        });
            
            if(customerCheck){
                const customerProfile = await CustomerProfile.findOne({
                                                mobile: mobileNumber,
                                                status: true, 
                                                deletedAt: 0
                                            });
                let registration = true
                if(customerProfile)
                    registration = false

                const payload = {
                    customerProfile: {
                        id: customerCheck.id
                    }
                }

                jwt.sign(payload, jwtSecret, {
                    expiresIn: 3600000
                }, (error, token) => {
                    if(error) throw error

                    return res.status(200).json({ 
                            data: {
                                customerProfile,
                                registration,
                                token 
                            }, 
                            status: 'success', 
                            message: "Customer verification successfull!!"
                        });
                })

                
            }
            else{
               return res.status(400).json({ data: [],  status: 'error', message: "Authentication failed"}); 
            }   
        }
        catch (e){
            console.log(e)
            return res.status(500).json({ data: [],  status: 'error', message: "Internal server error"});
        }
           
    },
    customerProfile: async function(req,res) {
        var mobileNumber = req.body.mobile;
        if (mobileNumber ==null || mobileNumber == ''){
            return res.status(400).json({ message: "Mobile Number is Not Empty" });
        }

        var customerProfilecheck = await CustomerProfile.find({mobile:mobileNumber,status:true, deletedAt: 0});
        //console.log(customerProfilecheck);return false;
        if(customerProfilecheck.length>0) {
            return res.status(200).json({ data: customerProfilecheck, status: 'success', message: "Customer  Profile Data!!"});
        } else {
            return res.status(200).json({ data:customerProfilecheck, status: 'success', message: "No  Data Found!!"});
        }
        
    },
    updateCustomerProfile: async function(req,res) {
        var   mobile_number  = req.body.mobile;
        var   name  = req.body.name;
        var   email  = req.body.email;
        var   address  = req.body.address;
        if (mobile_number ==null || mobile_number == '')
        {
            return res.status(400).json({ message: "Mobile Number is Not Empty" });
        }
        if (name ==null || name == '')
        {
            return res.status(400).json({ message: "Name is Not Empty" });
        }
        if (email ==null || email == '')
        {
            return res.status(400).json({ message: "Email is Not Empty" });
        }
        if (address ==null || address == '')
        {
            return res.status(400).json({ message: "Address is Not Empty" });
        }
        let customerprofileData = {
            mobile : mobile_number,
            name : name,
            email : email,
            address : address
        };
        await CustomerProfile.updateOne(
            { mobile:mobile_number },
            customerprofileData, function(err,data){
                if(err){console.log(err)}
                return res.status(200).json({status: 'success', message: "Customer Profile Update successfully!!"});	
            })
    },
	
}