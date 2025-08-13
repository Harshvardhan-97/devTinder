const validator = require("validator");

const validateSignupData = (req) => {

    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Name filed is required")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password")
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills"
    ];

      const isEditAllowed =  Object.keys(req.body).every((fields) => 
            allowedEditFields.includes(fields)
        )
        return isEditAllowed;
}

module.exports = {
    validateSignupData,
    validateEditProfileData,
}