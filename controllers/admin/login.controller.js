const model  = require('../../models/index.model');
const config = require('../../config/index');
const bcrypt = require("bcrypt-nodejs");
const Admin = model.admin;
const EmailTemplate = model.email_template;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	index: async function(req,res){
		var detail = {};
		if(req.method == "GET"){	
			let pageTitle = 'Login';		
			detail = {message:req.flash('msg')};			
			res.render('admin/login.ejs',{layout:'admin/layout/layout_login', pageTitle:pageTitle, detail:detail} );
		}else{
			let username = req.body.username;
			let password = req.body.password;
			let adminData = await Admin.findOne({username:username});
			if(adminData){
				if(bcrypt.compareSync(password, adminData.password)){
					req.session.ADMINID = adminData._id;
					req.session.ADMINNAME = adminData.name;
					detail.status = true;
					res.redirect(ADMINCALLURL+'/dashboard');
				}else{
					req.flash('msg', {msg:'Please Enter valid password',status:false});						
					res.redirect(ADMINCALLURL);
				}
			}else{
				req.flash('msg', {msg:'Please Enter valid username',status:false});
				res.redirect(ADMINCALLURL);
			}		
		}	
	},

	logout :function(req,res){
		req.session.destroy(function(err){
     		if(err) console.log(err);
			res.redirect(ADMINCALLURL);
		});
	},

	create:function(req,res){
		
		var admin = new Admin({
			username:"masteradmin",
			password:bcrypt.hashSync("12345678"),
		})
		admin.save()
		.then(data => {
			res.send(data);
		}).catch(err => {
			res.send('error occured',err);
		});
	},	
	
	forgotPassword: async function(req,res){
		try{
			let detail = {};
			if(req.method == "GET"){	
				let pageTitle = 'Recover Password';		
				detail = {message:req.flash('msg')};			
				res.render('admin/forgotpassword.ejs',{layout:'admin/layout/layout_login', pageTitle:pageTitle, detail:detail} );
			}else{
				let email = req.input('email');
				let adminData = await Admin.findOne({email: email});
				if(adminData){
					let adminId = bcrypt.hashSync(adminData.id);
					let valid = encodeURIComponent(new Date());
					let emailData = await EmailTemplate.findOne({slug: "ADMIN-FORGOT-PASSWORD", deletedAt: 0, status: true});
					let message = emailData.message;
					message = message.replace(/{SITENAME}/g, config.constant.SITENAME);
					message = message.replace(/{LINK}/g, config.constant.SITEURL+ADMINCALLURL+'/reset_password?id='+adminId+'&valid='+valid+'&email='+email);
					await config.helpers.email.sendEmail(adminData.email, emailData.subject, message, async function (emailData) {
						req.flash('msg', {msg:'An email with reset password link has been sent to your email. Please reset password and get back here to login.',status:true});						
						res.redirect(ADMINCALLURL+'/forgot_password');
					})
				}
				else{					
					req.flash('msg', {msg:'The email Id you entered is not rgistered with us. Please check and enter registered email id.',status:false});						
					res.redirect(ADMINCALLURL+'/forgot_password');
				}
			}	
		}catch(e){
			console.log('Error:-',e);
			res.redirect(INTERNALSERVERCALLURL);
		}
	},	
	
	resetPassword: async function(req,res){
		try{
			let detail = {};
			let id = req.input('id');
			let valid = req.input('valid');
			let email = req.input('email');
			if(id != '' && valid != '' && email != '' && typeof id != 'undefined' && typeof valid != 'undefined' && typeof email != 'undefined'){
				let adminData = await Admin.findOne({email: email});
				if(adminData){
					if(bcrypt.compareSync(adminData.id, id)){
						valid = new Date(decodeURIComponent(valid));
						valid = valid.getTime() / 1000;
						let now = new Date().getTime() / 1000;
						var difference = (now - valid)/60/60;
						if(difference < 1){
							if(req.method == "GET"){
								let pageTitle = 'Reset Password';		
								detail = {message:req.flash('msg')};			
								res.render('admin/resetpassword.ejs',{layout:'admin/layout/layout_login', pageTitle, detail} );
							}else{
								let id = req.input('id');
								let password = req.input('password');
								let data = {
									password: bcrypt.hashSync(password)
								};
								let updatePassword = await Admin.updateOne({ _id: adminData._id }, data);
								req.flash('msg', { msg:'Your password has been successfully changed. Please login to continue.', status:true } );
								return res.redirect(ADMINCALLURL);
							}	
						}else{
							req.flash('msg', {msg:'Link Expired. Please Try Again.',status:false});
							res.redirect(ADMINCALLURL);
						}
					}else{		
						req.flash('msg', {msg:'Unauthorized access.',status:false});
						res.redirect(ADMINCALLURL);
					}
				}else{
					req.flash('msg', {msg:'Link Mismatched.',status:false});
					res.redirect(ADMINCALLURL);
				}
			}else{
				req.flash('msg', {msg:'Link Mismatched.',status:false});
				res.redirect(ADMINCALLURL);
			}
		}catch(e){
			console.log('Error:-',e);
			res.redirect(ADMINCALLURL);
		}
	},	
	
	lockScreen: async function(req,res){	
		delete req.session.ADMINID;
		delete req.session.ADMINNAME;
		req.flash('msg', {msg:'You are logged out due to inactivity. Please login again.',status:false});		
		res.redirect(ADMINCALLURL);
	},	
}