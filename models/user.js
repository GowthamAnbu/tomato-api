const mongoose = require('mongoose'),
      encrypt = require('../utilities/encryption');

let Schema= mongoose.Schema;
let userSchema = new Schema({
    firstName: {type:String, required:true},
    lastName: {type:String, required:true},
    dob:{type:String, required:true},
    password:{type:String, required:true},
    email:{type:String, required:true,unique:true},
    mobile:{type:String, required:true},
    is_active:{type: Boolean, default: true},
    salt:{type: String}
});

userSchema.methods={
authenticate: function(passwordToMatch){ /* do not change this to fat arrow because this reference will be closed if changed*/
    return encrypt.hashpwd(this.salt, passwordToMatch) === this.password;
}/* ,
hasRole: (role) => {
    return this.role.indexOf('admin') > -1;
} */
}

module.exports = mongoose.model('user',userSchema);
