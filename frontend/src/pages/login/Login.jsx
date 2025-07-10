

// import { useNavigate } from "react-router-dom";
// import axios from "../../axios";
// import React, { useContext, useEffect, useState } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { Field, Form, Formik } from "formik";
// import toast from "react-hot-toast";
// import { AuthContext } from "../../context/authContext";
// import Header from "../../components/Header";

// function Login() {
//   const navigate = useNavigate();
//   const { isAuthenticated, setIsAuthenticated, setUserDetails } = useContext(AuthContext);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleFormSubmit = async (values) => {
//     try {
//       const response = await axios.post("users/login", values);
//       if (response.data.success) {
//         localStorage.setItem("_hw_userDetails", JSON.stringify(response.data.data));
//         localStorage.setItem("_hw_token", response.data.data.token);
//         setUserDetails(response.data.data);
//         toast.success("Login Successful");
//         setTimeout(() => {
//           setIsAuthenticated(true);
//           if (
//             response.data.data.role.includes("admin") ||
//             response.data.data.role.includes("super-admin")
//           ) {
//             navigate("/dashboard");
//           } else {
//             navigate("/");
//           }
//         }, 400);
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       toast.error(error?.response?.data?.msg || "Failed To Login");
//     }
//   };

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/");
//     }
//   }, [isAuthenticated, navigate]);

//   return (
//     <>
//       <Header />
//       <div className="flex flex-col min-h-screen pt-20">
//         <div className="flex flex-grow">
//           {/* Left Side - Full Screen Image */}
//           <div
//             className="w-full lg:w-1/2 bg-cover bg-center"
//             style={{
//               backgroundImage:
//                 "url('https://images.unsplash.com/photo-1606660265514-358ebbadc80d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1575&q=80')",
//             }}
//           ></div>

//           {/* Right Side - Login Form */}
//           <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-gray-800">
//             <div className="w-full max-w-md px-6 py-8">
//               <div className="flex justify-center">
//                 <img
//                   className="w-auto h-7 sm:h-8"
//                   src="https://merakiui.com/images/logo.svg"
//                   alt="Logo"
//                 />
//               </div>
//               <p className="mt-3 text-xl text-center text-gray-600 dark:text-gray-200">
//                 Welcome back!
//               </p>
//               <Formik
//                 initialValues={{
//                   email: "",
//                   password: "",
//                 }}
//                 onSubmit={handleFormSubmit}
//               >
//                 {(props) => (
//                   <Form>
//                     <div className="mt-4">
//                       <label
//                         className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
//                         htmlFor="LoggingEmailAddress"
//                       >
//                         Email Address
//                       </label>
//                       <Field
//                         id="LoggingEmailAddress"
//                         name="email"
//                         type="email"
//                         className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
//                         placeholder="Enter your email"
//                       />
//                     </div>
//                     <div className="mt-4">
//                       <label
//                         className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
//                         htmlFor="loggingPassword"
//                       >
//                         Password
//                       </label>
//                       <div className="relative">
//                         <Field
//                           id="loggingPassword"
//                           name="password"
//                           type={showPassword ? "text" : "password"} // ✅ Fixes password visibility toggle
//                           className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
//                           placeholder="Enter your password"
//                         />
//                         <button
//                           type="button"
//                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400"
//                           onClick={() => setShowPassword(!showPassword)}
//                         >
//                           {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
//                         </button>
//                       </div>
//                     </div>

//                     {/* Forgot Password Link */}
//                     <div className="mt-2 text-right">
//                       <button
//                         type="button"
//                         onClick={() => navigate("/forgot-password")}
//                         className="text-sm text-blue-500 hover:underline"
//                       >
//                         Forgot Password?
//                       </button>
//                     </div>

//                     <div className="mt-6">
//                       <button
//                         type="submit"
//                         className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
//                       >
//                         Sign In
//                       </button>
//                     </div>
//                   </Form>
//                 )}
//               </Formik>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Login;


import { useNavigate } from "react-router-dom";
import axios from "../../axios";
import React, { useContext, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Field, Form, Formik } from "formik";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/authContext";
import Header from "../../components/Header";

function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, setUserDetails } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.post("users/login", values);
      if (response.data.success) {
        localStorage.setItem("_hw_userDetails", JSON.stringify(response.data.data));
        localStorage.setItem("_hw_token", response.data.data.token);
        setUserDetails(response.data.data);
        toast.success("Login Successful");
        setTimeout(() => {
          setIsAuthenticated(true);
          if (
            response.data.data.role.includes("admin") ||
            response.data.data.role.includes("super-admin")
          ) {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        }, 400);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error?.response?.data?.msg || "Failed To Login");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen pt-20">
        <div className="flex flex-grow">
          {/* Left Side - Full Screen Image */}
          <div
            className="w-full lg:w-1/2 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1606660265514-358ebbadc80d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1575&q=80')",
            }}
          ></div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-gray-800">
            <div className="w-full max-w-md px-6 py-8">
              <div className="flex justify-center">
                <img
                  className="w-auto h-7 sm:h-8"
                  src="https://merakiui.com/images/logo.svg"
                  alt="Logo"
                />
              </div>
              <p className="mt-3 text-xl text-center text-gray-600 dark:text-gray-200">
                Welcome back!
              </p>
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                }}
                onSubmit={handleFormSubmit}
              >
                {(props) => (
                  <Form>
                    <div className="mt-4">
                      <label
                        className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
                        htmlFor="LoggingEmailAddress"
                      >
                        Email Address
                      </label>
                      <Field
                        id="LoggingEmailAddress"
                        name="email"
                        type="email"
                        className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="mt-4">
                      <label
                        className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
                        htmlFor="loggingPassword"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <Field
                          id="loggingPassword"
                          name="password"
                          type={showPassword ? "text" : "password"} 
                          className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="mt-2 text-right">
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <div className="mt-6">
                      <button
                        type="submit"
                        className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                      >
                        Sign In
                      </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-4 text-center">
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={() => navigate("/signup")}
                          className="text-blue-500 hover:underline"
                        >
                          Sign Up
                        </button>
                      </p>
                    </div>

                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
