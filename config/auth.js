const passport = require('passport'),
mongoose = require('mongoose'),
jwt = require('jsonwebtoken'),
passportJWT = require("passport-jwt"),
encrypt = require('../utilities/encryption'),
User = require('../models/user');

let ExtractJwt = passportJWT.ExtractJwt,
JwtStrategy = passportJWT.Strategy;
let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'tomatosecretapikey';

exports.register = (request, response, next) => {
	request.body.email = request.body.email.toLowerCase();
	User.findOne({email: request.body.email}, function(err, user) {
		if(err) {
		  return next(err);
		  }
		if(user) {
		  response.status(400);
		  response.send({message:"email already exists"});
		}
		else {
			  let newUser = new User({
			  firstName:request.body.firstName,
			  lastName:request.body.lastName,
			  dob:request.body.dob,
			  email:request.body.email,
			  mobile:request.body.mobile
			});
			newUser.salt = encrypt.createsalt(); 
			newUser.password = encrypt.hashpwd(newUser.salt,request.body.password);
			newUser.save(function(err) {
			  if(err) {
				  console.log(err);
				  return next(err);
			  }
			  response.status(200);
			  response.send({message:"user created successfully"});
			});
		  }
	});
};

exports.login = (request, response, next) => {
		request.body.email = request.body.email.toLowerCase(); 

		User.findOne({email:request.body.email},{firstName:1,lastName:1, salt:1, password:1}).exec((err, user) => {
			if(err){return next(err);}
			if(user && user.authenticate(request.body.password)){
				var payload = {id: user._id};
				var token = jwt.sign(payload, jwtOptions.secretOrKey);
				response.send({token:token, firstName:user.firstName, lastName: user.lastName});
			}else{
				response.status(400);
				response.send({message:"username or password is incorrect"});
			}
    	})  
};