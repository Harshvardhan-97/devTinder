const express = require("express");
const User = require("../models/user")
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { validateSignupData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {

    try {
        validateSignupData(req);
        const { firstName,lastName, emailId, password, age, photoUrl,skills } = req.body;

        const hassedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hassedPassword,
            age,
            photoUrl,
            skills
        })
        await user.save();
        res.status(201).json({ message: "User created successfully" });

    } catch (err) {
        res.status(400).send("ERROR :" + err.message)
    }

});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credentials")
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            res.status(200).json({ message: "Login successfully", token: token });
        }
        else {
            throw new Error("Invalid credentials")
        }

    } catch (err) {
        res.status(400).send("ERROR :" + err.message)
    }
});



module.exports = authRouter;