const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:true,
    },
    lastName: {
        type:String,
        required:true,
    },
    emailId: {
        type:String,
        required: true,
        unique: true,
        trim:true,
        lowercase:true,
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type:Number,
    },
    gender:{
        type:String,
        validate(value){
            if(!["men","female","others"].includes(value)) {
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl:{
        type:String,
        default:""
    },
    about:{
        type:String,
        default:"This is default about the user"
    },
    skills:{
        type:[String]
    }
}, {
    timestamps:true
});

module.exports = mongoose.model("User",UserSchema);