


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
const http = require('http');
const https = require('https'); // ✅ Added for HTTPS
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const helmet = require("helmet");
const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs"); // 📁 File system for log dir
const morgan = require("morgan"); // 📥 HTTP request logger
const rfs = require("rotating-file-stream"); // 🔁 For rotating logs

const logger = require("./api/utils/logger");  // 🔐 Winston audit logger
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
// const allowedOrigins = process.env.URL?.split(",").map(origin => origin.trim());
const allowedOrigins = process.env.CLIENT_URL?.split(",").map(origin => origin.trim()); // ✅ Updated: Use CLIENT_URL from .env

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

//  JSON parsing
app.use(express.json());

//  Sanitize against NoSQL injection
app.use(mongoSanitize());

//  Prevent XSS attacks
app.use(xss());

// Secure Session Management

//Globally enables session handling for all incoming requests.
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,    //  Don't resave unchanged sessions
    saveUninitialized: false, //  Don't save blank sessions
    store: MongoStore.create({
      mongoUrl:
        process.env.NODE_ENV === "test"
          ? process.env.MONGO_DB_REMOTE_TEST
          : process.env.MONGO_DB_REMOTE,
      ttl: 15 * 60,
    }),
    cookie: {
      httpOnly: true,// 	Cookie cannot be accessed via JavaScript,	Prevents XSS
      secure: process.env.NODE_ENV === "production", //Only sent over HTTPS in production	Prevents theft over HTTP
      sameSite: "Strict",  // Cookie only sent from same-origin requests	,Prevents CSRF
      maxAge: 15 * 60 * 1000 // Session auto-expires in 15 mins	,Prevents long-living sessions
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

  // ✅ Setup HTTPS server using self-signed or real certificates
  const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, "certs", "key.pem")),      // 🔐 SSL private key
    cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem")),    // 🔐 SSL certificate
  };
  

  // ✅ Return HTTPS server instance
  const secureServer = https.createServer(sslOptions, app);
  return secureServer;

  // ❗ Optional: Setup HTTP fallback redirection to HTTPS
  // const httpServer = http.createServer((req, res) => {
  //   res.writeHead(301, { Location: "https://" + req.headers.host + req.url });
  //   res.end();
  // }).listen(80);
};
