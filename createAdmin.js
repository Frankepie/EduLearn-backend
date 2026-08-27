require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline-sync");

const Admin = require("./models/Admin");

const createAdmin = async () => {

  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const name = readline.question("Admin name: ");
    const email = readline.question("Admin email: ");
    const password = readline.question(
      "Admin password: ",
      {
        hideEchoBack: true
      }
    );

    const existingAdmin = await Admin.findOne({
      email: email.toLowerCase()
    });

    if (existingAdmin) {

      console.log(
        "An admin with this email already exists."
      );

      process.exit(0);
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await Admin.create({

      name,

      email: email.toLowerCase(),

      password: hashedPassword,

      role: "admin"

    });

    console.log(
      "Admin account created successfully."
    );

    console.log(
      "Admin:", email
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