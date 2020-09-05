const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Custumer     = model.custumer;
const jwt = require("jsonwebtoken");

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
        var mobile_number = req.body.mobile;
        var opt  = "123456"
        var phoneRegex = /^(0|[+91]{3})?[7-9][0-9]{9}$/;
        
        if (mobile_number ==null || mobile_number == '')
        {
            return res.status(200).json({ message: "Mobile Number is Not Empty" });
        }

        if(mobile_number.match(phoneRegex)){
            var customercheck = await Custumer.find({mobile:mobile_number,status:true, deletedAt: 0});
            if(customercheck.length > 0) {
                    const token = jwt.sign(
                        {
                            mobile: customercheck.mobile
                        },
                        process.env.JWT_KEY, 
                        {
                            expiresIn: '1h',
                        }
                    );
                    //return res.status(200).json({ message: "Mobile Number  Already Inserted!" });
                    return res.status(200).json({ data: customercheck,registration:"false", token:token, status: 'success', message: "Customer Otp  and mobile verification!!"});
                    
            } else {
                    let customerData = {
                        mobile : mobile_number,
                        opt  : opt
                    };
                    //console.log(storeData);
                    let customer = new Custumer(customerData);
                    customer.save(function(err, data){
                        if(err){console.log(err)}
                        const token = jwt.sign(
                            {
                                mobile: data.mobile
                            },
                            process.env.JWT_KEY, 
                            {
                                expiresIn: '1h',
                            }
                        );
                        return res.status(200).json({ data: data, registration:"true", token:token, status: 'success', message: "Customer  Add successfully!!"});
                    })
            }
        } else {

            return res.status(200).json({ message: "Invaild Mobile Number" });
        }
          
    },

    checkCustomerOtp:async function(req,res) {
        var mobile_number = req.body.mobile;
        var otp           = req.body.otp;
        if (mobile_number ==null || mobile_number == '')
        {
            return res.status(200).json({ message: "(mobile) Number is Not Empty" });
        }
        if (otp ==null || otp == '')
        {
            return res.status(200).json({ message: "Otp is Not Empty" });
        }
        var customercheck = await Custumer.find({mobile:mobile_number,opt:otp,status:true, deletedAt: 0});
        if(customercheck.length>0){

            const token = jwt.sign(
                {
                    mobile: customercheck.mobile
                },
                process.env.JWT_KEY, 
                {
                    expiresIn: '1h',
                }
            );
            
            return res.status(200).json({ data: customercheck, token:token, registration:"false", status: 'success', message: "Customer  verification successfully!!"});
        } else {
           return res.status(200).json({ data: customercheck,  status: 'Fail', message: "Customer  verification failed !!"}); 
        }      
    },
    customerProfile: async function(req,res) {

    },
	
}