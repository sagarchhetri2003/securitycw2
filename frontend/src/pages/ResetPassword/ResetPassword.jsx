


// import React, { useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import axios from "../../axios";
// import toast from "react-hot-toast";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const ResetPassword = () => {
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token"); // Extract token from URL
//   const [newPassword, setNewPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("/users/reset-password", { token, newPassword });
//       toast.success(response.data.message);
//       navigate("/login");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to reset password.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 px-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
//         <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">🔒 Reset Password</h2>
//         <p className="text-gray-600 text-center mb-6">
//           Enter a new password to regain access to your account.
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="relative">
//             <label className="block text-gray-700 font-medium">New Password</label>
//             <input
//               type={showPassword ? "text" : "password"}
//               required
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter new password"
//             />
//             {/* Eye Icon for Toggling Password Visibility */}
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute top-9 right-4 text-gray-500"
//             >
//               {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
//             </button>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
//           >
//             Reset Password
//           </button>
//         </form>

//         <div className="text-center mt-4">
//           <button
//             onClick={() => navigate("/login")}
//             className="text-blue-600 hover:underline text-sm"
//           >
//             Back to Login
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;


// import React, { useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import axios from "../../axios";
// import toast from "react-hot-toast";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// // ✅ Password strength checker
// const validateStrongPassword = (password) => {
//   const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
//   return strongRegex.test(password);
// };

// const ResetPassword = () => {
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token"); // Extract token from URL
//   const [newPassword, setNewPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateStrongPassword(newPassword)) {
//       toast.error("Password must include uppercase, lowercase, number, symbol & be at least 8 characters");
//       return;
//     }

//     try {
//       const response = await axios.post("/users/reset-password", { token, newPassword });
//       toast.success(response.data.message);
//       navigate("/login");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to reset password.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 px-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
//         <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">🔒 Reset Password</h2>
//         <p className="text-gray-600 text-center mb-6">
//           Enter a new password to regain access to your account.
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="relative">
//             <label className="block text-gray-700 font-medium">New Password</label>
//             <input
//               type={showPassword ? "text" : "password"}
//               required
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter new password"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute top-9 right-4 text-gray-500"
//             >
//               {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
//             </button>
//             {/* Live validation hint */}
//             {!validateStrongPassword(newPassword) && newPassword.length > 0 && (
//               <p className="text-red-500 text-sm mt-1">
//                 Must include uppercase, lowercase, number, symbol & be 8+ characters
//               </p>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
//           >
//             Reset Password
//           </button>
//         </form>

//         <div className="text-center mt-4">
//           <button
//             onClick={() => navigate("/login")}
//             className="text-blue-600 hover:underline text-sm"
//           >
//             Back to Login
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;

import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../../axios";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Password strength validator
const validateStrongPassword = (password) => {
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  return strongRegex.test(password);
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const tokenFromLink = searchParams.get("token");
  const isResetViaLink = !!tokenFromLink;

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [show, setShow] = useState({ old: false, new: false });

  const token = isResetViaLink ? tokenFromLink : localStorage.getItem("token");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStrongPassword(newPassword)) {
      toast.error("Password must include uppercase, lowercase, number, symbol & be at least 8 characters");
      return;
    }

    try {
      if (isResetViaLink) {
        // Reset password using token from email
        const res = await axios.post("/users/reset-password", { token, newPassword });
        toast.success(res.data.message);
        navigate("/login");
      } else {
        // Change password for logged-in user
        const res = await axios.put(
          "/user/change-password",
          { oldpassword: oldPassword, newpassword: newPassword },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(res.data.msg);
        navigate("/profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          {isResetViaLink ? "🔒 Reset Password" : "🔐 Change Password"}
        </h2>
        <p className="text-gray-600 text-center mb-6">
          {isResetViaLink
            ? "Enter a new password to regain access to your account."
            : "Change your current password for better security."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Show old password only for logged-in users */}
          {!isResetViaLink && (
            <div className="relative">
              <label className="block text-gray-700 font-medium">Old Password</label>
              <input
                type={show.old ? "text" : "password"}
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter old password"
              />
              <button
                type="button"
                onClick={() => setShow({ ...show, old: !show.old })}
                className="absolute top-9 right-4 text-gray-500"
              >
                {show.old ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          )}

          {/* New password input */}
          <div className="relative">
            <label className="block text-gray-700 font-medium">New Password</label>
            <input
              type={show.new ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShow({ ...show, new: !show.new })}
              className="absolute top-9 right-4 text-gray-500"
            >
              {show.new ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
            {!validateStrongPassword(newPassword) && newPassword.length > 0 && (
              <p className="text-red-500 text-sm mt-1">
                Must include uppercase, lowercase, number, symbol & be 8+ characters
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            {isResetViaLink ? "Reset Password" : "Change Password"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate(isResetViaLink ? "/login" : "/profile")}
            className="text-blue-600 hover:underline text-sm"
          >
            {isResetViaLink ? "Back to Login" : "Back to Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
