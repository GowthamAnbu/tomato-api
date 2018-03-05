const cors = require('cors'),
auth = require('./auth'),
fcms = require('../controllers/fcms')
passport = require('passport');

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

    // app.post('/createFcm', passport.authenticate('jwt', {session: false}), fcms.create);
    app.get('/getLoggedInUsers'/* , passport.authenticate('jwt', {session: false}) */, fcms.getLoggedInFcms);
    app.put('/loggedIn', fcms.loggedIn);
    app.put('/loggedOut', fcms.loggedOut);
    app.get('*', (request, response) => {
        response.status(404);
        response.end();
    })
}