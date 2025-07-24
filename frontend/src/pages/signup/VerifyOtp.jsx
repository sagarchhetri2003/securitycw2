


import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../axios";
import toast from "react-hot-toast";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/users/verify-otp", { email, otp });
      toast.success(response.data.message || "OTP Verified Successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP Verification Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-green-600 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">🔐 Verify Your Email</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter the OTP sent to your email to complete your registration.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Enter OTP</label>
            <input
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="6-digit OTP"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
          >
            Verify OTP
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/signup")}
            className="text-green-600 hover:underline text-sm"
          >
            Go Back to Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
