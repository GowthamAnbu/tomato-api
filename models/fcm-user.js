const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userFcmSchema = new Schema({
    user_id:{type: String, required: true},
    // user_id:{type: Schema.Types.ObjectId},
    token:[String]
});

module.exports = mongoose.model('UserFcm',userFcmSchema);