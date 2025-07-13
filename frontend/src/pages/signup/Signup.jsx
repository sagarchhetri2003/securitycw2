


// import { Link, useNavigate } from 'react-router-dom';
// import axios from '../../axios';
// import React, { useState } from 'react';
// import { Field, Form, Formik } from 'formik';
// import * as yup from 'yup';
// import FieldError from '../../components/FieldError';
// import toast from 'react-hot-toast';
// import Header from '../../components/Header';
// import { FiEye, FiEyeOff } from 'react-icons/fi';

// function Signup() {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const validationSchema = yup.object({
//     name: yup.string().required('This field is required'),
//     email: yup
//       .string()
//       .required('This field is required')
//       .email('Invalid email format'),
//     mobile_no: yup
//       .string()
//       .required('Phone number is required')
//       .matches(/^[9]\d{9}$/, 'Invalid phone number'),
//     password: yup
//       .string()
//       .required('Password is required')
//       .min(8, 'Minimum 8 characters')
//       .matches(/[A-Z]/, 'At least one uppercase letter')
//       .matches(/[a-z]/, 'At least one lowercase letter')
//       .matches(/[0-9]/, 'At least one number')
//       .matches(/[@$!%*?&]/, 'At least one special character'),
//     confirmpassword: yup
//       .string()
//       .required('Please confirm your password')
//       .oneOf([yup.ref('password')], 'Passwords must match'),
//   });




// const handleFormSubmit = async (values, { resetForm }) => {
//   try {
//     const data = {
//       name: values.name.trim(),
//       email: values.email.trim(),
//       mobile_no: values.mobile_no.trim(),
//       password: values.password,
//     };

//     const response = await axios.post('/users/register', data);

//     if (response.data.success) {
//       toast.success('Registration successful. OTP sent to email.');
//       resetForm();
//       navigate('/verify-otp', { state: { email: data.email } }); // ✅ go to OTP page
//     }

//   } catch (error) {
//     console.error('Signup error:', error);
//     toast.error(error.response?.data?.msg || 'Registration failed');
//   }
// };


//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />

//       <div className="flex flex-grow">
//         <div
//           className="hidden lg:block w-1/2 bg-cover bg-center"
//           style={{
//             backgroundImage:
//               "url('https://images.unsplash.com/photo-1606660265514-358ebbadc80d?auto=format&fit=crop&w=1575&q=80')",
//           }}
//         />

//         <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-gray-800 px-6 py-10">
//           <div className="w-full max-w-md">
//             <div className="flex justify-center mb-4">
//               <img className="w-auto h-20" src="logo.png" alt="Logo" />
//             </div>

//             <div className="flex items-center justify-center">
//               <Link
//                 to="/login"
//                 className="w-1/3 pb-4 text-center text-gray-500 border-b"
//               >
//                 Sign In
//               </Link>
//               <span className="w-1/3 pb-4 text-center text-gray-800 border-b-2 border-blue-500">
//                 Sign Up
//               </span>
//             </div>

//             <Formik
//               initialValues={{
//                 name: '',
//                 email: '',
//                 mobile_no: '',
//                 password: '',
//                 confirmpassword: '',
//               }}
//               validationSchema={validationSchema}
//               onSubmit={handleFormSubmit}
//             >
//               {({ touched, errors }) => (
//                 <Form className="mt-6 space-y-4">
//                   <div>
//                     <Field
//                       name="name"
//                       type="text"
//                       placeholder="Your Name"
//                       className="w-full px-4 py-3 border rounded-lg"
//                     />
//                     <FieldError message={touched.name && errors.name} />
//                   </div>

//                   <div>
//                     <Field
//                       name="mobile_no"
//                       type="text"
//                       placeholder="Your Contact Number"
//                       className="w-full px-4 py-3 border rounded-lg"
//                     />
//                     <FieldError message={touched.mobile_no && errors.mobile_no} />
//                   </div>

//                   <div>
//                     <Field
//                       name="email"
//                       type="email"
//                       placeholder="Your Email"
//                       className="w-full px-4 py-3 border rounded-lg"
//                     />
//                     <FieldError message={touched.email && errors.email} />
//                   </div>

//                   {/* Password field with eye toggle */}
//                   <div className="relative">
//                     <Field
//                       name="password"
//                       type={showPassword ? 'text' : 'password'}
//                       placeholder="Password"
//                       className="w-full px-4 py-3 border rounded-lg pr-12"
//                     />
//                     <div
//                       className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <FiEyeOff /> : <FiEye />}
//                     </div>
//                     <FieldError message={touched.password && errors.password} />
//                   </div>

//                   {/* Confirm Password field with eye toggle */}
//                   <div className="relative">
//                     <Field
//                       name="confirmpassword"
//                       type={showConfirm ? 'text' : 'password'}
//                       placeholder="Confirm Password"
//                       className="w-full px-4 py-3 border rounded-lg pr-12"
//                     />
//                     <div
//                       className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
//                       onClick={() => setShowConfirm(!showConfirm)}
//                     >
//                       {showConfirm ? <FiEyeOff /> : <FiEye />}
//                     </div>
//                     <FieldError
//                       message={touched.confirmpassword && errors.confirmpassword}
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize bg-gray-800 rounded-lg hover:bg-gray-700"
//                   >
//                     Sign Up
//                   </button>
//                 </Form>
//               )}
//             </Formik>

//             <div className="mt-6 text-center">
//               <Link
//                 to="/login"
//                 className="inline-block text-sm text-blue-600 hover:underline"
//               >
//                 Already have an account? Log in
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Signup;

import { Link, useNavigate } from 'react-router-dom';
// import axios from '../../axios';
import api from '../../axios'; //  uses your secure axios instance

import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import FieldError from '../../components/FieldError';
import toast from 'react-hot-toast';
import Header from '../../components/Header';
import { FiEye, FiEyeOff } from 'react-icons/fi';

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
  
    if (score <= 2) return 'Weak';
    if (score === 3 || score === 4) return 'Moderate';
    return 'Strong';
  };
  
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const validationSchema = yup.object({
  name: yup.string().required('This field is required'),
  email: yup
    .string()
    .required('This field is required')
    .email('Invalid email format'),
  mobile_no: yup
    .string()
    .required('Phone number is required')
    .matches(/^[9]\d{9}$/, 'Invalid phone number (must start with 9 and be 10 digits)'),
  password: yup
    .string()
    .required('Password is required')
    .matches(strongRegex, {
      message:
        'Password must include uppercase, lowercase, number, symbol & be 8+ characters',
    }),
  confirmpassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});


  // const handleFormSubmit = async (values, { resetForm }) => {
  //   try {
  //     const data = {
  //       name: values.name.trim(),
  //       email: values.email.trim(),
  //       mobile_no: values.mobile_no.trim(),
  //       password: values.password,
  //     };

  //     const response = await axios.post('/users/register', data);

  //     if (response.data.success) {
  //       toast.success('Registration successful. OTP sent to email.');
  //       resetForm();
  //       navigate('/verify-otp', { state: { email: data.email } });
  //     }
  //   } catch (error) {
  //     console.error('Signup error:', error);
  //     toast.error(error.response?.data?.msg || 'Registration failed');
  //   }
  // };
  const handleFormSubmit = async (values, { resetForm }) => {
    const data = {
      name: values.name.trim(),
      email: values.email.trim(),
      mobile_no: values.mobile_no.trim(),
      password: values.password,
    };
  
    try {
      const response = await api.post("/users/register", data);
  
      if (response.data.success) {
        toast.success("Registration successful. OTP sent to email.");
        resetForm();
        navigate("/verify-otp", { state: { email: data.email } });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-grow">
        <div
          className="hidden lg:block w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1606660265514-358ebbadc80d?auto=format&fit=crop&w=1575&q=80')" }}
        />
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-gray-800 px-6 py-10">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-4">
              <img className="w-auto h-20" src="logo.png" alt="Logo" />
            </div>
            <div className="flex items-center justify-center">
              <Link to="/login" className="w-1/3 pb-4 text-center text-gray-500 border-b">
                Sign In
              </Link>
              <span className="w-1/3 pb-4 text-center text-gray-800 border-b-2 border-blue-500">
                Sign Up
              </span>
            </div>

            <Formik
              initialValues={{
                name: '',
                email: '',
                mobile_no: '',
                password: '',
                confirmpassword: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
            >
              {({ touched, errors, values, setFieldValue }) => (
                <Form className="mt-6 space-y-4">
                  <div>
                    <Field name="name" type="text" placeholder="Your Name" className="w-full px-4 py-3 border rounded-lg" />
                    <FieldError message={touched.name && errors.name} />
                  </div>
                  <div>
                    <Field name="mobile_no" type="text" placeholder="Your Contact Number" className="w-full px-4 py-3 border rounded-lg" />
                    <FieldError message={touched.mobile_no && errors.mobile_no} />
                  </div>
                  <div>
                    <Field name="email" type="email" placeholder="Your Email" className="w-full px-4 py-3 border rounded-lg" />
                    <FieldError message={touched.email && errors.email} />
                  </div>
                  {/* Password field with strength */}
                  <div className="relative">
                    <Field
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      className="w-full px-4 py-3 border rounded-lg pr-12"
                      onChange={(e) => {
                        setFieldValue('password', e.target.value);
                        setPasswordStrength(getPasswordStrength(e.target.value));
                      }}
                    />
                    <div
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </div>
                    <FieldError message={touched.password && errors.password} />
                    {values.password && (
                      <p className={`text-sm mt-1 ${passwordStrength === 'Strong'
                        ? 'text-green-600'
                        : passwordStrength === 'Moderate'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                        }`}>
                        Strength: {passwordStrength}
                      </p>
                    )}
                  </div>
                  {/* Confirm Password field */}
                  <div className="relative">
                    <Field
                      name="confirmpassword"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      className="w-full px-4 py-3 border rounded-lg pr-12"
                    />
                    <div
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <FiEyeOff /> : <FiEye />}
                    </div>
                    <FieldError message={touched.confirmpassword && errors.confirmpassword} />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize bg-gray-800 rounded-lg hover:bg-gray-700"
                  >
                    Sign Up
                  </button>
                </Form>
              )}
            </Formik>

            <div className="mt-6 text-center">
              <Link to="/login" className="inline-block text-sm text-blue-600 hover:underline">
                Already have an account? Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
