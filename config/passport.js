const mongoose = require('mongoose'),
      passport = require('passport'),
      encrypt = require('../utilities/encryption')/* ,
      LocalStrategy = require('passport-local').Strategy */;

const User = mongoose.model("user");

var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

      
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'tomatosecretapikey';

module.exports = function(){
    var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
        // console.log('payload received', jwt_payload);
        User.findOne({_id: jwt_payload.id},).exec((err, user) => {
          if (user) {
            next(null, user);
          } else {
            next(null, false);
          }
        });
      });
      
      passport.use(strategy);
}