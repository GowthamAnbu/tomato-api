let FcmUser = require("../models/fcm-user");

exports.getLoggedInFcms = (request, response, next) =>{
    FcmUser.find({}, (err, _fcmUser)=>{
      if(err){return response.status(500).json(err);}
        if(_fcmUser){
          if (_fcmUser.length === 0) {
            let sResponse = {
              success: 1,
              message: 'no loggedin user found'
            };
            response.status(200).send(sResponse);  
          } else {
            console.log(_fcmUser);
            let sResponse = {
              success: 1,
              message : 'got the users'
            };
            response.status(200).send(_fcmUser);
          }
        }else{
          let eResponse = {
            success: 0,
            message: 'err'
          };
          response.status(500).send(eResponse);
        }
    });
};

exports.loggedIn = (request, response, next) =>{
  FcmUser.findOne({user_id: request.body.user_id}, (err, user) => {
    if (err) {return response.status(500).json(err);}
    if (user) {
      console.log('user exists so append the token');
      let updateQuery = {$push:{token : request.body.token}};
      FcmUser.update({user_id: request.body.user_id, token: {$nin: [request.body.token]}},updateQuery, (err, _fcmUser) => {
        if (err) {return response.status(500).json(err);}
        if (_fcmUser) {
          console.log(_fcmUser);
          let sResponse = {
            success: 1,
            message : 'user logged in successfully',
            token: request.body.token
          };
          response.status(200).send(sResponse);
        } else {
          let eResponse = {
            success: 0,
            message: 'error updating fcmuser',
            token: request.body.token
          };
          response.status(500).send(eResponse);
        }
      });
    }else {
      console.log('user not found so creating user ...');
      let fcmUser = new FcmUser({
        user_id: request.body.user_id,
        token: request.body.token
      });
      FcmUser.create(fcmUser, (err, _fcmUser) => {
        if(err){return response.status(500).json(err);}
        if(_fcmUser) {
          console.log(_fcmUser);
          let sResponse = {
            success: 1,
            message : 'user logged in successfully',
            token: request.body.token
          };
          response.status(200).send(sResponse);
        }else {
          let eResponse = {
            success: 0,
            message: 'error creating user',
            token: request.body.token
          };
          response.status(500).send(eResponse);
        }
      });
    }            
  });
};

exports.loggedOut = (request, response, next) =>{
  FcmUser.findOne({user_id: request.body.user_id}, (err, user) => {
    if(err){return response.status(500).json(err);}
    if (user) {
      console.log('user exists so delete the token if exists else do nothing');
      let updateQuery = {$pull:{token : request.body.token}};
      FcmUser.update({user_id: request.body.user_id},updateQuery, (err, _fcmUser) => {
        if (err) {return response.status(500).json(err);}
        if (_fcmUser) {
          console.log('token deleted check if there is no token for user and delete the user itself');
          var deleteUser = FcmUser.findOne({user_id: request.body.user_id},(err, _lfcmUser) => {
            if (err) {return response.status(500).json(err);}
          if(_lfcmUser) {
            if(_lfcmUser.token.length === 0){
              console.log('delete the user since no token');
              deleteUser.remove((err, deletedUser) => {
                if(err){return response.status(500).json(err); }
                if(deleteUser) {
                  console.log(deletedUser);
                  let sResponse = {
                    success: 1,
                    message : 'user logged out successfully',
                    token: request.body.token
                  };
                  response.status(200).send(sResponse);
                }
                else {
                  let eResponse = {
                    success: 0,
                    message: 'error deleting user',
                    token: request.body.token
                  };
                  response.status(500).send(eResponse);
                }
              });
            } else {
              console.log('user preserved');
              let sResponse = {
                success: 1,
                message : 'user logged out successfully',
                token: request.body.token
              };
              response.status(200).send(sResponse);
            }
          }else {
            let eResponse = {
              success: 0,
              message: 'error in finding user for no token to ensure user is deleted(token deleted already)',
              token: request.body.token
            };
            response.status(500).send(eResponse);
          }
          });
        } else {
          let eResponse = {
            success: 0,
            message: 'error logging out (token not deleted)',
            token: request.body.token
          };
          response.status(500).send(eResponse);
        }
      });
    }else {
      console.log('user not found there is something wrong during login')
      response.status(500).end();
    }            
  });
};