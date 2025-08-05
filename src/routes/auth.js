const express = require("express");
const User = require("../models/user")
const authRouter = express.Router();
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {

    try {
        const { name, emailId, password, dob, gender } = req.body;

        const hassedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            emailId,
            password: hassedPassword,
            dob,
            gender
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