


// import axios from "axios";

// // Create axios instance with base URL from env
// const instance = axios.create({
//   baseURL: import.meta.env.VITE_APP_BASE_URL || "https://localhost:8000", // e.g., https://localhost:8000
//   withCredentials: true, // Important for cookies/session
// });

// let cachedCsrfToken = null;

// //  Unified interceptor: Attach JWT + CSRF in one place
// instance.interceptors.request.use(async (config) => {
//   // Attach JWT token if present
//   const token = localStorage.getItem("_hw_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   // Attach CSRF token for write operations
//   const method = config.method?.toUpperCase();
//   if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
//     if (!cachedCsrfToken) {
//       // Use instance to keep baseURL + credentials
//       const res = await instance.get("/api/csrf-token");
//       cachedCsrfToken = res.data.csrfToken;
//     }
//     config.headers["X-CSRF-Token"] = cachedCsrfToken;
//   }

//   return config;
// });

// export default instance;

import axios from "axios";

const instance = axios.create({
  baseURL: "https://localhost:8000/", // Secure backend base URL
  withCredentials: true,                 // Include cookies like session ID
});

let cachedCsrfToken = null;

instance.interceptors.request.use(async (config) => {
  // Attach JWT token from localStorage if available
  const token = localStorage.getItem("_hw_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  //  Automatically fetch and attach CSRF token for write requests
  const method = config.method?.toUpperCase();
  if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    if (!cachedCsrfToken) {
      const res = await axios.get("/csrf-token", {
        baseURL: "https://localhost:8000/api",
        withCredentials: true,
      });
      cachedCsrfToken = res.data.csrfToken;
    }
    config.headers["X-CSRF-Token"] = cachedCsrfToken;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
