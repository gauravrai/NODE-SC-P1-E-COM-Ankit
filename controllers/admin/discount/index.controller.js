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
		let moduleName = 'Discount & Coupon Management';
		let pageTitle = 'Manage Discount & Coupon';
		await config.helpers.permission('manage_discount', req, (err,permissionData)=>{
			res.render('admin/discount/view.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, permissionData:permissionData});
		});
	},

	listDiscount:function(req,res){
		var search = {deletedAt:0}
		let searchValue = req.body.search.value;
		if(searchValue){			
            search.couponName = { $regex: '.*' + searchValue + '.*',$options:'i' };
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
                    arr1.push(data[i].couponNo);
					arr1.push(data[i].couponName);
                    arr1.push(data[i].orderValue);
					arr1.push(data[i].noOfUses);
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
			let moduleName = 'Discount & Coupon Management';
			let pageTitle = 'Add Discount & Coupon';
			let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
			let charactersLength = characters.length;
			let couponNo = '';
			for (var i = 0; i < 6; i++) {
				couponNo += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			res.render('admin/discount/add.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, couponNo:couponNo} );
		}else{
			let discountData = {
				couponNo : req.body.couponNo.toUpperCase(),
				couponName : req.body.couponName,
				orderValue : req.body.orderValue,
				noOfUses : req.body.noOfUses,
				offerType : req.body.offerType,
				percentage : req.body.percentage,
				fixed : req.body.fixed,
				from : moment(req.body.from).format('YYYY-MM-DD'),
				to : moment(req.body.to).format('YYYY-MM-DD'),
				capping : req.body.capping,
				applyFor : req.body.applyFor,
				firstOrder : req.body.firstOrder == 'on' ? true : false
			};
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
			let moduleName = 'Discount & Coupon Management';
			let pageTitle = 'Edit Discount & Coupon';
            let id = req.body.id;
            let discountData = await Discount.findOne({_id: mongoose.mongo.ObjectId(id), status: true, deletedAt: 0});
			let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
			let charactersLength = characters.length;
			let couponNo = '';
			for (var i = 0; i < 6; i++) {
				couponNo += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			res.render('admin/discount/edit.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, discountData:discountData,moment:moment, couponNo:couponNo} );
		}
		if(req.method == "POST"){
			let discountData = {
				couponNo : req.body.couponNo.toUpperCase(),
				couponName : req.body.couponName,
				orderValue : req.body.orderValue,
				noOfUses : req.body.noOfUses,
				offerType : req.body.offerType,
				percentage : req.body.percentage,
				fixed : req.body.fixed,
				from : moment(req.body.from).format('YYYY-MM-DD'),
				to : moment(req.body.to).format('YYYY-MM-DD'),
				capping : req.body.capping,
				applyFor : req.body.applyFor,
				firstOrder : req.body.firstOrder == 'on' ? true : false
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

	changeStatusDiscount: function(req,res){
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
	
    deleteDiscount: async function(req,res){
		let id = req.param("id");
		return Discount.updateOne({_id:  mongoose.mongo.ObjectId(id)},{deletedAt:2},function(err,data){        	
			if(err) console.error(err);
        	res.send('done');
        })
	},

	checkCouponNo: async function(req,res){
		let couponNo  = req.body.couponNo;
		let couponData = await Discount.find({couponNo:couponNo, status:true, deletedAt: 0});
		if(couponData.length>0){
			return res.status(200).json({ code:1 , status: 'exists', message: "Coupon Number  Already Inserted !!"});
		} else {
		 return res.status(200).json({ code:0 , status: '', message: "" });
		}
 },
}