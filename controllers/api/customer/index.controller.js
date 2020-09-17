const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const jwt = require("jsonwebtoken");
const OTP     = model.otp;
const Custumer     = model.customer;
const JWTtoken = config.constant.JWT_Token;
var http = require('http'),
    url = require('url');

module.exports = {
	
    // @route       GET api/v1/product
    // @description Get all product
    // @access      Public
	productList:async function(req,res){
        var productData = await Product.find({status:true, deletedAt: 0},{}).sort( { name : 1} );
        // console.log(categoryData);
        // console.log(stringify(categoryData));return false;
        // var categoryData = {name:"chandan",email:"chandan@gmail.com"};
        return res.status(200).json({ data: productData, status: 'success', message: "Data fetched successfully!!" });
		
    },
    addCustomer:async function(req,res){
        //console.log(JWTtoken); return false;
        var mobile_number = req.body.mobile;
        var otp = Math.floor(1000 + Math.random() * 9000);
        //var opt  = "1234"
        var phoneRegex = /^(0|[+91]{3})?[7-9][0-9]{9}$/;
        
        if (mobile_number ==null || mobile_number == '')
        {
            return res.status(400).json({ message: "Mobile cannot be empty" });
        }

        if(mobile_number.match(phoneRegex)){

        //     const username = 'evamastuT';
        //     const apiKey = 'F46C7-CF479';
        //     const apiRequest = 'Text';
        //     const senderID = 'EVMSTU';
        //     const apiRoute = 'TRANS';

        //     // Prepare data for POST request
        //    // $data = 'username=' . $username . '&apikey=' . $apiKey . '&apirequest=' . $apiRequest . '&route=' . $apiRoute . '&mobile=' . $reciverNumber . '&sender=' . $senderID . "&message=" . urlencode($template);
        
        //     var opts = url.parse('http://www.alots.in/sms-panel/api/http/index.php'),
        //         data = { username: username, apiKey:apiKey, apiRequest:apiRequest, senderID:senderID, apiRoute:apiRoute,message:opt  };
        //     opts.headers = {};
        //     opts.headers['Content-Type'] = 'application/json';

        //     http.request(opts, function (res) {
        //         // do whatever you want with the response
        //         res.pipe(process.stdout);
        //     }).end(JSON.stringify(data));

            var otpcheck = await OTP.find({mobile:mobile_number, status:true, deletedAt: 0});
            if(otpcheck.length > 0) {
                    const token = jwt.sign(
                        {
                            mobile: otpcheck.mobile
                        },
                        //process.env.JWT_KEY, 
                        JWTtoken,
                        {
                            expiresIn: '1h',
                        }
                    );
                    //return res.status(200).json({ message: "Mobile Number  Already Inserted!" });
                    return res.status(200).json({ data: otpcheck, registration:"true", token:token, status: 'success', message: "Customer OTP and mobile number verified"});
                    
            } else {
                    let otpData = {
                        mobile : mobile_number,
                        opt  : opt
                    };
                    //console.log(storeData);
                    let otp = new OTP(otpData);
                    otp.save(function(err, data){
                        if(err){console.log(err)}
                        // code for add  customer profile start here
                        var mobile = data.mobile;
                        console.log(mobile);
                        let customerData = {
                            mobile : mobile
                        };
                        //console.log(categoryData);
                        let customer = new Custumer(customerData);
                        customer.save(function(err, data){
                            if(err){console.log(err)}	
                        })
                        return res.status(200).json({ data: data, registration:"false", status: 'success', message: "Customer  Add successfully!!"});
                    })
            }
        } else {

            return res.status(400).json({ message: "Invaild Mobile Number" });
        }
          
    },

    checkCustomerOtp:async function(req,res) {
        var mobileNumber = req.body.mobile;
        var otp           = req.body.otp;
        if (mobileNumber ==null || mobileNumber == '')
        {
            return res.status(400).json({ message: "Mobile Number is Not Empty" });
        }
        if (otp ==null || otp == '')
        {
            return res.status(400).json({ message: "Otp is Not Empty" });
        }
        var customercheck = await OTP.find({mobile:mobileNumber,opt:otp,status:true, deletedAt: 0});
        
        if(customercheck.length>0){
            var customerData = await Custumer.find({mobile:mobileNumber,status:true, deletedAt: 0});
            const token = jwt.sign(
                {
                    mobile: customerData.mobile
                },
                //process.env.JWT_KEY, 
                JWTtoken,
                {
                    expiresIn: '1h',
                }
            );
            //CustumerProfile
            return res.status(200).json({ data: customerData, token:token, registration:"false", status: 'success', message: "Customer  verification successfully!!"});
        } else {
           return res.status(200).json({ data: customercheck,  status: 'Fail', message: "Customer  verification failed !!"}); 
        }      
    },
    customerProfile: async function(req,res) {
        var mobileNumber = req.body.mobile;
        if (mobileNumber ==null || mobileNumber == '')
        {
            return res.status(400).json({ message: "Mobile Number is Not Empty" });
        }

        var customerProfilecheck = await Custumer.find({mobile:mobileNumber,status:true, deletedAt: 0});
        //console.log(customerProfilecheck);return false;
        if(customerProfilecheck.length>0) {
            const token = jwt.sign(
                {
                    _id: customerProfilecheck._id,
                    mobile: customerProfilecheck.mobile
                },
                //process.env.JWT_KEY, 
                JWTtoken,
                {
                    expiresIn: '1h',
                }
            );
            return res.status(200).json({ data: customerProfilecheck, token:token, status: 'success', message: "Customer  Profile Data!!"});
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
        await Custumer.updateOne(
            { mobile:mobile_number },
            customerprofileData, function(err,data){
                if(err){console.log(err)}
                return res.status(200).json({status: 'success', message: "Customer Profile Update successfully!!"});	
            })
    },
	
}