const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth")

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {


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

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credentials")
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token,{
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

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    } catch (err) {
        res.status(400).send("ERROR :" + err.message)
    }
});

app.post("/sendConnectionRequest",userAuth, async (req, res)=> {
    try{
        const user = req.user;
        res.send(user.name + " send you a connection request")
    
    } catch (err) {
        res.status(400).send("ERROR :" + err.message)
    }
})


connectDB().then(() => {
    console.log("Database connection established");
    app.listen(3000, () => {
        console.log("server is listing:")
    })
}).catch(err => {
    console.log("error establish db connection")
})