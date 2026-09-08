require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./src/models/User");

const email = "ruby@gmail.com";

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      console.log("User not found:", email);
      process.exit(1);
    }

    user.role = "admin";
    await user.save();

    console.log("Admin role assigned successfully.");
    console.log("Admin:", user.email);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

makeAdmin();