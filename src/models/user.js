const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:true,
        minLength: 4,
        maxLength: 15,
    },
     lastName: {
        type: String,
        required:true,
        maxLength: 15,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Strong password required");
            }
        }
    },
    dob: {
        type: Date,
        // required: true,
        validate(value) {
            if (value > new Date()) {
                throw new Error("Date of birth cannot be in the future");
            }
        }
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        enum: {
            values:["male","female","other"],
            message:`{VALUE} is not a valid gender type.`,
        },
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid")
            }
        }
    },
    about: {
        type: String,
        default: "This is default about the user"
    },
    photoUrl: {
        type: String,
    },
    skills: {
        type: [String],
    },

}, {
    timestamps: true
});

//mongoose schema methods//

UserSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "#devTinder!123", {
        expiresIn: '7d',
    });
    return token;
};
UserSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const hassedPassword = user.password
    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        hassedPassword
    );

    return isPasswordValid;
}

module.exports = mongoose.model("User", UserSchema);