;


import { FaBoxes, FaShoppingBag, FaShoppingCart, FaUser } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import toast from 'react-hot-toast';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [totalOrderCount, setTotalOrderCount] = useState(0);
  const [totalUserCount, setTotalUserCount] = useState(0);
  const [totalCategoryCount, setTotalCategoryCount] = useState(0);
  const [totalPropertyCount, setTotalPropertyCount] = useState(0);

  const getAllProperty = async () => {
    try {
      let result = await axios.get('/property/all', {
        params: {
          search: "",
          page: 1,
          size: 10
        }
      });
      if (result.data.success) {
        setTotalPropertyCount(result.data.totalCount);
      } else toast.error('Failed');
    } catch (ERR) {
      console.log(ERR);
      toast.error(ERR.response.data.msg);
    }
  };

  const getAllCategory = async () => {
    try {
      let result = await axios.get('/category', {
        params: {
          search: "",
          page: 1,
          size: 10
        }
      });
      if (result.data.success) {
        setTotalCategoryCount(result?.data?.totalCount);
      } else toast.error('Failed');
    } catch (ERR) {
      console.log(ERR);
      toast.error(ERR.response.data.msg);
    }
  };

  const getAllUser = async () => {
    try {
      let result = await axios.get('/users/all', {
        params: {
          search: "",
          page: 1,
          size: 10
        }
      });
      if (result.data.success) {
        setTotalUserCount(result.data.totalCount);
      } else toast.error('Failed');
    } catch (ERR) {
      console.log(ERR);
      toast.error(ERR.response.data.msg);
    }
  };

  const getAllOrders = async () => {
    try {
      let result = await axios.get('carts/admin/order', {
        params: {
          search: "",
          page: 1,
          size: 10
        }
      });
      if (result.data.success) {
        setTotalOrderCount(result.data.totalCount || 2);
      } else toast.error('Failed');
    } catch (ERR) {
      console.log(ERR);
      toast.error(ERR.response.data.msg);
    }
  };

  useEffect(() => {
    getAllCategory();
    getAllOrders();
    getAllProperty();
    getAllUser();
  }, []);

  const data = {
    labels: ['Users', 'Properties', 'Categories', 'Orders'],
    datasets: [
      {
        label: 'Total Count',
        data: [totalUserCount, totalPropertyCount, totalCategoryCount, totalOrderCount],
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#FF5722'],
      },
    ],
  };

  // Static reviews
  const reviews = [
    // {
    //   name: "John Doe",
    //   rating: 5,
    //   comment: "Amazing platform! Helped me find my dream home effortlessly. Highly recommend!",
    // },
    // {
    //   name: "Sarah Johnson",
    //   rating: 4,
    //   comment: "Great service and easy to navigate. Could improve search filters.",
    // },
    // {
    //   name: "Michael Smith",
    //   rating: 5,
    //   comment: "Fantastic experience! Quick responses from agents and a smooth process.",
    // },
    {
      name: "Sagar Adhikari",
      rating: 0,
      comment: "wow.",
    }
  ];

  return (
    <div className='mx-auto w-full px-8 mt-10'>
      <h1 className='text-4xl font-semibold'>Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className='grid gap-4 lg:grid-cols-4 grid-cols-2 mt-10'>
        <div className='shadow p-3 py-10 flex flex-col items-center'>
          <label className='text-4xl mt-3 text-gray-500'>{totalUserCount}</label>
          <label className='font-semibold text-xl'>Total Users</label>
        </div>
        <div className='shadow p-3 py-10 flex flex-col items-center'>
          <label className='text-4xl mt-3 text-gray-500'>{totalPropertyCount}</label>
          <label className='font-semibold text-xl'>Total Properties</label>
        </div>
        <div className='shadow p-3 py-10 flex flex-col items-center'>
          <label className='text-4xl mt-3 text-gray-500'>{totalCategoryCount}</label>
          <label className='font-semibold text-xl'>Total Categories</label>
        </div>
        <div className='shadow p-3 py-10 flex flex-col items-center'>
          <label className='text-4xl mt-3 text-gray-500'>{totalOrderCount}</label>
          <label className='font-semibold text-xl'>Total Orders</label>
        </div>
      </div>

      {/* Bar Chart */}
      <div className='mt-10'>
        <h2 className='text-2xl font-semibold mb-4'>Statistics Overview</h2>
        <Bar data={data} />
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Customer Reviews</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6 border">
              <h3 className="text-lg font-bold text-gray-800">{review.name}</h3>
              <div className="flex items-center text-yellow-500 mt-1">
                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
              </div>
              <p className="text-gray-600 mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
