

const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const userModel = require("../models/User");

//  Decode JWT from Authorization header
const decodeToken = (authorization) => {
  try {
    const token = authorization.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return null;
  }
};

//  Fetch user from DB by ID
const getUser = async (userId) => {
  try {
    return await userModel.findById(userId).select("-password").lean();
  } catch (error) {
    console.error("User fetch failed:", error.message);
    return null;
  }
};

// Return unauthorized access
const handleUnauthorizedAccess = (res, msg = "Unauthorized access") => {
  return res
    .status(httpStatus.UNAUTHORIZED)
    .json({ success: false, message: msg });
};

//  Middleware: Verify session OR token
const verifyUser = async (req, res, next) => {
  try {
    let userId = null;

    if (req.session?.userId) {  //Verifies session-based login (fallback to JWT). 
      userId = req.session.userId;
      console.log(" Session found: userId =", userId);
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      const decoded = decodeToken(req.headers.authorization);
      if (decoded?.userId) {
        userId = decoded.userId;
        console.log(" Token decoded: userId =", userId);
      } else {
        console.log(" JWT decoding failed");
      }
    }

    if (!userId) {
      console.log(" No session or token — unauthorized");
      return handleUnauthorizedAccess(res);
    }

    const user = await getUser(userId);
    if (!user) {
      console.log(" No user found in DB");
      return handleUnauthorizedAccess(res, "User not found");
    }

    console.log(" User fetched:", user.name, "| Role:", user.role);
    req.user = user;
    next();

  } catch (error) {
    console.error(" Error in verifyUser:", error);
    return handleUnauthorizedAccess(res);
  }
};


//  Middleware: Role-based authorization
const verifyAuthorization = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return handleUnauthorizedAccess(res, "Missing user role");
    }

    if (!allowedRoles.includes(userRole)) {
      return handleUnauthorizedAccess(res, "Access denied: insufficient role");
    }

    next();
  };
};

module.exports = {
  verifyUser,
  verifyAuthorization,
};
