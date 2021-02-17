const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const moment = require('moment');
const Requestproduct = model.request_product;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {

    manageProductRequest: async function(req,res){
		let moduleName = 'Requested Product Management';
		let pageTitle = 'Manage Requested Product';
		var detail = {};	
		detail = {message:req.flash('msg')};
		await config.helpers.permission('manage_product', req, (err,permissionData)=>{
			res.render('admin/productrequest/view.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, detail:detail, permissionData:permissionData});
		});
	},
	
	listProductRequest:function(req,res){
		var search = {deletedAt:0}
		let searchValue = req.body.search.value;
		if(searchValue){			
            search.name = { $regex: '.*' + searchValue + '.*',$options:'i' };
		}
		
		let skip = req.input('start') ? parseInt(req.input('start')) : 0;
		let limit= req.input('length') ? parseInt(req.input('length')) : config.constant.LIMIT;
		async.parallel({
		    count:function(callback) {
		        Requestproduct.countDocuments(search).sort({'createdAt' : -1}).exec(function(err,data_count){
		        	callback(null,data_count)
		        })
		    },
		    data:function(callback) {		    
		    	Requestproduct.find(search).skip(skip).limit(limit).sort({'createdAt' : -1}).exec(function(err,data){
		        	callback(null,data)
		        })		        
		    }
		},		
		async function(err, results) {
		   	var obj = {};
			obj.draw = req.body.draw;
			obj.recordsTotal = results.count?results.count:0;
			obj.recordsFiltered =results.count?results.count:0;
			var data = results.data?results.data:[];
			var arr =[];
			var perdata = {add:1,edit:1,delete:1}
			await config.helpers.permission('manage_product', req, async function(err,permissionData) {
				for(i=0;i<data.length;i++){
					var arr1 = [];
					await config.helpers.product.getNameById(data[i].productId, async function (productName) {
						var product_name = productName ? productName.name : 'N/A';
						arr1.push(product_name);
					})
                    arr1.push(data[i].description);
                    arr1.push(data[i].name);
                    arr1.push(data[i].email);
                    arr1.push(data[i].mobile);
					arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
                    arr1.push(data[i].address);
					arr1.push(data[i].pincode);
					let $but_reply = '';
					if(data[i].isReplied == false){
						$but_reply = '<span><button type="button" class="btn btn-flat btn-info btn-outline-danger mailBtn" title="Delete" data-toggle="modal" data-target="#mailModal" data-email="'+data[i].email+'" data-id="'+data[i].id+'" data-name="'+data[i].name+'"><i class="fas fa-envelope" ></i></button></span>';
					}else{
						arr1.push('<span class="badge bg-success" style="cursor:pointer;">Replied</span>');
					}
					arr1.push($but_reply);
					arr.push(arr1);
				}
				obj.data = arr;
				res.send(obj);
			});
		});
	},

    sendReplyProductRequest: async function(req,res){
		if(req.method == 'POST'){
			let id = req.body.id;
			let email = req.body.email;
			let name = req.body.name;
			let subject = req.body.subject;
			let message = 'Dear '+name+',<br>';
			message += `<p>`+req.body.message+`</p>`;
			await config.helpers.email.sendEmail(email, subject, message, async function (emailData) {
				if(emailData == 1)
				{
					let updateData = {
						isReplied : true,
					}
					await Requestproduct.updateOne( { _id: mongoose.mongo.ObjectId(id) }, updateData);
					res.send('done');
				}else{
					res.send('error');
				}
			});	
		}
	},
}