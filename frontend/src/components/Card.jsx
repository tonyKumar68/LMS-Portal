import React, { useState, useEffect } from "react";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../redux/userSlice';
import { serverUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
const CourseCard = ({ thumbnail, title, category, price ,id , reviews, description }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userData, wishlist } = useSelector(state => state.user)
  const [isInWishlist, setIsInWishlist] = useState(false)

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(reviews);

  useEffect(() => {
    if (userData && userData.role === "student") {
      setIsInWishlist(wishlist.includes(id))
    }
  }, [wishlist, id, userData])

  const handleWishlistClick = async (e) => {
    e.stopPropagation()
    if (!userData || userData.role !== "student") {
      toast.error("Only students can use wishlist")
      return
    }
    try {
      if (isInWishlist) {
        await axios.post(serverUrl + "/api/user/removefromwishlist", { courseId: id }, { withCredentials: true })
        dispatch(removeFromWishlist(id))
        toast.success("Removed from wishlist")
      } else {
        await axios.post(serverUrl + "/api/user/addtowishlist", { courseId: id }, { withCredentials: true })
        dispatch(addToWishlist(id))
        toast.success("Added to wishlist")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Wishlist update failed")
    }
  }
  const [showModal, setShowModal] = React.useState(false)

  const openModal = (e) => {
    e?.stopPropagation()
    setShowModal(true)
  }

  const closeModal = (e) => {
    e?.stopPropagation()
    setShowModal(false)
  }

  const handleStartSubscription = (e) => {
    e?.stopPropagation()
    // Redirect to login as requested
    navigate('/login')
    setShowModal(false)
  }

  // Click behavior for the whole card: navigate if authenticated, otherwise open modal
  const onCardClick = (e) => {
    // don't let inner buttons (wishlist, modal buttons) trigger this
    e?.stopPropagation()
    if (userData) {
      navigate(`/viewcourse/${id}`)
    } else {
      openModal()
    }
  }

  // Normalize thumbnail URL: if it's not an absolute URL, prefix with serverUrl
  const getImageSrc = (thumb) => {
    if (!thumb) return '/placeholder-course.jpg'
    if (typeof thumb !== 'string') return '/placeholder-course.jpg'
    if (thumb.startsWith('http://') || thumb.startsWith('https://')) return thumb
    // If thumb is already an absolute path on the backend (starts with '/'), just prefix serverUrl
    if (thumb.startsWith('/')) return serverUrl + thumb
    // Otherwise ensure a slash between serverUrl and thumb
    return serverUrl + '/' + thumb
  }

  const imgSrc = getImageSrc(thumbnail)

  return (
    <div className="max-w-sm w-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-300 relative cursor-pointer" onClick={onCardClick}>
      {/* Thumbnail */}
      <img
        src={imgSrc}
        alt={title}
        className="w-full h-48 object-cover"
      />
      {userData && userData.role === "student" && (
        <div className="absolute top-2 right-2" onClick={handleWishlistClick}>
          {isInWishlist ? <FaHeart className="w-6 h-6 text-red-500 cursor-pointer" /> : <FaRegHeart className="w-6 h-6 text-gray-500 cursor-pointer" />}
        </div>
      )}

      {/* Content */}
      <div className="p-5 space-y-2">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

        {/* Category */}
        <span className="px-2 py-0.5 bg-gray-100 rounded-full text-gray-700 capitalize">
            {category}
          </span>
        

        {/* Meta info */}
        <div className="flex justify-between text-sm text-gray-600 mt-3 px-[10px]">
          
          <span className="font-semibold text-gray-800">₹{price}</span>
         
           <span className="flex items-center gap-1 ">
            <FaStar className="text-yellow-500" /> {avgRating}
          </span>
          
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={closeModal}></div>
          <div className="bg-white max-w-4xl w-full mx-4 rounded-lg shadow-2xl z-60 overflow-hidden">
            {/* Header with close button */}
            <div className="relative p-6 border-b">
              <button 
                onClick={closeModal} 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            </div>

            <div className="flex flex-col lg:flex-row">
              {/* Left column with image and description */}
              <div className="lg:w-2/3 p-6">
                <img 
                  src={getImageSrc(thumbnail)} 
                  alt={title} 
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
                <div className="space-y-6">
                  <div>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {description || 'No description available for this course.'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">What you'll learn</h3>
                    <ul className="grid grid-cols-1 gap-3">
                      {/* Add your key points here. These should come from course data */}
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Master core concepts and advanced techniques</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Build real-world projects for your portfolio</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Get industry-ready with practical exercises</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right column with pricing and CTA */}
              <div className="lg:w-1/3 p-6 bg-gray-50">
                <div className="sticky top-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-3xl font-bold">₹{price}</div>
                    <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                      <FaStar className="text-yellow-500" />
                      <span className="font-semibold">{avgRating}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleStartSubscription}
                    className="w-full py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
                  >
                    Start Subscription
                  </button>

                  <p className="text-center text-gray-600 text-sm italic">
                    Why are you still looking? Take subscription and shape your career.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
