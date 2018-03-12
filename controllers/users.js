const user = require('../models/user'),
	encrypt = require('../utilities/encryption');

exports.RegisterUser = (request, response, next) => {
	let userData = request.body;

	userData.email = userData.email.toLowerCase();
	userData.salt = encrypt.createsalt();
	userData.password = encrypt.hashpwd(userData.salt, userData.password);

	user.create(userData, (err, user) => {
		if (err) {
			if (err.toString().indexOf('E11000') > -1) {
				err = new Error('Duplicate username');
			}
			response.status(400);
			return response.send({ reason: err.toString() });
		}
		request.logIn(user, (err) => {
			if (err) { return next(err); }
			response.status(201);
			response.end();
		})
	})
};

exports.login = (request, response) => {
	let loginForm = request.body;
	user.findOne({ email: loginForm.email, password: loginForm.password }, { firstName: 1, lastName: 1 }).exec((err, collection) => {
		if (err) {
			respose.status(400);
			return response.send({ reason: err.toString() });
		}
		if (collection === null) {
			err = new Error("username or password is incorrect");
			response.status(400);
			return response.send({ reason: err.toString() });
		}
		response.status(202);
		response.send(collection);
	})
};

exports.userDetails = (request, response) => {
	user.find({ _id: request.params._id })
	.select({ firstName: 1, lastName: 1, dob: 1, email: 1, mobile: 1, img_url: 1 })
	.exec((err, _user) => {
		if (err) {
			respose.status(400);
			return response.send({ reason: err.toString() });
		}
		if (_user) {
			response.status(200).send(_user);
		} else {
			let eResponse = {
				success: 0,
				message: 'error getting user details',
				token: request.body.token
			};
			response.status(500).send(eResponse);
		}
	});
};

exports.updateUser = (request, response) => {
	updateQuery = { $set:{dob: request.body.dob, email: request.body.email, firstName: request.body.firstName, lastName:request.body.lastName, dob:request.body.dob}}
	user.findByIdAndUpdate(request.params._id, updateQuery, { new: true })
	.select({ firstName: 1, lastName: 1, dob: 1, email: 1, mobile: 1, img_url: 1 })
	.exec((err, _user) => {
		if (err) {
			respose.status(500);
			response.send({ reason: err.toString() });
		}
		if (_user) {
			let sResponse = {
				success: 1,
				message : 'user udpated successfully'
			};
			response.status(200).send(sResponse);
		} else {
			let eResponse = {
				success: 0,
				message: 'error updating user details',
				token: request.body.token
			};
			response.status(500).send(eResponse);
		}
	});
};

/* _user.set({dob: request.body.dob, email: request.body.email, firstName: request.body.firstName, lastName:request.body.lastName, dob:request.body.dob})
			_user.save(function (err, updatedUser) {
				if (err) {
					respose.status(500);
					response.send({ reason: err.toString() });
				} 
				let sResponse = {
					success: 1,
					message : 'users udpated successfully'
				};
				response.status(200).send(sResponse);
			}); */