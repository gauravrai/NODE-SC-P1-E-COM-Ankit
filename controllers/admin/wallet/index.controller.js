const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Wallet = model.wallet;
const Walletentry = model.wallet_entry;
const Customer = model.customer;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	manageWallet: async function(req,res){
		let moduleName = 'Wallet Management';
		let pageTitle = 'Manage Wallet';
		await config.helpers.permission('manage_wallet', req, (err,permissionData)=>{
			res.render('admin/wallet/view',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName,permissionData:permissionData});
		});
    },

    listWallet:function(req,res){
		var search = {deletedAt:0}
		let searchValue = req.body.search.value;
		if(searchValue){			
            search.name = { $regex: '.*' + searchValue + '.*',$options:'i' };
		}
		
		let skip = req.input('start') ? parseInt(req.input('start')) : 0;
		let limit= req.input('length') ? parseInt(req.input('length')) : config.constant.LIMIT;
		async.parallel({
		    count:function(callback) {
		        Wallet.countDocuments(search).sort({'createdAt' : -1}).exec(function(err,data_count){
		        	callback(null,data_count)
		        })
		    },
		    data:function(callback) {		    
		    	Wallet.find(search).skip(skip).limit(limit).sort({'createdAt' : -1}).exec(function(err,data){
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
			await config.helpers.permission('manage_wallet', req, async function(err,permissionData) {
				for(i=0;i<data.length;i++){
					var arr1 = [];
					await config.helpers.customer.getNameById(data[i].userId, async function (userName) {
						var name = userName ? userName.name : 'N/A';
						arr1.push(name);
					})
					await config.helpers.customer.getMobileById(data[i].userId, async function (userMobile) {
						var mobile = userMobile ? userMobile.mobile : 'N/A';
						arr1.push(mobile);
					})
					arr1.push(data[i].totalAmount);
					arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
					$but_view = '<span><a href="'+ADMINCALLURL+'/view_wallet?id='+data[i].userId+'" class="btn btn-flat btn-info btn-outline-primary" title="View"><i class="fas fa-eye"></i></a></span>';
					
					arr1.push($but_view);
					arr.push(arr1);
				}
				obj.data = arr;
				res.send(obj);
			});
		});
	},

    addWallet: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Wallet Management';
			let pageTitle = 'Add Wallet';
			let customerData = await Customer.find({ deletedAt: 0, status: true});
			res.render('admin/wallet/add',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, customerData:customerData} );
		}else{
			let userId = req.body.userId;
			let amount = parseInt(req.body.amount);
			let type = req.body.type;
			let walletEntryData = {
				userId : userId,
				amount : amount,
				type : type,
			};
			let walletentry = new Walletentry(walletEntryData);
			walletentry.save();
			
			let wallet = await Wallet.findOne({userId: mongoose.mongo.ObjectID(userId)});
			if(wallet)
			{
				let walletData = {};
				let totalAmount = wallet.totalAmount;
				if(type == 'Add')
				{
					amount = ( totalAmount + amount );
					walletData.totalAmount = amount;
				}
				else{
					amount = totalAmount - amount;
					walletData.totalAmount = amount;
				}
				await Wallet.update(
					{ userId: mongoose.mongo.ObjectId(userId) },
					walletData, function(err,data){
						if(err){console.log(err)}
						req.flash('msg', {msg:'Wallet has been Updated Successfully', status:false});	
						res.redirect(config.constant.ADMINCALLURL+'/manage_wallet');
						req.flash({});	
				})
			}
			else{
				if(type == 'Add') {
					let walletData = {
						userId : userId,
						totalAmount : amount
					};
					let wallet = new Wallet(walletData);
					wallet.save(function(err, data){
						if(err){console.log(err)}
						req.flash('msg', {msg:'Wallet has been Added Successfully', status:false});	
						res.redirect(config.constant.ADMINCALLURL+'/manage_wallet');
						req.flash({});	
					})
				}
				else {
					req.flash('msg', {msg:'Add amount in wallet first Successfully', status:false});
					res.redirect(config.constant.ADMINCALLURL+'/add_wallet');
					req.flash({});
				}
			}
		}		
	},

	viewWallet: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Wallet Management';
			let pageTitle = 'View Wallet Details';
			let userId = req.body.id;
			let userData = await Customer.findOne({ _id: mongoose.mongo.ObjectId(userId), deletedAt: 0, status: true});
			let walletData = await Wallet.aggregate([
				{
					$match: { userId: mongoose.mongo.ObjectId(userId), deletedAt: 0, status: true}
				},
                {
                    $lookup:
                      {
                        from: "wallet_entries",
                        localField: "userId",
                        foreignField: "userId",
                        as: "walletEntryData"
                      }
				}
			]);
			res.render('admin/wallet/walletdetail',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, walletData:walletData, userData:userData, moment:moment} );
		}else{
		}
	}
}

