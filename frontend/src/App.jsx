import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Page404 from './pages/404/Page404';
import Header from './components/Header';
import Signup from './pages/signup/Signup';
import { Toaster } from 'react-hot-toast';
import AuthContextProvider from './context/authContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/adminPages/Dashboard';
import AdminSidebar from './components/AdminComponents/AdminSidebar';
import SingleProperty from './pages/property/SingleProperty';
import AllProperties from './pages/property/AllProperties';
import Cartpage from './pages/cartpage/Cartpage';
import Wishlist from './pages/wishlist/Wishlist';
import ProtectedAdminRoute from './components/AdminComponents/ProtectedAdminRoute';
import Category from './pages/adminPages/Category/Category';
import User from './pages/adminPages/User/User';
import Profile from './pages/profile/Profile';
import Footer from './components/Footer';
import About from './pages/aboutUs/About';
import Orders from './pages/adminPages/Orders/Orders';
import AdminHeader from './components/AdminComponents/AdminHeader';
import AdminContact from './pages/adminPages/Contact/AdminContact';
import Property from './pages/adminPages/Product/Property';
import ResetPasswordRequest from "./pages/ResetPassword/ ResetPasswordRequest";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

function App() {

  const location = useLocation()

  return (
    <div className='bg-white dark:bg-black dark:text-white'>
      <AuthContextProvider>
        <Toaster />
        <div className='min-h-screen flex flex-col'>
          <Header />
          <AdminHeader />
          <div className={`flex-1  ${location.pathname.includes('dashboard') ? "flex" : ""}`}>
            <AdminSidebar />
            <Routes>
              <Route index element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* <Route path="/contact" element={<Contact />} /> */}
              <Route path="/about" element={<About />} />

              <Route path="/forgot-password" element={<ResetPasswordRequest />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            


              {/* <Route path="/cartpage" element={<Cartpage />} /> */}


              <Route
                path="/cartpage"
                element={
                  <ProtectedRoute>
                    <Cartpage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/property" element={<AllProperties />} />
              <Route path="/property/:id" element={<SingleProperty />} />

              {/* 404 Page */}
              <Route path="*" element={<Page404 />} />


              {/* Admin Pages */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedAdminRoute>
                    <Dashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/dashboard/properties"
                element={
                  <ProtectedAdminRoute>
                    <Property />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/dashboard/category"
                element={
                  <ProtectedAdminRoute>
                    <Category />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/dashboard/users"
                element={
                  <ProtectedAdminRoute>
                    <User />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/dashboard/orders"
                element={
                  <ProtectedAdminRoute>
                    <Orders />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/dashboard/contact"
                element={
                  <ProtectedAdminRoute>
                    <AdminContact />
                  </ProtectedAdminRoute>
                }
              />
            </Routes>
          </div>
          {/* <Footer /> */}
        </div>
      </AuthContextProvider>
    </div>
  );
}

export default App;
