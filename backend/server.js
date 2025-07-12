// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require('path');
// const User = require("./api/models/User");
// const http = require('http'); // Add http module
// require("dotenv").config();

// // middleware using cors
// const app = express();

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       console.log("Origin:", origin);
//       const allowedOrigins = process.env.URL.split(',');

//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true
//   })
// );

// app.use(express.json());

// async function connectionDB(app) {
//   try {
//     await mongoose.connect(
//       process.env.NODE_ENV === "test" ? process.env.MONGO_DB_REMOTE_TEST : process.env.MONGO_DB_REMOTE
//     );

//     // Check if there are no superAdmins in the database
//     console.log("Mongodb connected successfully!", process.env.NODE_ENV === "test" ? process.env.MONGO_DB_REMOTE_TEST : process.env.MONGO_DB_REMOTE);

//     const superAdminExists = await User.exists({ role: 'super-admin' });
//     if (!superAdminExists) {
//       // Create a superAdmin user
//       const superAdminData = {
//         name: "Super Admin",
//         email: "superadmin@gmail.com",
//         password: "$2a$10$ftbcHodcZtWQ0Bp9gfDZe.cCi6yetoKTL0zVQVHuOtmq4MsJ44g2y", //password
//         role: "super-admin"
//       };

//       await User.create(superAdminData);
//       console.log("SuperAdmin created successfully!");
//     }
//   } catch (error) {
//     console.log("Error connecting to MongoDB: " + error);
//   }
// }

// module.exports.initializeApp = async () => {
//   await connectionDB();
//   app.use(express.static(path.join(__dirname, '/')));

//   app.use('/', require('./api/routes/index'));

//   // Create and return the HTTP server
//   const server = http.createServer(app); 
//   return server;
// };


// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require('path');
// const http = require('http');
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
// const helmet = require("helmet");
// const dotenv = require("dotenv");
// dotenv.config();

// const User = require("./api/models/User");

// const app = express();

// // 🛡️ Apply Helmet for basic security headers
// app.use(helmet());

// // 🔒 Additional custom headers
// app.use((req, res, next) => {
//   res.setHeader("X-Content-Type-Options", "nosniff");
//   res.setHeader("X-Frame-Options", "DENY");
//   res.setHeader("Cache-Control", "no-store");
//   next();
// });

// // ✅ Setup allowed origins
// const allowedOrigins = process.env.URL?.split(",").map(origin => origin.trim());
// console.log("✅ Allowed origins from .env:", allowedOrigins);

// // 🌐 CORS Configuration
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       console.log("🌐 Incoming request origin:", origin);
      
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         console.error("❌ CORS blocked origin:", origin);
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// // 🧠 JSON parsing
// app.use(express.json());

// // 🔐 Secure Session Management
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl:
//         process.env.NODE_ENV === "test"
//           ? process.env.MONGO_DB_REMOTE_TEST
//           : process.env.MONGO_DB_REMOTE,
//       ttl: 15 * 60,
//     }),
//     cookie: {
//       httpOnly: true,                     // ✅ Prevents JavaScript from accessing cookies
//       secure: process.env.NODE_ENV === "production", // ✅ Use secure cookies only in production
//       sameSite: "Strict",                 // ✅ Prevents CSRF
//       maxAge: 15 * 60 * 1000              // ⏳ 15 minutes
//     }
    
//   })
// );

// // 🛢️ MongoDB and SuperAdmin
// async function connectionDB() {
//   try {
//     await mongoose.connect(
//       process.env.NODE_ENV === "test"
//         ? process.env.MONGO_DB_REMOTE_TEST
//         : process.env.MONGO_DB_REMOTE
//     );

//     console.log("✅ MongoDB connected successfully!");

//     const superAdminExists = await User.exists({ role: "super-admin" });

//     if (!superAdminExists) {
//       const superAdminData = {
//         name: "Super Admin",
//         email: "superadmin@gmail.com",
//         password: "$2a$10$ftbcHodcZtWQ0Bp9gfDZe.cCi6yetoKTL0zVQVHuOtmq4MsJ44g2y",//password
//         role: "super-admin",
//       };

//       await User.create(superAdminData);
//       console.log("👑 SuperAdmin created successfully!");
//     }
//   } catch (error) {
//     console.log("❌ Error connecting to MongoDB: " + error);
//   }
// }

// // 🏁 Initialize and return server
// module.exports.initializeApp = async () => {
//   await connectionDB();

//   app.use(express.static(path.join(__dirname, "/")));

//   app.use("/", require("./api/routes/index"));

//   const server = http.createServer(app);
//   return server;
// };



const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
const http = require('http');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const helmet = require("helmet");
const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs"); // 📁 File system for log dir
const morgan = require("morgan"); // 📥 HTTP request logger
const rfs = require("rotating-file-stream"); // 🔁 For rotating logs

const logger = require("./utils/logger"); // 🔐 Winston audit logger
const User = require("./api/models/User");

const app = express();

// 🛡️ Apply Helmet for basic security headers
app.use(helmet());

// 🔒 Additional custom headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Cache-Control", "no-store");
  next();
});

// ✅ Setup allowed origins
const allowedOrigins = process.env.URL?.split(",").map(origin => origin.trim());
console.log("✅ Allowed origins from .env:", allowedOrigins);

// 🌐 CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🌐 Incoming request origin:", origin);
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("❌ CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// 🧠 JSON parsing
app.use(express.json());

// 🔐 Secure Session Management
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        process.env.NODE_ENV === "test"
          ? process.env.MONGO_DB_REMOTE_TEST
          : process.env.MONGO_DB_REMOTE,
      ttl: 15 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000
    }
  })
);

// 📁 Create logs directory if it doesn’t exist
const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// 📥 Create a rotating write stream for HTTP logs (rotates daily)
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: logDirectory,
});

// 📝 Morgan HTTP logging middleware
app.use(morgan("combined", { stream: accessLogStream }));

// 🛢️ MongoDB and SuperAdmin
async function connectionDB() {
  try {
    await mongoose.connect(
      process.env.NODE_ENV === "test"
        ? process.env.MONGO_DB_REMOTE_TEST
        : process.env.MONGO_DB_REMOTE
    );

    console.log("✅ MongoDB connected successfully!");

    const superAdminExists = await User.exists({ role: "super-admin" });

    if (!superAdminExists) {
      const superAdminData = {
        name: "Super Admin",
        email: "superadmin@gmail.com",
        password: "$2a$10$ftbcHodcZtWQ0Bp9gfDZe.cCi6yetoKTL0zVQVHuOtmq4MsJ44g2y", // password
        role: "super-admin",
      };

      await User.create(superAdminData);
      console.log("👑 SuperAdmin created successfully!");
    }

    // 📘 Audit log: successful DB connection & super admin check
    logger.info("MongoDB connected and SuperAdmin setup verified", {
      event: "DB_INIT",
      status: "success",
      time: new Date()
    });

  } catch (error) {
    console.log("❌ Error connecting to MongoDB: " + error);

    // 🔴 Audit log: DB connection failed
    logger.error("MongoDB connection failed", {
      event: "DB_INIT",
      error: error.message,
      status: "failed",
      time: new Date()
    });
  }
}

// 🏁 Initialize and return server
module.exports.initializeApp = async () => {
  await connectionDB();

  app.use(express.static(path.join(__dirname, "/")));

  app.use("/", require("./api/routes/index"));

  const server = http.createServer(app);
  return server;
};
