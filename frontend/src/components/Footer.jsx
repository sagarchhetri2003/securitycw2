// import React from 'react'

// function Footer() {
//     return (
//         <footer className="bg-[#f7f6f6] dark:bg-black rounded-lg shadow z-10 ">
//             <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
//                 <div className="sm:flex sm:items-center sm:justify-between">
//                     <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
//                         <img src="/logo.png" className="h-8" alt="Logo" />
//                     </a>
//                     <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 ">
//                         <li>
//                             <a href="/about" className="hover:underline me-4 md:me-6">About</a>
//                         </li>

//                         {/* <li>
//                             <a href="/contact" className="hover:underline">Contact</a>
//                         </li> */}
//                     </ul>
//                 </div>
//                 <hr className="my-6 border-gray-200 sm:mx-auto  lg:my-8" />
//                 <span className="block text-sm text-gray-500 ">© <a href="/" className="hover:underline">Athlete Fuel</a>. Kathmandu, Nepal.</span>
//             </div>
//         </footer>


//     )
// }

// export default Footer

import React from 'react'

function Footer() {
    return (
        <footer className="bg-[#f7f6f6] dark:bg-black rounded-lg shadow z-10">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                    <img src="/logo.png" className="h-20" alt="Logo" />
                    </a>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 ">
                        <li>
                            <a href="/about" className="hover:underline me-4 md:me-6">About Us</a>
                        </li>
                        <li>
                            <a href="/property" className="hover:underline me-4 md:me-6">Our Properties</a>
                        </li>
                        <li>
                            <a href="/services" className="hover:underline me-4 md:me-6">Services</a>
                        </li>
                        <li>
                            <a href="/contact" className="hover:underline me-4 md:me-6">Contact Us</a>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
                <div className="flex justify-between items-center">
                    <span className="block text-sm text-gray-500">© <a href="/" className="hover:underline">Afnai  Real Estate</a>. Kathmandu, Nepal.</span>
                    <ul className="flex space-x-4">
                        <li>
                            <a href="https://facebook.com" className="text-gray-500 hover:text-gray-900">Facebook</a>
                        </li>
                        <li>
                            <a href="https://twitter.com" className="text-gray-500 hover:text-gray-900">Twitter</a>
                        </li>
                        <li>
                            <a href="https://linkedin.com" className="text-gray-500 hover:text-gray-900">LinkedIn</a>
                        </li>
                        <li>
                            <a href="https://instagram.com" className="text-gray-500 hover:text-gray-900">Instagram</a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer
