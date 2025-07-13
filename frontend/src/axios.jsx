// import axios from "axios";

// // console.log("token", localStorage.getItem("_hw_token"));

// const accessToken = localStorage.getItem("_hw_token");

// const instance = axios.create({
//   baseURL: import.meta.env.VITE_APP_BASE_URI,
//   withCredentials: true,
//   headers: {
//     Authorization: accessToken,
//   },
// });

// instance.interceptors.request.use(function (config) {
//   const token = localStorage.getItem("_hw_token");
//   config.headers.Authorization = token ? `Bearer ${token}` : "";
//   return config;
// });


// export default instance;

// import axios from "axios";

// const instance = axios.create({
//   baseURL: import.meta.env.VITE_APP_BASE_URI,
//   withCredentials: true,
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem("_hw_token") || ""}`,
//   },
// });

// instance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("_hw_token");
//   config.headers.Authorization = token ? `Bearer ${token}` : "";
//   return config;
// });

// export default instance;


import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URI,
  withCredentials: true,
});

//  Automatically attach JWT token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("_hw_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let cachedCsrfToken = null;

instance.interceptors.request.use(async (config) => {
  const method = config.method?.toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    if (!cachedCsrfToken) {
      const res = await axios.get(`${import.meta.env.VITE_APP_BASE_URI}/api/csrf-token`, {
        withCredentials: true,
      });
      cachedCsrfToken = res.data.csrfToken;
    }
    config.headers["X-CSRF-Token"] = cachedCsrfToken;
  }
  return config;
});

export default instance;
