const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Discount = model.discount;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
    
    manageDiscount: async function(req,res){
		let moduleName = 'Discount Management';
		let pageTitle = 'Manage Discount';
		await config.helpers.permission('manage_discount', req, (err,permissionData)=>{
			res.render('admin/discount/view.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, permissionData:permissionData});
		});
	},
	listDiscount:function(req,res){
		var search = {deletedAt:0}
		let searchValue = req.body.search.value;
		if(searchValue){			
            search.discount = { $regex: '.*' + searchValue + '.*',$options:'i' };
		}
		
		let skip = req.input('start') ? parseInt(req.input('start')) : 0;
		let limit= req.input('length') ? parseInt(req.input('length')) : config.constant.LIMIT;
		async.parallel({
		    count:function(callback) {
		        Discount.countDocuments(search).sort({'createdAt' : -1}).exec(function(err,data_count){
		        	callback(null,data_count)
		        })
		    },
		    data:function(callback) {		    
		    	Discount.find(search).skip(skip).limit(limit).sort({'createdAt' : -1}).exec(function(err,data){
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
            //console.log(data);
			await config.helpers.permission('manage_discount', req, async function(err,permissionData) {
				for(i=0;i<data.length;i++){
                    var arr1 = [];
                    arr1.push(data[i].coupon_no);
					arr1.push(data[i].name);
                    arr1.push(data[i].min_Order_gst);
					arr1.push(data[i].no_of_uses);
					//arr1.push(data[i].store);
					arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
					if(!data[i].status){
						let change_status = "changeStatus(this,\'1\',\'change_status_discount\',\'list_discount\',\'discount\');";	
						arr1.push('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Inactive</span>');
					}else{
						let change_status = "changeStatus(this,\'0\',\'change_status_discount\',\'list_discount\',\'discount\');";
						arr1.push('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Active</span>');
					}
					let $but_edit = '-';
					if(permissionData.edit=='1'){
					$but_edit = '<span><a href="'+ADMINCALLURL+'/edit_discount?id='+data[i]._id+'" class="btn btn-flat btn-info btn-outline-primary" title="Edit"><i class="fas fa-edit"></i></a></span>';
					}
					let $but_delete = ' - ';
					if(permissionData.delete =='1'){
						let remove = "deleteData(this,\'delete_discount\',\'list_discount\',\'discount\');";
						$but_delete = '&nbsp;&nbsp;<span><a href="javascript:void(0)" class="btn btn-flat btn-info btn-outline-danger" title="Delete" onclick="'+remove+'" id="'+data[i]._id+'"><i class="fas fa fa-trash" ></i></a></span>';
					}
					arr1.push($but_edit+$but_delete);
					arr.push(arr1);
				}
				obj.data = arr;
				res.send(obj);
			});
		});
	},
    addDiscount: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Discount Management';
			let pageTitle = 'Add Discount';
			res.render('admin/discount/add.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName} );
		}else{
			let discountData = {
				coupon_no : req.body.coupon_no.toUpperCase(),
				name : req.body.coupon_name,
				min_Order_gst : req.body.min_order,
				no_of_uses : req.body.no_of_uses,
				offer_type : req.body.offertype,
				percentage : req.body.percentage,
				fixed : req.body.fixed,
				from : moment(req.body.from).format('YYYY-MM-DD'),
				to : moment(req.body.to).format('YYYY-MM-DD'),
				capping : req.body.capping,
				apply_for : req.body.applyfor
			};
			//console.log(storeData);
			let discountobj = new Discount(discountData);
			discountobj.save(function(err, data){
				if(err){console.log(err)}
				req.flash('msg', {msg:'Discount has been Created Successfully', status:false});	
				res.redirect(config.constant.ADMINCALLURL+'/manage_discount');
				req.flash({});	
			})
		}		
	},
	editDiscount: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Discount Management';
			let pageTitle = 'Edit Discount';
            let id = req.body.id;
            let discountData = await Discount.findOne({_id: mongoose.mongo.ObjectId(id), status: true, deletedAt: 0});
			res.render('admin/discount/edit.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, discountData:discountData,moment:moment} );
		}
		if(req.method == "POST"){
			let discountData = {
				coupon_no : req.body.coupon_no.toUpperCase(),
				name : req.body.coupon_name,
				min_Order_gst : req.body.min_order,
				no_of_uses : req.body.no_of_uses,
				offer_type : req.body.offertype,
				percentage : req.body.percentage,
				fixed : req.body.fixed,
				from : moment(req.body.from).format('YYYY-MM-DD'),
				to : moment(req.body.to).format('YYYY-MM-DD'),
				capping : req.body.capping,
				apply_for : req.body.applyfor
			};
			await Discount.update(
				{ _id: mongoose.mongo.ObjectId(req.body.id) },
				discountData, function(err,data){
					if(err){console.log(err)}
					req.flash('msg', {msg:'Discount has been Updated Successfully', status:false});	
					res.redirect(config.constant.ADMINCALLURL+'/manage_discount');
					req.flash({});	
			})
		}		
	},
	changeStatusDiscount : function(req,res){
		let id = req.param("id");
		let status = req.param("status");
		return Discount.updateOne({_id: mongoose.mongo.ObjectId(id)}, {
			status: parseInt(status)?true:false
		},function(err,data){
			if(err) console.error(err);
			if(status == '1'){
				let change_status = "changeStatus(this,\'0\',\'change_status_discount\',\'list_discount\',\'discount\');";
				res.send('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'">Active</span>');
			}
			else{
				let change_status = "changeStatus(this,\'1\',\'change_status_discount\',\'list_discount\',\'discount\');";	
				res.send('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'">Inactive</span>');
			}
	    })
    },
    deleteDiscount : async function(req,res){
		let id = req.param("id");
		return Discount.deleteOne({_id:  mongoose.mongo.ObjectId(id)},function(err,data){        	
			if(err) console.error(err);
        	res.send('done');
        })
	},
}