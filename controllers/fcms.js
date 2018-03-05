let Fcm = require("../models/fcm");

exports.create = (request, response, next) =>{
    let payload = request.body;
    Fcm.create(payload, (err, fcm)=>{
        if(err){return next(err); }
        if(fcm){
            response.json({message:"fcm created successfully"});
        }
    });
};

exports.getLoggedInFcms = (request, response, next) =>{
    Fcm.find({'fcm.status':true}, (err, fcm)=>{
        if(err){return next(err); }
        if(fcm){
            response.send(fcm);
        }else{
            response.send({message:"no fcms found"})
        }
    });
};

exports.loggedIn = (request, response, next) =>{
    let query = {user_id: request.body.user_id, 'fcm.token': request.body.token};
    Fcm.find({user_id: request.body.user_id}, (err, user) => {
        if(err){return next(err); }
        if (user) {
            if (user.length === 0) {
                console.log({message:"empty array no user found"});
                let payload = {
                    user_id: request.body.user_id,
                    fcm: {
                        token: request.body.token,
                    }
                }
                Fcm.create(payload, (err, fcm)=>{
                    if(err){return next(err); }
                    if(fcm){
                        response.json({message:"fcm created successfully"});
                    } else {
                        response.send('error creating user and token')
                    }
                });
            } else { 
                console.log('user present then check for token');
                Fcm.find(query, (err, fcm)=>{
                    if(err){return next(err); }
                    if(fcm){
                        if (fcm.length === 0) {
                            console.log({message:"no token then append"});
                            let fcm = { 'token' :request.body.token};
                            let append = {$push: { 'fcm' : fcm}};
                            Fcm.update({user_id:request.body.user_id}, append, (err, fcm)=>{
                                if(err){return next(err); }
                                if(fcm){
                                    console.log('appended successfully');
                                    response.send(fcm);
                                }else{
                                    response.send('error appending');
                                }
                            });
                        } else {
                            console.log('udpate the fcm directly');
                            let user = {user_id: request.body.user_id, 'fcm.token' : request.body.token, 'fcm.status': false}
                            let updateFcm =  { $set: { 'fcm.$.status' : true }};
                            Fcm.findOneAndUpdate(user, updateFcm, {new : true}, (err, fcm)=>{
                                if(err){return next(err); }
                                if(fcm){
                                    console.log('status updated successfully directly');
                                    response.send(fcm);
                                }else{
                                    response.send('already logged in no problem');
                                }
                            });
                        } 
                    }else{
                        response.send({message:"error checking user and token"});
                    }
                });
            }
        }else {
            response.send('error checking user');
        }            
    });
    
};

exports.loggedOut = (request, response, next) =>{
    let user = {user_id: request.body.user_id, 'fcm.token' : request.body.token, 'fcm.status': true}
    let updateFcm =  { $set: { 'fcm.$.status' : false }};
    Fcm.findOneAndUpdate(user, updateFcm, {new : true}, (err, fcm)=>{
        if(err){return next(err); }
        if(fcm){
            console.log('status updated successfully directly');
            response.send(fcm);
        }else{
            response.send('already logged out no problem');
        }
    });
};