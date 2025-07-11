


// const jwt = require("jsonwebtoken");
// const httpStatus = require("http-status");
// const userModel = require("../models/User");

// // Decode JWT from Authorization header
// const decodeToken = (authorization) => {
//   try {
//     const token = authorization.split(" ")[1];
//     return jwt.verify(token, process.env.JWT_SECRET);
//   } catch (error) {
//     return null;
//   }
// };

// // Fetch user from DB
// const getUser = async (userId) => {
//   try {
//     return await userModel.findById(userId).select("-password").lean();
//   } catch (error) {
//     return null;
//   }
// };

// // Send unauthorized response
// const handleUnauthorizedAccess = (res) => {
//   return res
//     .status(httpStatus.UNAUTHORIZED)
//     .json({ success: false, message: "Unauthorized access" });
// };

// // ✅ Middleware to verify either session OR token
// const verifyUser = async (req, res, next) => {
//   try {
//     let userId;

//     // 🔐 Check session-based login
//     if (req.session && req.session.userId) {
//       userId = req.session.userId;
//     }

//     // 🔐 If no session, check JWT from Authorization header
//     else if (req.headers.authorization) {
//       const decoded = decodeToken(req.headers.authorization);
//       if (decoded) {
//         userId = decoded.userId;
//       }
//     }

//     // ❌ Neither session nor token present
//     if (!userId) return handleUnauthorizedAccess(res);

//     // ✅ Fetch user from DB
//     const user = await getUser(userId);
//     if (!user) return handleUnauthorizedAccess(res);

//     req.user = user;
//     next();

//   } catch (error) {
//     return handleUnauthorizedAccess(res);
//   }
// };

// // ✅ RBAC middleware (check user role)
// const verifyAuthorization = (...allowedRoles) => {
//   return (req, res, next) => {
//     const userRole = req.user?.role;
//     if (!userRole || !allowedRoles.includes(userRole)) {
//       return handleUnauthorizedAccess(res);
//     }
//     next();
//   };
// };

// module.exports = {
//   verifyUser,
//   verifyAuthorization
// };


const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const userModel = require("../models/User");

// 🔍 Decode JWT from Authorization header
const decodeToken = (authorization) => {
  try {
    const token = authorization.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return null;
  }
};

// 🔍 Fetch user from DB by ID
const getUser = async (userId) => {
  try {
    return await userModel.findById(userId).select("-password").lean();
  } catch (error) {
    console.error("User fetch failed:", error.message);
    return null;
  }
};

// ❌ Return unauthorized access
const handleUnauthorizedAccess = (res, msg = "Unauthorized access") => {
  return res
    .status(httpStatus.UNAUTHORIZED)
    .json({ success: false, message: msg });
};

// ✅ Middleware: Verify session OR token
const verifyUser = async (req, res, next) => {
  try {
    let userId = null;

    // ✅ 1. Check for active session
    if (req.session?.userId) {
      userId = req.session.userId;
    }

    // ✅ 2. Check for JWT token in Authorization header
    else if (req.headers.authorization?.startsWith("Bearer ")) {
      const decoded = decodeToken(req.headers.authorization);
      if (decoded?.userId) {
        userId = decoded.userId;
      }
    }

    // ❌ 3. Neither session nor valid token found
    if (!userId) return handleUnauthorizedAccess(res);

    // ✅ 4. Fetch user from DB
    const user = await getUser(userId);
    if (!user) return handleUnauthorizedAccess(res, "User not found");

    req.user = user;
    next();

  } catch (error) {
    console.error("verifyUser error:", error);
    return handleUnauthorizedAccess(res);
  }
};

// ✅ Middleware: Role-based authorization
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
