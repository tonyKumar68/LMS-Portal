import React, { useState, useEffect } from 'react'
import logo from "../assets/logo.jpeg"
import ai from "../assets/ai.png"
import { IoMdPerson, IoMdNotifications } from "react-icons/io";
import { GiHamburgerMenu, GiSplitCross } from "react-icons/gi";
import { FaHeart, FaBook, FaCreditCard } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData, setNotifications, markNotificationAsRead } from '../redux/userSlice';

function Nav() {
  const [showHam, setShowHam] = useState(false);
  const [showPro, setShowPro] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, notifications } = useSelector(state => state.user);

  useEffect(() => {
    if (userData) fetchNotifications();
  }, [userData]);

  const fetchNotifications = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/notifications`, { withCredentials: true });
      dispatch(setNotifications(result.data.notifications));
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayment = async () => {
    if (isProcessingPayment) return;
    setIsProcessingPayment(true);
    try {
      const orderData = await axios.post(`${serverUrl}/api/payment/create-order`, {
        courseId: userData.enrolledCourses.length > 0 ? userData.enrolledCourses[0] : null,
        userId: userData._id
      }, { withCredentials: true });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: "INR",
        name: "Skill Sphere",
        description: "Course Enrollment Payment",
        order_id: orderData.data.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(`${serverUrl}/api/payment/verify-payment`, {
              ...response,
              courseId: userData.enrolledCourses.length > 0 ? userData.enrolledCourses[0] : null,
              userId: userData._id
            }, { withCredentials: true });
            toast.success(verifyRes.data.message);
          } catch (verifyError) {
            toast.error("Payment verification failed.");
            console.error("Verification Error:", verifyError);
          }
        },
        modal: { ondismiss: () => setIsProcessingPayment(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Something went wrong while processing payment.");
      console.error("Payment Error:", err);
      setIsProcessingPayment(false);
    }
  };

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      console.log(result.data);
      await dispatch(setUserData(null));
      toast.success("Logged out successfully");
      setShowPro(false);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const handleOptionClick = (path) => {
    navigate(path);
    setShowPro(false);
  };

  const handleMarkAsRead = async (id) => {
    if (!id) return;
    try {
      await axios.post(`${serverUrl}/api/user/notifications/${id}/read`, {}, { withCredentials: true });
      dispatch(markNotificationAsRead(id));
    } catch (error) {
      console.log(error);
    }
  };

  const closeDropdown = (e) => {
    if (e.target.closest('.profile-dropdown') || e.target.closest('.notification-dropdown')) return;
    setShowPro(false);
    setShowNotif(false);
  };

  return (
    <div onClick={closeDropdown}>
      {/* Navbar Container */}
      <div className='w-full h-[90px] fixed top-0 px-5 py-2 flex items-center justify-between bg-[#00000047] z-[100] backdrop-blur-sm'>
        {/* Logo */}
        <div className='lg:w-[20%] w-[40%] lg:pl-[50px]'>
          <img
            src={logo}
            className='w-[80px] h-[80px] rounded-[5px] border-2 border-white cursor-pointer'
            onClick={() => navigate("/")}
            alt="SkillSphere Logo"
          />
        </div>

        {/* Desktop Menu */}
        <div className='w-[30%] lg:flex items-center justify-center gap-4 hidden'>
          {!userData ? (
            <>
              <div className='relative'>
                <IoMdPerson
                  className='w-[50px] h-[50px] fill-white cursor-pointer border-2 border-[#fdfbfb] bg-[#000000d5] rounded-full p-2'
                  onClick={(e) => { e.stopPropagation(); setShowPro(prev => !prev) }}
                />
                {showPro && (
                  <div className='profile-dropdown absolute top-full right-0 mt-2 w-48 bg-black border-2 border-white rounded-lg shadow-lg z-20'>
                    <div
                      className='px-4 py-2 text-white cursor-pointer hover:bg-gray-700 rounded'
                      onClick={() => handleOptionClick("/login")}
                    >
                      Login
                    </div>
                  </div>
                )}
              </div>
              <div
                className='px-5 py-2 border-2 border-white bg-black text-white rounded-lg text-[18px] cursor-pointer'
                onClick={() => navigate("/login")}
              >
                Login
              </div>
            </>
          ) : (
            <>
              <button
                className='px-5 py-2 bg-white text-black rounded-lg text-[18px] font-light flex gap-2 items-center justify-center cursor-pointer'
                onClick={() => navigate("/searchwithai")}
              >
                Search with AI <img src={ai} className='w-[30px] h-[30px] rounded-full hidden lg:block' alt="" />
              </button>

              {userData?.role === "student" && (
                <>
                  <FaHeart
                    className='w-[30px] h-[30px] fill-red-500 cursor-pointer'
                    onClick={(e) => { e.stopPropagation(); navigate("/wishlist"); }}
                    title="Wishlist"
                  />
                  <div className='relative'>
                    <IoMdNotifications
                      className='w-[30px] h-[30px] fill-white cursor-pointer'
                      onClick={(e) => { e.stopPropagation(); setShowNotif(prev => !prev) }}
                      title="Notifications"
                    />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                    {showNotif && (
                      <div className='notification-dropdown absolute top-full left-0 mt-2 w-64 bg-black border-2 border-white rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto'>
                        {notifications.length > 0 ? (
                          notifications.map(notif => (
                            <div
                              key={notif._id}
                              className={`px-4 py-2 text-white cursor-pointer hover:bg-gray-700 rounded ${!notif.read ? 'bg-gray-800' : ''}`}
                              onClick={() => handleMarkAsRead(notif._id)}
                            >
                              <p className='text-sm'>{notif.message}</p>
                              <p className='text-xs text-gray-400'>{new Date(notif.createdAt).toLocaleDateString()}</p>
                            </div>
                          ))
                        ) : (
                          <div className='px-4 py-2 text-white'>No notifications</div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Profile Dropdown */}
              <div className='relative'>
                <div
                  className='w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer'
                  onClick={(e) => { e.stopPropagation(); setShowPro(prev => !prev) }}
                >
                  {userData.photoUrl ? (
                    <img src={userData.photoUrl} className='w-full h-full rounded-full object-cover' alt="" />
                  ) : (
                    <span>{userData?.name.slice(0, 1).toUpperCase()}</span>
                  )}
                </div>

                {showPro && (
                  <div className='profile-dropdown absolute top-full right-0 mt-2 w-48 bg-black border-2 border-white rounded-lg shadow-lg z-20'>
                    <div className='px-4 py-2 text-white cursor-pointer hover:bg-gray-700 flex items-center gap-2' onClick={() => handleOptionClick("/profile")}>
                      <IoMdPerson className='w-5 h-5' /> My Profile
                    </div>
                    <div className='px-4 py-2 text-white cursor-pointer hover:bg-gray-700 flex items-center gap-2' onClick={() => handleOptionClick("/enrolledcourses")}>
                      <FaBook className='w-5 h-5' /> My Courses
                    </div>
                    {userData.role === "student" && (
                      <>
                        <div className='px-4 py-2 text-white cursor-pointer hover:bg-gray-700 flex items-center gap-2' onClick={() => handleOptionClick("/wishlist")}>
                          <FaHeart className='w-5 h-5' /> Wishlist
                        </div>
                        <button
                          className='px-4 py-2 w-full text-left text-white bg-green-600 hover:bg-green-700 rounded flex items-center gap-2'
                          onClick={() => { setShowPro(false); handlePayment(); }}
                          disabled={isProcessingPayment}
                        >
                          <FaCreditCard className='w-5 h-5' /> {isProcessingPayment ? "Processing..." : "Make Payment"}
                        </button>
                      </>
                    )}
                    <div className='px-4 py-2 text-white cursor-pointer hover:bg-gray-700 flex items-center gap-2' onClick={() => handleOptionClick("/notifications")}>
                      <IoMdNotifications className='w-5 h-5' /> Notifications
                    </div>
                    <div className='px-4 py-2 text-white cursor-pointer hover:bg-gray-700 flex items-center gap-2' onClick={handleLogout}>
                      <MdLogout className='w-5 h-5' /> Logout
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          {userData?.role === "educator" && (
            <div className='px-5 py-2 border-2 border-white bg-black text-white rounded-lg text-[18px] cursor-pointer' onClick={() => navigate("/dashboard")}>
              Dashboard
            </div>
          )}
          {userData?.role === "admin" && (
            <div className='px-5 py-2 border-2 border-white bg-black text-white rounded-lg text-[18px] cursor-pointer' onClick={() => navigate("/admin/dashboard")}>
              Admin Panel
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <GiHamburgerMenu className='w-[30px] h-[30px] lg:hidden fill-white cursor-pointer' onClick={() => setShowHam(prev => !prev)} />
      </div>

      {/* Mobile Menu */}
      <div className={`fixed top-0 w-[100vw] h-[100vh] bg-[#000000d6] flex flex-col items-center justify-center gap-5 z-10 transition-transform duration-500 ease-in-out ${showHam ? "translate-x-0" : "-translate-x-full"}`}>
        <GiSplitCross className='w-[35px] h-[35px] fill-white absolute top-5 right-5 cursor-pointer' onClick={() => setShowHam(false)} />
        {userData ? (
          <>
            <div className='w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white'>
              {userData.photoUrl ? <img src={userData.photoUrl} className='w-full h-full rounded-full object-cover' alt="" /> : userData.name.slice(0, 1).toUpperCase()}
            </div>
            <span className='menu-item' onClick={() => { navigate("/profile"); setShowHam(false) }}>My Profile</span>
            <span className='menu-item' onClick={() => { navigate("/enrolledcourses"); setShowHam(false) }}>My Courses</span>
            {userData.role === "student" && <span className='menu-item' onClick={() => { navigate("/wishlist"); setShowHam(false) }}>Wishlist</span>}
            <span className='menu-item' onClick={() => { navigate("/notifications"); setShowHam(false) }}>Notifications</span>
            {userData.role === "educator" && <span className='menu-item' onClick={() => { navigate("/dashboard"); setShowHam(false) }}>Dashboard</span>}
            {userData.role === "admin" && <span className='menu-item' onClick={() => { navigate("/admin/dashboard"); setShowHam(false) }}>Admin Panel</span>}
            <span className='menu-item' onClick={() => { handleLogout(); setShowHam(false) }}>Logout</span>
          </>
        ) : (
          <span className='menu-item' onClick={() => { navigate("/login"); setShowHam(false) }}>Login</span>
        )}
      </div>
    </div>
  );
}

export default Nav;
