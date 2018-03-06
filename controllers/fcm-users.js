let FcmUser = require("../models/fcm-user");
/* exports.getLoggedInFcms = (request, response, next) =>{
    Fcm.find({'fcm.status':true}, (err, fcm)=>{
        if(err){return next(err); }
        if(fcm){
            response.send(fcm);
        }else{
            response.send({message:"no fcms found"})
        }
    });
}; */

exports.loggedIn = (request, response, next) =>{
  FcmUser.findOne({user_id: request.body.user_id}, (err, user) => {
    if(err){return next(err); }
    if (user) {
      if (user.length === 0) {
        response.send('length 0');
      } else { 
        console.log('user exists so append the token');
        let updateQuery = {$push:{token : request.body.token}};
          FcmUser.update({user_id: request.body.user_id, token: {$nin: [request.body.token]}},updateQuery, (err, _fcmUser) => {
            if (err) {return response.status(400).json(err);}
            if (_fcmUser) {
              response.send(_fcmUser);
            } else {
              response.send('error updating fcmuser');
            }
          });
      }
    }else {
      console.log('user not found so creating user ...');
      let fcmUser = new FcmUser({
        user_id: request.body.user_id,
        token: request.body.token
      });
      FcmUser.create(fcmUser, (err, _fcmUser) => {
        if(err){
          return response.status(400).json(err);
        }
        if(_fcmUser) {
          response.send(_fcmUser);
        }else {
          response.send('error creating user');
        }
      });
    }            
  });
};

exports.loggedOut = (request, response, next) =>{
  FcmUser.findOne({user_id: request.body.user_id}, (err, user) => {
    if(err){return next(err); }
    if (user) {
      if (user.length === 0) {
        response.send('length 0');
      } else { 
        console.log('user exists so delete the token if exists else do nothing');
        let updateQuery = {$pull:{token : request.body.token}};
          FcmUser.update({user_id: request.body.user_id},updateQuery, (err, _fcmUser) => {
            if (err) {return response.status(400).json(err);}
            if (_fcmUser) {
              console.log('token deleted check if there is no token for user and delete the user itself');
              var deleteUser = FcmUser.findOne({user_id: request.body.user_id},(err, _fcmUser) => {
              if(err){return next(err); }
              if(_fcmUser) {
                if(_fcmUser.token.length === 0){
                  console.log('delete the user since no token');
                  deleteUser.remove((err, deletedUser) => {
                    if(err){return response.status(400).json(err); }
                    if(deleteUser) {
                      response.send(deletedUser);
                    }
                    else {
                      response.send('error deleting user');
                    }
                  });
                } else {
                  response.send('user preserved');
                }
              }else {
                response.send('error in finding user');
              }
              });
            } else {
              response.send('error updating fcmuser');
            }
        });
      }
    }else {
      response.send('user not found there is something wrong during login');
    }            
  });
};