require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const createAdmin = async () => {

  try {

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected"
    );


    const email =
      "admin@edulearn.com";

    const password =
      "Admin12345";


    const existingUser =
      await User.findOne({
        email
      });


    if (existingUser) {

      existingUser.role = "admin";

      await existingUser.save();

      console.log(
        "Existing user converted to admin."
      );

    } else {

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );


      await User.create({

        name: "EduLearn Admin",

        email,

        password:
          hashedPassword,

        role: "admin"

      });


      console.log(
        "Admin account created successfully."
      );

    }


    console.log(
      "Email:",
      email
    );

    console.log(
      "Password:",
      password
    );


    process.exit(0);

  } catch (error) {

    console.error(
      "Failed to create admin:",
      error.message
    );

    process.exit(1);

  }

};


createAdmin();