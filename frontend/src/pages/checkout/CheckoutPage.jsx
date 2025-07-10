// import axios from '../../axios'
// import React, { useState } from 'react'
// import toast from 'react-hot-toast'
// import Modal from 'react-modal'


// function CheckoutPage({ modalIsOpen, closeModal, getRoute, cartData }) {
//     console.log("Cart Data", cartData)

//     // const khalti_config = {
//     //     url: 'https://a.khalti.com/api/v2/epayment/initiate/',
//     //     lookupUrl: 'https://a.khalti.com/api/v2/epayment/lookup/',
//     //     authorization: 'Key 7c1b2c7bea3642e8936b7dd51328a8c5',
//     //     return_url: 'http://localhost:1111/carts/checkout',
//     //     website_url: 'http://localhost:3001'
//     // }


//     const [shippingAddress, setShippingAddress] = useState("")

//     const checkout = async () => {
//         try {
//             if (shippingAddress) {
//                 toast.loading('Loading, Please Wait')
//                 const data = {
//                     purchase_order_id: cartData?.cartItems.map((item) => item?._id),
//                     purchase_order_name: shippingAddress
//                 }
//                 const response = await axios.post('/carts/checkout', data)
//                 if (response.data.success) {
//                     toast.dismiss()
//                     toast.success(response.data.message)
//                     closeModal()
//                     getRoute()
//                 } else {
//                     toast.dismiss()
//                     toast.error(response.data.message)
//                 }
//             } else toast.error('Please add shipping address')


//         } catch (ERR) {
//             console.log(ERR)
//             toast.dismiss()
//             toast.error(ERR?.response?.data?.msg ? ERR?.response?.data?.msg : "Failed to Process Your Request, Try Again Later")
//         }
//     }

//     return (
//         <Modal
//             ariaHideApp={false}
//             isOpen={modalIsOpen}
//             onRequestClose={closeModal}
//             contentLabel="Add Category Modal"
//             overlayClassName="Overlay"
//             className="Modal rounded-md p-5 md:w-2/4 max-h-screen overflow-auto dark:bg-gray-900"
//         >
//             <div className="w-full gap-4 flex px-4 py">
//                 <div className=" w-full rounded-xl  p-6">
//                     <h2 className="text-gray-700 dark:text-white text-lg mb-2 font-semibold">Mode of Payment</h2>
//                     <p className="text-gray-500 font-semibold">Cash on Delivery</p>

//                     <div className="mt-4">
//                         <div className="flex items-center justify-between flex-wrap gap-2">
//                             <p className="text-gray-600 dark:text-white font-semibold">Shipping Address</p>
//                             <input
//                                 required
//                                 className="block dark:bg-gray-800 dark:text-white mt-2 w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
//                                 placeholder='Enter Shipping Address'
//                                 type='string' onChange={(e) => {
//                                     setShippingAddress(e.target.value)
//                                 }} />
//                         </div>
//                     </div>

//                 </div>
//                 <div className="bg-gray-50 w-full rounded-xl shadow-md p-6 dark:bg-gray-800 ">
//                     <h2 className=" dark:text-white text-gray-700 text-lg mb-4 font-semibold">Your Bill</h2>
//                     <div className="pb-4 border-b border-gray-200 flex flex-wrap gap-2 justify-between items-center mb-4">
//                         <p className=" dark:text-white text-gray-600">Subtotal</p>
//                         <p className=" dark:text-white text-gray-800">Rs. {cartData?.cart?.total}</p>
//                     </div>
//                     <div className="pb-4 border-b border-gray-200 flex flex-wrap gap-2 justify-between items-center mb-4">
//                         <p className=" dark:text-white text-gray-600">Discount</p>
//                         <p className=" dark:text-white text-gray-800">Rs. {cartData?.cart?.discount}</p>
//                     </div>
//                     <p className=" dark:text-white text-gray-800 mb-4 font-semibold">Shipping</p>
//                     <div className="mb-4">
//                         <div className="flex items-center justify-between flex-wrap gap-2">
//                             <p className=" dark:text-white text-gray-600">Delivery Costs</p>
//                             <p className=" dark:text-white text-gray-800">Rs. 00.00</p>
//                         </div>
//                     </div>

//                     <div className="flex items-center justify-between flex-wrap gap-2 mb-4 mt-10">
//                         <label className=" dark:text-white text-gray-700 font-semibold text-lg">Order Total</label>
//                         <label className=" dark:text-white text-gray-700 font-semibold text-lg">Rs. {cartData?.cart?.grand_total}</label>
//                     </div>
//                     <button type='submit' onClick={(e) => {
//                         e.preventDefault()
//                         checkout()
//                     }} className="bg-green-500 mt-4 py-3 px-4 rounded-sm text-white text-center hover:bg-green-600 transition duration-200 w-full inline-block">Checkout</button>
//                     <button onClick={() => {
//                         closeModal()
//                     }} className="bg-gray-500 mt-4 py-3 px-4 rounded-sm text-white text-center hover:bg-gray-600 transition duration-200 w-full inline-block">Cancel</button>
//                 </div>
//             </div>

//         </Modal>
//     )
// }

// export default CheckoutPage


import axios from '../../axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Modal from 'react-modal'

function CheckoutPage({ modalIsOpen, closeModal, getRoute, cartData }) {
    console.log("Cart Data", cartData)

    const [contactNumber, setContactNumber] = useState("");

    const checkout = async () => {
        try {
            if (contactNumber) {
                toast.loading('Processing your order, please wait...');
                
                setTimeout(() => {
                    toast.dismiss();
                    toast.success('✅ Order placed successfully! 🎉');
                    closeModal();
                    getRoute();
                }, 1500); // Simulate API success response after 1.5s
            } else {
                toast.error('Please enter your contact number');
            }
        } catch (ERR) {
            console.log(ERR);
            toast.dismiss();
            toast.error("Failed to Process Your Request, Try Again Later");
        }
    };

    return (
        <Modal
            ariaHideApp={false}
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Checkout Modal"
            overlayClassName="Overlay"
            className="Modal rounded-md p-5 md:w-2/4 max-h-screen overflow-auto dark:bg-gray-900"
        >
            <div className="w-full gap-4 flex flex-col px-4 py">
                <div className="w-full rounded-xl p-6">
                    <h2 className="text-gray-700 dark:text-white text-lg mb-2 font-semibold">Mode of Payment</h2>
                    <p className="text-gray-500 font-semibold">Cash on Delivery</p>

                    <div className="mt-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-gray-600 dark:text-white font-semibold">Your Contact Number</p>
                            <input
                                required
                                className="block dark:bg-gray-800 dark:text-white w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                                placeholder='Enter Your Contact Number'
                                type='tel'
                                onChange={(e) => setContactNumber(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 w-full rounded-xl shadow-md p-6 dark:bg-gray-800">
                    <h2 className="dark:text-white text-gray-700 text-lg mb-4 font-semibold">Your Bill</h2>

                    <div className="pb-4 border-b border-gray-200 flex justify-between items-center mb-4">
                        <p className="dark:text-white text-gray-600">Subtotal</p>
                        <p className="dark:text-white text-gray-800">Rs. {cartData?.cart?.total || "0.00"}</p>
                    </div>

                    <div className="pb-4 border-b border-gray-200 flex justify-between items-center mb-4">
                        <p className="dark:text-white text-gray-600">Discount</p>
                        <p className="dark:text-white text-gray-800">Rs. {cartData?.cart?.discount || "0.00"}</p>
                    </div>

                    <p className="dark:text-white text-gray-800 mb-4 font-semibold">Shipping</p>
                    <div className="mb-4 flex justify-between">
                        <p className="dark:text-white text-gray-600">Delivery Costs</p>
                        <p className="dark:text-white text-gray-800">Rs. 00.00</p>
                    </div>

                    <div className="flex justify-between mb-4 mt-10">
                        <label className="dark:text-white text-gray-700 font-semibold text-lg">Order Total</label>
                        <label className="dark:text-white text-gray-700 font-semibold text-lg">Rs. {cartData?.cart?.grand_total || "0.00"}</label>
                    </div>

                    <button 
                        onClick={() => checkout()} 
                        className="bg-green-500 mt-4 py-3 px-4 rounded-sm text-white text-center hover:bg-green-600 transition duration-200 w-full inline-block">
                        Checkout
                    </button>

                    <button 
                        onClick={() => closeModal()} 
                        className="bg-gray-500 mt-4 py-3 px-4 rounded-sm text-white text-center hover:bg-gray-600 transition duration-200 w-full inline-block">
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default CheckoutPage;
