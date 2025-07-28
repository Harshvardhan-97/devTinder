const express = require("express");

const app = express();

const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.post('/signup', async (req, res) => {
    const emailId = req.body.emailId;
    console.log(emailId)

    try {
        const existingEmail = await User.findOne({ emailId: emailId });
        if (existingEmail) {
            return res.status(400).send("EmailId already exits!")
        }
        const user = new User(req.body);
        console.log(user)
        await user.save();
        res.status(201).send("User created successfully")
    } catch (err) {
        console.log("err", err)
        res.status(400).send("Something went wrong")
    }
});

app.delete('/deleteAll', async (req, res) => {
    try {
        await User.deleteMany({});
        res.status(200).send("all user deleted")
    } catch (err) {
        res.status(400).send(err.errmsg)
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