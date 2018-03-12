const cors = require('cors'),
	auth = require('./auth'),
	passport = require('passport'),
	fcmUser = require('../controllers/fcm-users');
user = require('../controllers/users');

module.exports = (app) => {

	app.use(cors());
	app.get("/", (request, response) => {
		response.json("running successfully");
	});

	app.post("/login", auth.login);
	app.post("/register", auth.register);

	app.get("/secret", passport.authenticate('jwt', { session: false }), function (req, res) {
		res.json({ message: "Success! You can not see this without a token" });
	});

	// app.get('/getLoggedInUsers', passport.authenticate('jwt', {session: false}), fcmUser.getLoggedInFcms);
	app.get('/getLoggedInUsers', fcmUser.getLoggedInFcms);

	app.put('/loggedIn', fcmUser.loggedIn);
	app.put('/loggedOut', fcmUser.loggedOut);

	app.get('/userDetails/:_id', user.userDetails);
	app.post('/updateUser/:_id', user.updateUser);

	app.get('*', (request, response) => {
		response.status(404);
		response.end();
	})
}