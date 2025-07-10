// import axios from '../../axios'
// import React, { useContext, useEffect, useRef, useState } from 'react'
// import EditProfile from './EditProfile'
// import toast from 'react-hot-toast'
// import { AuthContext } from '../../context/authContext'
// import { FaEdit, FaImage } from 'react-icons/fa'
// import { Link } from 'react-router-dom'

// function Profile() {
//     const { userDetails, setUserDetails } = useContext(AuthContext)

//     const [profileDetails, setProfileDetails] = useState([])
//     const [editProfile, setEditProfile] = useState()
//     const [orderDetails, setOrderDetails] = useState([])

//     const openEditProfile = () => {
//         setEditProfile(true)
//     }

//     const closeEditProfile = () => {
//         setEditProfile(false)
//     }

//     const uploadRef = useRef()

//     const getProfileDetails = async () => {
//         try {
//             let result = await axios.get('/users/my-profile/')
//             if (result.data.success) {
//                 setProfileDetails(result.data.data)

//             }
//         } catch (ERR) {
//             console.log(ERR)
//         }
//     }
//     const getMyOrders = async () => {
//         try {
//             let result = await axios.get('/carts/my-order/')
//             if (result.data.success) {
//                 setOrderDetails(result.data.data)

//             }
//         } catch (ERR) {
//             console.log(ERR)
//         }
//     }

//     const uploadProfilePicture = async (img) => {
//         try {
//             if (img) {
//                 const formData = new FormData()

//                 formData.append('image', img)
//                 let result = await axios.put('/users/upload-pp', formData)
//                 if (result.data.success) {
//                     toast.success('Image Uploaded')
//                     const localData = JSON.parse(localStorage.getItem('_hw_userDetails'))
//                     localData.image = result.data?.data?.image
//                     localStorage.setItem('_hw_userDetails', JSON.stringify(localData))
//                     getProfileDetails()
//                     userDetails.image = result.data?.data?.image
//                     // setUserDetails(newdata)
//                     setUserDetails(userDetails)
//                 }
//             }
//         } catch (ERR) {
//             console.log(ERR)
//         }
//     }

//     useEffect(() => {
//         getProfileDetails()
//         getMyOrders()
//     }, [])

//     console.log(orderDetails)

//     return (
//         <div className="h-full bg-gray-50 dark:bg-black p-8 max-w-7xl mx-auto">

//             {
//                 editProfile &&
//                 <EditProfile modalIsOpen={editProfile} closeModal={closeEditProfile} getRoute={getProfileDetails} profileDetails={profileDetails} />
//             }
//             <div className=" rounded-lg bg-white dark:bg-gray-900 dark:text-white pb-8">

//                 <div className="flex flex-col items-start px-12 ">
//                     {
//                         profileDetails?.image ?

//                             <img src={`${import.meta.env.VITE_APP_BASE_URI}${profileDetails?.image}`} className="w-40 border-4 mt-5 border-white rounded-full" />
//                             :
//                             <img src="/defaultUserImage.png" className="w-40 border-4 mt-5 border-white rounded-full" />

//                     }
//                     <div className="flex items-center space-x-2 mt-2">
//                         <p className="text-2xl">{profileDetails?.firstname} {profileDetails?.lastname}</p>
//                     </div>
//                 </div>
//                 <div className=" px-8 mt-10">
//                     <div className="flex items-center space-x-4 mt-2">

//                         <input ref={uploadRef} type='file' className='hidden' onChange={(e) => {
//                             uploadProfilePicture(e.target.files[0])
//                         }} />

//                         <button onClick={() => {
//                             uploadRef.current.click()
//                         }} className="flex items-center bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
//                             <FaImage />
//                             <span>Image</span>
//                         </button>
//                         <button onClick={() => {
//                             openEditProfile()
//                         }} className="flex items-center bg-green-800 hover:bg-green-800 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
//                             <FaEdit />
//                             <span>Edit Profile</span>
//                         </button>
//                     </div>
//                     <div className="p-8">
//                         <ul className="mt-2 flex flex-wrap gap-10 text-gray-700 dark:text-white">
//                             <li className="flex flex-col py-1 gap-1">
//                                 <span className="font-bold">Full Name:</span>
//                                 <span className="dark:text-white text-gray-700">{profileDetails?.name}</span>
//                             </li>
//                             {/* <li className="flex flex-col py-1 gap-1">
//                                 <span className="font-bold">Last Name:</span>
//                                 <span className="dark:text-white text-gray-700">{profileDetails?.lastname}</span>
//                             </li> */}
//                             <li className="flex flex-col py-1 gap-1">
//                                 <span className="font-bold">Email:</span>
//                                 <span className="dark:text-white text-gray-700">{profileDetails?.email}</span>
//                             </li>
//                             <li className="flex flex-col py-1 gap-1">
//                                 <span className="font-bold">Contact:</span>
//                                 <span className="dark:text-white text-gray-700">{profileDetails?.mobile_no}</span>
//                             </li>
//                             {/* <li className="flex flex-col py-1 gap-1">
//                                 <span className="font-bold">Address:</span>
//                                 <span className="dark:text-white text-gray-700">{profileDetails?.address}</span>
//                             </li> */}
//                         </ul>
//                     </div>
//                 </div>
//             </div>

//             <div className="my-4 flex flex-col 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-4">
//                 <div className="w-full flex flex-col">
//                     <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg  p-8">
//                         <h4 className="text-xl dark:text-white text-gray-900 font-bold">My Orders</h4>
//                         <ul className="mt-2 dark:text-white text-gray-700 grid grid-cols-3 ">
//                             {
//                                 orderDetails.length > 0 ? orderDetails?.map((value, index) => (
//                                     <li className="flex p-6 shadow" key={index}>
//                                         <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
//                                             <img src={`${import.meta.env.VITE_APP_BASE_URI}${value?.item?.images[0]}`} alt="Wishlist property." className="h-full w-full object-cover object-center" />
//                                         </div>

//                                         <div className="ml-4 flex flex-1 flex-col">
//                                             <div>
//                                                 <div className="flex justify-between text-base font-medium dark:text-white text-gray-900">
//                                                     <h3>
//                                                         <a href={`property/` + value?.sku}>{value?.item?.name}</a>
//                                                     </h3>
//                                                     <p className="ml-4">Rs. {value?.price}</p>
//                                                 </div>
//                                                 <p className="mt-1 text-sm dark:text-white text-gray-500">Quantity: {value?.quantity}</p>
//                                             </div>
//                                             <div className="flex flex-1 items-center mt-2 justify-end text-sm">
//                                                 <p onClick={() => {
//                                                     // addToWishlist(value?.property._id)
//                                                 }} type="button" className="font-medium text-red-600 hover:text-red-500">Status : {value?.status}</p>
//                                             </div>
//                                         </div>
//                                     </li>
//                                 )) :
//                                     <div className='flex flex-col'>
//                                         <label className='text-red-600'>No Orders Yet ! </label>
//                                         <Link to={'/property'} className='mt-4 p-3 bg-blue-800 px-6 text-white rounded text-center w-fit'>Explore Items</Link>
//                                     </div>
//                             }

//                         </ul>
//                     </div>

//                 </div>

//             </div>

//         </div >
//     )
// }

// export default Profile


import axios from '../../axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import EditProfile from './EditProfile';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/authContext';
import { FaEdit, FaImage } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Profile() {
    const { userDetails, setUserDetails } = useContext(AuthContext);
    const [profileDetails, setProfileDetails] = useState({});
    const [editProfile, setEditProfile] = useState(false);
    const [orderDetails, setOrderDetails] = useState([]);
    const uploadRef = useRef();

    const getProfileDetails = async () => {
        try {
            let result = await axios.get('/users/my-profile/');
            if (result.data.success) {
                setProfileDetails(result.data.data);
            }
        } catch (ERR) {
            console.log(ERR);
        }
    };

    const getMyOrders = async () => {
        try {
            let result = await axios.get('/carts/my-order/');
            if (result.data.success) {
                setOrderDetails(result.data.data);
            }
        } catch (ERR) {
            console.log(ERR);
        }
    };

    const uploadProfilePicture = async (img) => {
        try {
            if (img) {
                const formData = new FormData();
                formData.append('image', img);
                let result = await axios.put('/users/upload-pp', formData);
                if (result.data.success) {
                    toast.success('Image Uploaded');
                    const localData = JSON.parse(localStorage.getItem('_hw_userDetails'));
                    localData.image = result.data?.data?.image;
                    localStorage.setItem('_hw_userDetails', JSON.stringify(localData));
                    getProfileDetails();
                    setUserDetails((prev) => ({ ...prev, image: result.data?.data?.image }));
                }
            }
        } catch (ERR) {
            console.log(ERR);
        }
    };

    useEffect(() => {
        getProfileDetails();
        getMyOrders();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 sm:p-12">
            {editProfile && (
                <EditProfile modalIsOpen={editProfile} closeModal={() => setEditProfile(false)} getRoute={getProfileDetails} profileDetails={profileDetails} />
            )}

            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                        <img
                            src={profileDetails?.image ? `${import.meta.env.VITE_APP_BASE_URI}${profileDetails?.image}` : '/defaultUserImage.png'}
                            className="w-32 h-32 border-4 border-white dark:border-gray-600 rounded-full object-cover"
                            alt="Profile"
                        />
                        <input ref={uploadRef} type="file" className="hidden" onChange={(e) => uploadProfilePicture(e.target.files[0])} />
                        <button
                            onClick={() => uploadRef.current.click()}
                            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
                        >
                            <FaImage />
                        </button>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold dark:text-white">
                            {profileDetails?.firstname} {profileDetails?.lastname}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">{profileDetails?.email}</p>
                        <p className="text-gray-600 dark:text-gray-300">Contact: {profileDetails?.mobile_no}</p>
                        <button
                            onClick={() => setEditProfile(true)}
                            className="mt-3 flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            <FaEdit className="mr-2" /> Edit Profile
                        </button>
                    </div>
                </div>

                {/* Orders Section */}
                <div className="mt-10">
                    <h3 className="text-xl font-semibold dark:text-white border-b pb-2">My Orders</h3>
                    <ul className="mt-4 grid gap-4">
                        {orderDetails.length > 0 ? (
                            orderDetails.map((order, index) => (
                                <li key={index} className="flex bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
                                    <img
                                        src={`${import.meta.env.VITE_APP_BASE_URI}${order?.item?.images[0]}`}
                                        className="w-20 h-20 object-cover rounded-md"
                                        alt="Order Item"
                                    />
                                    <div className="ml-4 flex flex-col justify-between">
                                        <h4 className="text-gray-900 dark:text-white font-medium">
                                            <Link to={`/property/${order?.sku}`} className="hover:underline">
                                                {order?.item?.name}
                                            </Link>
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-300">Quantity: {order?.quantity}</p>
                                        <p className="text-gray-900 dark:text-white font-bold">Rs. {order?.price}</p>
                                        <span className="text-red-600 text-sm">{order?.status}</span>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <div className="text-center text-gray-600 dark:text-gray-300 mt-4">
                                <p>No Orders Yet!</p>
                                <Link to="/property" className="mt-4 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
                                    Explore Items
                                </Link>
                            </div>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Profile;
