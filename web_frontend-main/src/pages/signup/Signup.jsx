


// import { Link, useNavigate } from 'react-router-dom';
// import axios from '../../axios';
// import React from 'react';
// import { Field, Form, Formik } from 'formik';
// import * as yup from 'yup';
// import FieldError from '../../components/FieldError';
// import toast from 'react-hot-toast';
// import Header from '../../components/Header';

// function Signup() {
//   const navigate = useNavigate();

//   const validationSchema = yup.object({
//     name: yup.string().required('This Field is required'),
//     email: yup
//       .string()
//       .required('This Field is required')
//       .email('Invalid email'),
//     mobile_no: yup
//       .string()
//       .required('Phone number is required')
//       .matches(/^[9]\d{9}$/, 'Invalid phone number'),
//     password: yup
//       .string()
//       .required('Password is required')
//       .min(5, 'Your password is too short.')
//       .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
//     confirmpassword: yup
//       .string()
//       .required('Confirm Your Password')
//       .oneOf([yup.ref('password')], 'Passwords must match'),
//   });

//   const handleFormSubmit = async (values) => {
//     try {
//       const data = { ...values };
//       delete data.confirmpassword; // remove the confirm password before sending
//       const response = await axios.post('/users/register', data);
//       if (response.data.success) {
//         toast.success('Registration Successful');
//         setTimeout(() => navigate('/login'), 100);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error(error.response?.data?.msg || 'Something went wrong');
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Header at the top */}
//       <Header />

//       {/* Main content area: left image + right form */}
//       <div className="flex flex-grow">
//         {/* Left side with image */}
//         <div
//           className="hidden lg:block w-1/2 bg-cover bg-center"
//           style={{
//             backgroundImage:
//               "url('https://images.unsplash.com/photo-1606660265514-358ebbadc80d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1575&q=80')",
//           }}
//         />

//         {/* Right side with signup form */}
//         <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-gray-900 px-6 py-10">
//           <div className="w-full max-w-md">
//             {/* Logo */}
//             <div className="flex justify-center">
//               <img className="w-auto h-8" src="logo.png" alt="Logo" />
//             </div>

//             {/* Sign In / Sign Up Tabs */}
//             <div className="flex items-center justify-center mt-6">
//               <Link to="/login" className="w-1/3 pb-4 text-center text-gray-500 border-b">
//                 Sign In
//               </Link>
//               <span className="w-1/3 pb-4 text-center text-gray-800 dark:text-gray-200 border-b-2 border-blue-500">
//                 Sign Up
//               </span>
//             </div>

//             {/* Formik Form */}
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

//                   <div>
//                     <Field
//                       name="password"
//                       type="password"
//                       placeholder="Password"
//                       className="w-full px-4 py-3 border rounded-lg"
//                     />
//                     <FieldError message={touched.password && errors.password} />
//                   </div>

//                   <div>
//                     <Field
//                       name="confirmpassword"
//                       type="password"
//                       placeholder="Confirm Password"
//                       className="w-full px-4 py-3 border rounded-lg"
//                     />
//                     <FieldError message={touched.confirmpassword && errors.confirmpassword} />
//                   </div>

//                   <button
//                     type="submit"
//                     className="w-full px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-400"
//                   >
//                     Sign Up
//                   </button>
//                 </Form>
//               )}
//             </Formik>

//             {/* Already have an account? */}
//             <div className="mt-6 text-center">
//               <Link to="/login" className="text-sm text-blue-500 hover:underline">
//                 Already have an account?
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
import axios from '../../axios';
import React from 'react';
import { Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import FieldError from '../../components/FieldError';
import toast from 'react-hot-toast';
import Header from '../../components/Header';

function Signup() {
  const navigate = useNavigate();

  const validationSchema = yup.object({
    name: yup.string().required('This Field is required'),
    email: yup
      .string()
      .required('This Field is required')
      .email('Invalid email'),
    mobile_no: yup
      .string()
      .required('Phone number is required')
      .matches(/^[9]\d{9}$/, 'Invalid phone number'),
    password: yup
      .string()
      .required('Password is required')
      .min(5, 'Your password is too short.')
      .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
    confirmpassword: yup
      .string()
      .required('Confirm Your Password')
      .oneOf([yup.ref('password')], 'Passwords must match'),
  });

  const handleFormSubmit = async (values) => {
    try {
      const data = { ...values };
      // Remove the confirm password before sending to server
      delete data.confirmpassword;
      const response = await axios.post('/users/register', data);
      if (response.data.success) {
        toast.success('Registration Successful');
        setTimeout(() => navigate('/login'), 100);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header at the top */}
      <Header />

      {/* Main content area: left image + right form */}
      <div className="flex flex-grow">
        {/* Left side with image (hidden on small screens) */}
        <div
          className="hidden lg:block w-1/2 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1606660265514-358ebbadc80d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1575&q=80')",
          }}
        />

        {/* Right side with signup form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-gray-800 px-6 py-10">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex justify-center">
             <img className="w-auto h-20" src="logo.png" alt="Logo" />

            </div>

            {/* Sign In / Sign Up Tabs */}
            <div className="flex items-center justify-center mt-6">
              <Link
                to="/login"
                className="w-1/3 pb-4 text-center text-gray-500 border-b"
              >
                Sign In
              </Link>
              <span className="w-1/3 pb-4 text-center text-gray-800 dark:text-gray-200 border-b-2 border-blue-500">
                Sign Up
              </span>
            </div>

            {/* Formik Form */}
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
              {({ touched, errors }) => (
                <Form className="mt-6 space-y-4">
                  <div>
                    <Field
                      name="name"
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                    <FieldError message={touched.name && errors.name} />
                  </div>

                  <div>
                    <Field
                      name="mobile_no"
                      type="text"
                      placeholder="Your Contact Number"
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                    <FieldError message={touched.mobile_no && errors.mobile_no} />
                  </div>

                  <div>
                    <Field
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                    <FieldError message={touched.email && errors.email} />
                  </div>

                  <div>
                    <Field
                      name="password"
                      type="password"
                      placeholder="Password"
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                    <FieldError message={touched.password && errors.password} />
                  </div>

                  <div>
                    <Field
                      name="confirmpassword"
                      type="password"
                      placeholder="Confirm Password"
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                    <FieldError
                      message={touched.confirmpassword && errors.confirmpassword}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                  >
                    Sign Up
                  </button>
                </Form>
              )}
            </Formik>

            {/* Already have an account? */}
            <div className="mt-6 text-center">
              <Link to="/login" className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 hover :underline">
                Already have an account?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
