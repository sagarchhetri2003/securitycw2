const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
const User = require("./api/models/User");
const http = require('http'); // Add http module
require("dotenv").config();

// middleware using cors
const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Origin:", origin);
      const allowedOrigins = process.env.URL.split(',');

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);

app.use(express.json());

async function connectionDB(app) {
  try {
    await mongoose.connect(
      process.env.NODE_ENV === "test" ? process.env.MONGO_DB_REMOTE_TEST : process.env.MONGO_DB_REMOTE
    );

    // Check if there are no superAdmins in the database
    console.log("Mongodb connected successfully!", process.env.NODE_ENV === "test" ? process.env.MONGO_DB_REMOTE_TEST : process.env.MONGO_DB_REMOTE);

    const superAdminExists = await User.exists({ role: 'super-admin' });
    if (!superAdminExists) {
      // Create a superAdmin user
      const superAdminData = {
        name: "Super Admin",
        email: "superadmin@gmail.com",
        password: "$2a$10$ftbcHodcZtWQ0Bp9gfDZe.cCi6yetoKTL0zVQVHuOtmq4MsJ44g2y", //password
        role: "super-admin"
      };

      await User.create(superAdminData);
      console.log("SuperAdmin created successfully!");
    }
  } catch (error) {
    console.log("Error connecting to MongoDB: " + error);
  }
}

module.exports.initializeApp = async () => {
  await connectionDB();
  app.use(express.static(path.join(__dirname, '/')));

  app.use('/', require('./api/routes/index'));

  // Create and return the HTTP server
  const server = http.createServer(app); 
  return server;
};
