const cors = require('cors'),
auth = require('./auth'),
passport = require('passport'),
fcmUser = require('../controllers/fcm-users');

module.exports = (app) => {
    
    app.use(cors());
    app.get("/",(request, response)=>{
        response.json("running successfully");
    });
    app.post("/login", auth.login);
    app.post("/register",auth.register);

    app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
        res.json({message: "Success! You can not see this without a token"});
    });

    // app.post('/createFcm', fcmUser.Create);
    // app.get('/getLoggedInUsers'/* , passport.authenticate('jwt', {session: false}) */, fcms.getLoggedInFcms);
    app.put('/loggedIn', fcmUser.loggedIn);
    app.put('/loggedOut', fcmUser.loggedOut);
    app.get('*', (request, response) => {
        response.status(404);
        response.end();
    })
}