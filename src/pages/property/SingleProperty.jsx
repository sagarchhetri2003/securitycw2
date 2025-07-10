// // import { Field, Form, Formik } from 'formik'
// // import axios from '../../axios'
// // import React, { useContext, useEffect, useState } from 'react'
// // import toast from 'react-hot-toast'
// // import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa'
// // import { useParams } from 'react-router-dom'
// // import Rating from 'react-rating'
// // import { AuthContext } from '../../context/authContext'

// // function SingleProduct() {

// //     const { id } = useParams()

// //     const [productData, setProductData] = useState()
// //     // const [selectedVariantData, setSelectedVariantData] = useState()
// //     const [ratingData, setRatingData] = useState()

// //     const { isAuthenticated } = useContext(AuthContext)

// //     console.log('isAuthenticated', isAuthenticated)
// //     const getProductDetail = async () => {
// //         try {
// //             let result = await axios.get('/products/' + id)

// //             if (result.data.success) {
// //                 setProductData(result?.data?.data ? result?.data?.data : [])
// //                 getReviews(result?.data?.data?._id)
// //                 // setSelectedVariantData(result?.data?.data?.variant[0] ? result?.data?.data?.variant[0] : [])
// //             } else toast.error('Failed')
// //         } catch (ERR) {
// //             console.log(ERR)
// //             toast.error(ERR?.response?.data?.msg)
// //         }
// //     }
// //     const addToCart = async () => {
// //         try {
// //             let result = await axios.post('/carts/add/', {
// //                 item: productData?._id,
// //                 quantity: 1
// //             })

// //             if (result.data.success) {
// //                 toast.success('Added To Cart')
// //                 // setProductData(result?.data?.data ? result?.data?.data : [])
// //                 // setSelectedVariantData(result?.data?.data?.variant[0] ? result?.data?.data?.variant[0] : [])
// //             } else toast.error('Failed')
// //         } catch (ERR) {
// //             console.log(ERR)
// //             toast.error(ERR?.response?.data?.msg)
// //         }
// //     }
// //     const addToWishlist = async () => {
// //         try {
// //             let result = await axios.post('/wishlist/' + productData?._id)

// //             if (result.data.success) {
// //                 toast.success('Added To Wishlist')
// //                 // setSelectedVariantData(result?.data?.data?.variant[0] ? result?.data?.data?.variant[0] : [])
// //             } else toast.error('Failed')
// //         } catch (ERR) {
// //             console.log(ERR)
// //             toast.error(ERR?.response?.data?.msg)
// //         }
// //     }

// //     const getReviews = async (id) => {
// //         try {
// //             let result = await axios.get('/reviews/' + id, {
// //                 params: {
// //                     page: 1,
// //                     size: 999
// //                 }
// //             })

// //             if (result.data.success) {
// //                 console.log(result.data.data)
// //                 setRatingData(result.data.data)
// //                 // setProductData(result?.data?.data ? result?.data?.data : [])
// //                 // setSelectedVariantData(result?.data?.data?.variant[0] ? result?.data?.data?.variant[0] : [])
// //             } else toast.error('Failed')
// //         } catch (ERR) {
// //             console.log(ERR)
// //             toast.error(ERR?.response?.data?.msg)
// //         }
// //     }

// //     const addReview = async (values, actions) => {
// //         try {
// //             let result = await axios.post('/reviews', values)

// //             if (result.data.success) {
// //                 toast.success('Review Added Successfully')
// //                 getProductDetail()
// //                 actions.resetForm()
// //             } else toast.error('Failed')
// //         } catch (ERR) {
// //             console.log(ERR)
// //             if (ERR?.response?.status === 401) {
// //                 toast.error('Please Login To Review.')
// //             } else toast.error(ERR?.response?.data?.message)
// //         }
// //     }

// //     useEffect(() => {
// //         getProductDetail()
// //     }, [id])


// //     return (
// //         <div>
// //             <div className="bg-white dark:bg-black">
// //                 <div className="pt-6">
// //                     <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
// //                         <div className="lg:col-span-2 lg:border-r lg:border-gray-200 dark:border-gray-700 lg:pr-8">
// //                             <div className='grid grid-cols-2 gap-2'>
// //                                 {
// //                                     productData?.images?.map((value, index) => (
// //                                         <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg border dark:border-gray-800" key={index}>
// //                                             <img src={`${import.meta.env.VITE_APP_BASE_URI}${value}`} alt="Prod Img" className="h-full w-full object-cover object-center" />
// //                                         </div>
// //                                     ))
// //                                 }
// //                             </div>
// //                         </div>

// //                         <div className="mt-4 lg:row-span-3 lg:mt-0">

// //                             <div>
// //                                 <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl capitalize">{productData?.name}</h1>

// //                             </div>
// //                             <p className="text-xl tracking-tight mt-2 text-gray-900 dark:text-white">Rs. {productData?.price}</p>

// //                             <div className='flex items-center gap-3 my-3'>
// //                                 <Rating step={1} name="rating" readonly initialRating={productData?.rating} fullSymbol={<FaStar color='#ffe234' size={20} strokeWidth={2} stroke='black' />} emptySymbol={<FaStar color='white' size={20} strokeWidth={2} stroke='black' />} />
// //                                 <label className='mb-1'>
// //                                     {productData?.rating} out of 5 Stars
// //                                 </label>
// //                             </div>
// //                             <div className='flex flex-wrap gap-3'>
// //                                 <button type="button"
// //                                     onClick={() => {
// //                                         if (isAuthenticated) {
// //                                             addToCart()
// //                                         }else toast.error('Please Login First')
// //                                     }}
// //                                     className="mt-5 flex flex-1 items-center justify-center rounded-md border border-transparent bg-green-600 px-8 py-3 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 gap-3">
// //                                     Add to Cart <FaShoppingCart /></button>

// //                             </div>
// //                             <div className='mt-10'>

// //                                 <h3 className="font-semibold">Description</h3>

// //                                 <div className="space-y-6 mt-2">
// //                                     {/* <p className="text-base text-gray-900">The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: &quot;Black&quot;. Need to add an extra pop of color to your outfit? Our white tee has you covered.</p> */}
// //                                     <p className="text-base text-gray-900 dark:text-white">{productData?.description}</p>
// //                                 </div>
// //                             </div>

// //                         </div>

// //                     </div>
// //                     <section className='max-w-7xl mx-auto p-4'>
// //                         <h1 className='text-2xl font-semibold tracking-tight text-gray-900 dark:text-white'>
// //                             Comments
// //                         </h1>

// //                         <Formik
// //                             enableReinitialize
// //                             initialValues={{
// //                                 rating: 0,
// //                                 product: productData?._id,
// //                                 message: ""
// //                             }}
// //                             onSubmit={(values, actions) => {
// //                                 addReview(values, actions)
// //                             }}
// //                         >
// //                             {props => (
// //                                 <Form>
// //                                     <div className='mt-3'>
// //                                         <Rating step={1} name="rating" onChange={(rating) => {
// //                                             props.setFieldValue('rating', rating)
// //                                         }} value={props.values.rating} initialRating={props.values.rating} fullSymbol={<FaStar color='#ffe234' size={20} strokeWidth={2} stroke='black' />} emptySymbol={<FaStar color='white' size={20} strokeWidth={2} stroke='black' />} />
// //                                     </div>
// //                                     <div className='my-3 flex flex-col'>
// //                                         <Field name="message" value={props.values.message} as="textarea" className='w-full border mt-3 rounded p-2' placeholder='Write a Comment' />
// //                                         <button type='submit' className='bg-blue-700 w-fit px-4 py-2 rounded text-white mt-3 place-self-end'>Submit</button>
// //                                     </div>
// //                                 </Form>
// //                             )}
// //                         </Formik>

// //                         <div className='mt-10'>
// //                             {
// //                                 ratingData?.map((value, index) => (
// //                                     <div className='w-full flex my-4 gap-4 shadow p-2 items-center'>
// //                                         <div>
// //                                             {
// //                                                 value.user.image ?
// //                                                     <img src={`${import.meta.env.VITE_APP_BASE_URI}${value.user.image}`} className='h-20 w-20 object-cover' />
// //                                                     :
// //                                                     <img src='/images/avatar.jpg' className='h-20 w-20 object-cover' />
// //                                             }
// //                                         </div>
// //                                         <div className='font-semibold flex flex-col gap-1'>
// //                                             <div className='flex items-center gap-4 text-gray-400 text-sm'>
// //                                                 <label className='mb-1'>
// //                                                     {value.user.name}
// //                                                 </label>
// //                                                 <Rating step={1} name="rating" readonly initialRating={value?.rating} fullSymbol={<FaStar color='#ffe234' size={14} strokeWidth={2} stroke='black' />} emptySymbol={<FaStar color='white' size={14} strokeWidth={2} stroke='black' />} />
// //                                             </div>
// //                                             <span>
// //                                                 {value?.message}
// //                                             </span>
// //                                         </div>
// //                                     </div>
// //                                 ))
// //                             }
// //                         </div>
// //                     </section>

// //                 </div>
// //             </div>
// //         </div>
// //     )
// // }

// // export default SingleProduct



// import { Field, Form, Formik } from 'formik'
// import axios from '../../axios'
// import React, { useContext, useEffect, useState } from 'react'
// import toast from 'react-hot-toast'
// import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa'
// import { useParams } from 'react-router-dom'
// import Rating from 'react-rating'
// import { AuthContext } from '../../context/authContext'

// function SingleProperty() {

//     const { id } = useParams()

//     const [propertyData, setPropertyData] = useState()
//     // const [selectedVariantData, setSelectedVariantData] = useState()
//     const [ratingData, setRatingData] = useState()

//     const { isAuthenticated } = useContext(AuthContext)

//     console.log('isAuthenticated', isAuthenticated)
//     const getPropertyDetail = async () => {
//         try {
//             let result = await axios.get('/property/' + id)

//             if (result.data.success) {
//                 setPropertyData(result?.data?.data ? result?.data?.data : [])
//                 getReviews(result?.data?.data?._id)
//                 // setSelectedVariantData(result?.data?.data?.variant[0] ? result?.data?.data?.variant[0] : [])
//             } else toast.error('Failed')
//         } catch (ERR) {
//             console.log(ERR)
//             toast.error(ERR?.response?.data?.msg)
//         }
//     }
//     const addToCart = async () => {
//         try {
//             let result = await axios.post('/carts/add/', {
//                 item: propertyData?._id,
//                 quantity: 1
//             })

//             if (result.data.success) {
//                 toast.success('Added To Cart')
//                 // setProductData(result?.data?.data ? result?.data?.data : [])
//                 // setSelectedVariantData(result?.data?.data?.variant[0] ? result?.data?.data?.variant[0] : [])
//             } else toast.error('Failed')
//         } catch (ERR) {
//             console.log(ERR)
//             toast.error(ERR?.response?.data?.msg)
//         }
//     }
//     const addToWishlist = async () => {
//         try {
//             let result = await axios.post('/wishlist/' + propertyData?._id)

//             if (result.data.success) {
//                 toast.success('Added To Wishlist')
//                 // setSelectedVariantData(result?.data?.data?.variant[0] ? result?.data?.data?.variant[0] : [])
//             } else toast.error('Failed')
//         } catch (ERR) {
//             console.log(ERR)
//             toast.error(ERR?.response?.data?.msg)
//         }
//     }

//     const getReviews = async (id) => {
//         try {
//             let result = await axios.get('/reviews/' + id, {
//                 params: {
//                     page: 1,
//                     size: 999
//                 }
//             })

//             if (result.data.success) {
//                 console.log(result.data.data)
//                 setRatingData(result.data.data)
//                 // setProductData(result?.data?.data ? result?.data?.data : [])
//                 // setSelectedVariantData(result?.data?.data?.variant[0] ? result?.data?.data?.variant[0] : [])
//             } else toast.error('Failed')
//         } catch (ERR) {
//             console.log(ERR)
//             toast.error(ERR?.response?.data?.msg)
//         }
//     }

//     const addReview = async (values, actions) => {
//         try {
//             let result = await axios.post('/reviews', values)

//             if (result.data.success) {
//                 toast.success('Review Added Successfully')
//                 getPropertyDetail()
//                 actions.resetForm()
//             } else toast.error('Failed')
//         } catch (ERR) {
//             console.log(ERR)
//             if (ERR?.response?.status === 401) {
//                 toast.error('Please Login To Review.')
//             } else toast.error(ERR?.response?.data?.message)
//         }
//     }

//     useEffect(() => {
//         getPropertyDetail()
//     }, [id])


//     return (
//         <div>
//             <div className="bg-white dark:bg-black">
//                 <div className="pt-6">
//                     <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
//                         <div className="lg:col-span-2 lg:border-r lg:border-gray-200 dark:border-gray-700 lg:pr-8">
//                             <div className='grid grid-cols-2 gap-2'>
//                                 {
//                                     propertyData?.images?.map((value, index) => (
//                                         <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg border dark:border-gray-800" key={index}>
//                                             <img src={`${import.meta.env.VITE_APP_BASE_URI}${value}`} alt="Prod Img" className="h-full w-full object-cover object-center" />
//                                         </div>
//                                     ))
//                                 }
//                             </div>
//                         </div>

//                         <div className="mt-4 lg:row-span-3 lg:mt-0">

//                             <div>
//                                 <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl capitalize">{propertyData?.name}</h1>

//                             </div>
//                             <p className="text-xl tracking-tight mt-2 text-gray-900 dark:text-white">Rs. {propertyData?.price}</p>

//                             <div className='flex items-center gap-3 my-3'>
//                                 <Rating step={1} name="rating" readonly initialRating={propertyData?.rating} fullSymbol={<FaStar color='#ffe234' size={20} strokeWidth={2} stroke='black' />} emptySymbol={<FaStar color='white' size={20} strokeWidth={2} stroke='black' />} />
//                                 <label className='mb-1'>
//                                     {propertyData?.rating} out of 5 Stars
//                                 </label>
//                             </div>
//                             <div className='flex flex-wrap gap-3'>
//                                 <button type="button"
//                                     onClick={() => {
//                                         if (isAuthenticated) {
//                                             addToCart()
//                                         }else toast.error('Please Login First')
//                                     }}
//                                     className="mt-5 flex flex-1 items-center justify-center rounded-md border border-transparent bg-green-600 px-8 py-3 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 gap-3">
//                                     Add to Cart <FaShoppingCart /></button>

//                             </div>
//                             <div className='mt-10'>

//                                 <h3 className="font-semibold">Description</h3>

//                                 <div className="space-y-6 mt-2">
//                                     {/* <p className="text-base text-gray-900">The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: &quot;Black&quot;. Need to add an extra pop of color to your outfit? Our white tee has you covered.</p> */}
//                                     <p className="text-base text-gray-900 dark:text-white">{propertyData?.description}</p>
//                                 </div>
//                             </div>

//                         </div>

//                     </div>
//                     <section className='max-w-7xl mx-auto p-4'>
//                         <h1 className='text-2xl font-semibold tracking-tight text-gray-900 dark:text-white'>
//                             Comments
//                         </h1>

//                         <Formik
//                             enableReinitialize
//                             initialValues={{
//                                 rating: 0,
//                                 property: propertyData?._id,
//                                 message: ""
//                             }}
//                             onSubmit={(values, actions) => {
//                                 addReview(values, actions)
//                             }}
//                         >
//                             {props => (
//                                 <Form>
//                                     <div className='mt-3'>
//                                         <Rating step={1} name="rating" onChange={(rating) => {
//                                             props.setFieldValue('rating', rating)
//                                         }} value={props.values.rating} initialRating={props.values.rating} fullSymbol={<FaStar color='#ffe234' size={20} strokeWidth={2} stroke='black' />} emptySymbol={<FaStar color='white' size={20} strokeWidth={2} stroke='black' />} />
//                                     </div>
//                                     <div className='my-3 flex flex-col'>
//                                         <Field name="message" value={props.values.message} as="textarea" className='w-full border mt-3 rounded p-2' placeholder='Write a Comment' />
//                                         <button type='submit' className='bg-blue-700 w-fit px-4 py-2 rounded text-white mt-3 place-self-end'>Submit</button>
//                                     </div>
//                                 </Form>
//                             )}
//                         </Formik>

//                         <div className='mt-10'>
//                             {
//                                 ratingData?.map((value, index) => (
//                                     <div className='w-full flex my-4 gap-4 shadow p-2 items-center'>
//                                         <div>
//                                             {
//                                                 value.user.image ?
//                                                     <img src={`${import.meta.env.VITE_APP_BASE_URI}${value.user.image}`} className='h-20 w-20 object-cover' />
//                                                     :
//                                                     <img src='/images/avatar.jpg' className='h-20 w-20 object-cover' />
//                                             }
//                                         </div>
//                                         <div className='font-semibold flex flex-col gap-1'>
//                                             <div className='flex items-center gap-4 text-gray-400 text-sm'>
//                                                 <label className='mb-1'>
//                                                     {value.user.name}
//                                                 </label>
//                                                 <Rating step={1} name="rating" readonly initialRating={value?.rating} fullSymbol={<FaStar color='#ffe234' size={14} strokeWidth={2} stroke='black' />} emptySymbol={<FaStar color='white' size={14} strokeWidth={2} stroke='black' />} />
//                                             </div>
//                                             <span>
//                                                 {value?.message}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 ))
//                             }
//                         </div>
//                     </section>

//                 </div>
//             </div>
//         </div>
//     )
// }

// export default SingleProperty



import { Field, Form, Formik } from 'formik'
import axios from '../../axios'
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import Rating from 'react-rating'
import { AuthContext } from '../../context/authContext'

function SingleProperty() {
  const { id } = useParams()
  const [propertyData, setPropertyData] = useState()
  const [ratingData, setRatingData] = useState()
  const { isAuthenticated } = useContext(AuthContext)

  // Fetch Property Details
  const getPropertyDetail = async () => {
    try {
      let result = await axios.get('/property/' + id)
      if (result.data.success) {
        setPropertyData(result.data.data ?? [])
        getReviews(result.data.data?._id)
      } else {
        toast.error('Failed to fetch property details.')
      }
    } catch (ERR) {
      console.log(ERR)
      toast.error(ERR?.response?.data?.msg)
    }
  }

  // Add to Cart
  const addToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login first.')
      return
    }

    try {
      let result = await axios.post('/carts/add/', {
        item: propertyData?._id,
        quantity: 1
      })

      if (result.data.success) {
        toast.success('Added to Cart')
      } else {
        toast.error('Failed to add to cart')
      }
    } catch (ERR) {
      console.log(ERR)
      toast.error(ERR?.response?.data?.msg)
    }
  }

  // Add to Wishlist (Simplified: No backend call)
  const addToWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please login first.')
      return
    }

    // Just show a success toast; no backend request
    toast.success('Added to Wishlist')
  }

  // Fetch Reviews
  const getReviews = async (propertyId) => {
    try {
      let result = await axios.get('/reviews/' + propertyId, {
        params: {
          page: 1,
          size: 999
        }
      })
      if (result.data.success) {
        setRatingData(result.data.data)
      } else {
        toast.error('Failed to fetch reviews')
      }
    } catch (ERR) {
      console.log(ERR)
      toast.error(ERR?.response?.data?.msg)
    }
  }

  // Add Review
  const addReview = async (values, actions) => {
    try {
      let result = await axios.post('/reviews', values)
      if (result.data.success) {
        toast.success('Review added successfully')
        getPropertyDetail()
        actions.resetForm()
      } else {
        toast.error('Failed to add review')
      }
    } catch (ERR) {
      console.log(ERR)
      if (ERR?.response?.status === 401) {
        toast.error('Please login to review.')
      } else {
        toast.error(ERR?.response?.data?.message || 'Failed to add review')
      }
    }
  }

  useEffect(() => {
    getPropertyDetail()
  }, [id])

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="pt-6">
        <div
          className="max-w-screen-xl mx-auto px-4 pb-16 pt-10 
                     sm:px-6 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] 
                     lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16"
        >
          {/* Property Images */}
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 dark:border-gray-700 lg:pr-8">
            <div className="grid grid-cols-2 gap-4">
              {propertyData?.images?.map((value, index) => (
                <div
                  className="overflow-hidden rounded-lg border dark:border-gray-800 group hover:scale-105 
                             transform transition-all duration-300"
                  key={index}
                >
                  <img
                    src={`${import.meta.env.VITE_APP_BASE_URI}${value}`}
                    alt="Property"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Property Details */}
          <div className="mt-6 lg:mt-0">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
              {propertyData?.name}
            </h1>
            <p className="text-xl text-gray-900 dark:text-white mt-2">
              Rs. {propertyData?.price}
            </p>

            <div className="flex items-center gap-4 my-4">
              <Rating
                step={1}
                name="rating"
                readonly
                initialRating={propertyData?.rating}
                fullSymbol={<FaStar color="#ffe234" size={24} />}
                emptySymbol={<FaStar color="#e1e1e1" size={24} />}
              />
              <span className="text-sm text-gray-500">
                {propertyData?.rating} out of 5 Stars
              </span>
            </div>

            {/* Add to Cart & Wishlist */}
            <div className="flex flex-col gap-3">
              <button
                onClick={addToCart}
                className="flex items-center justify-center gap-2 bg-green-600 text-white 
                           font-medium py-3 px-8 rounded-md hover:bg-green-700 
                           focus:outline-none transition-all duration-300"
              >
                Add to Cart <FaShoppingCart size={18} />
              </button>

              <button
                onClick={addToWishlist}
                className="flex items-center justify-center gap-2 bg-transparent border-2 
                           border-gray-300 text-gray-800 font-medium py-3 px-8 rounded-md 
                           hover:bg-gray-100 transition-all duration-300"
              >
                Add to Wishlist <FaHeart size={18} />
              </button>
            </div>

            {/* Property Description */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Description
              </h3>
              <p className="text-base text-gray-800 dark:text-gray-400 mt-2">
                {propertyData?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="max-w-7xl mx-auto mt-16 p-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Comments
          </h2>

          <Formik
            enableReinitialize
            initialValues={{
              rating: 0,
              property: propertyData?._id,
              message: ""
            }}
            onSubmit={(values, actions) => addReview(values, actions)}
          >
            {props => (
              <Form className="mt-6">
                <div>
                  <Rating
                    step={1}
                    name="rating"
                    onChange={(rating) => props.setFieldValue('rating', rating)}
                    value={props.values.rating}
                    fullSymbol={<FaStar color="#ffe234" size={24} />}
                    emptySymbol={<FaStar color="#e1e1e1" size={24} />}
                  />
                </div>
                <Field
                  name="message"
                  as="textarea"
                  className="w-full mt-4 p-3 border rounded-md 
                             focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Write a Comment"
                />
                <button
                  type="submit"
                  className="mt-4 w-full bg-blue-600 text-white py-3 rounded-md 
                             hover:bg-blue-700 transition-all duration-300"
                >
                  Submit Review
                </button>
              </Form>
            )}
          </Formik>

          {/* Display Reviews */}
          <div className="mt-8">
            {ratingData?.map((review, index) => (
              <div
                className="flex items-center gap-4 my-6 p-4 border-b dark:border-gray-700"
                key={index}
              >
                <div>
                  <img
                    src={
                      review.user?.image
                        ? `${import.meta.env.VITE_APP_BASE_URI}${review.user.image}`
                        : '/images/avatar.jpg'
                    }
                    alt={review.user?.name}
                    className="h-12 w-12 object-cover rounded-full"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{review.user?.name}</span>
                    <Rating
                      step={1}
                      name="rating"
                      readonly
                      initialRating={review?.rating}
                      fullSymbol={<FaStar color="#ffe234" size={16} />}
                      emptySymbol={<FaStar color="#e1e1e1" size={16} />}
                    />
                  </div>
                  <p className="text-gray-800 dark:text-gray-400 mt-2">
                    {review?.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default SingleProperty
