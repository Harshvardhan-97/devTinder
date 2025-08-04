const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://Harsh:6X7duh6jO948tb1W@cluster0.xxfbjwd.mongodb.net/fitnessApp")
}
module.exports = connectDB