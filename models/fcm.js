const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let fcmSchema = new Schema({
    user_id:{type: String, required: true},
    // user_id:{type: Schema.Types.ObjectId},
    fcm :[{
    token: {type:String, required: true},
    status: {type: Boolean, default: true} 
    }]
});

module.exports = mongoose.model('fcm',fcmSchema);