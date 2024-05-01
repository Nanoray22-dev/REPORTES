const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: {type:String, unique:true},
    password: String,
    email: { type: String, required: false }, 
    address: { type: String, required: false }, 
    phone: { type: String, required: false }, 
    age: { type: Number, required: false }, 
    residenceType: { 
        type: String, 
        enum: ['apartamento', 'casa', 'duplex', 'no residente'], 
        required: false 
    },

},{timestamps: true})

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;