import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { ToastContainer} from 'react-toastify';
import ForgotPassword from './pages/ForgotPassword'
import AuthCallback from './pages/AuthCallback'
import useFetchCurrentUser from './customHooks/useFetchCurrentUser'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Dashboard from './pages/admin/Dashboard'
import Courses from './pages/admin/Courses'
import AllCouses from './pages/AllCouses'
import AddCourses from './pages/admin/AddCourses'
import CreateCourse from './pages/admin/CreateCourse'
import CreateLecture from './pages/admin/CreateLecture'
import EditLecture from './pages/admin/EditLecture'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import SystemSettings from './pages/admin/SystemSettings'
import LiveStream from './components/LiveStream'
import Chatbot from './components/ChatBot'

import getCouseData from './customHooks/getCouseData'
import ViewCourse from './pages/ViewCourse'
import ScrollToTop from './components/ScrollToTop'
import getCreatorCourseData from './customHooks/getCreatorCourseData'
import EnrolledCourse from './pages/EnrolledCourse'
import ViewLecture from './pages/ViewLecture'
import SearchWithAi from './pages/SearchWithAi'
import Wishlist from './pages/Wishlist'
import Notifications from './pages/Notifications'
import getAllReviews from './customHooks/getAllReviews'

export const serverUrl = "http://localhost:8000"

function App() {
  
  let {userData} = useSelector(state=>state.user)

  useFetchCurrentUser()
  getCouseData()
  getCreatorCourseData()
  getAllReviews()
  return (
    <>
      <ToastContainer />
      <ScrollToTop/>
      {userData?.role === "student" && <Chatbot isStudent={true} />}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={"/"}/>}/>
        <Route path='/profile' element={userData?<Profile/>:<Navigate to={"/signup"}/>}/>
        <Route path='/allcourses' element={userData?<AllCouses/>:<Navigate to={"/signup"}/>}/>
        <Route path='/viewcourse/:courseId' element={userData?<ViewCourse/>:<Navigate to={"/signup"}/>}/>
        <Route path='/editprofile' element={userData?<EditProfile/>:<Navigate to={"/signup"}/>}/>
        <Route path='/enrolledcourses' element={userData?<EnrolledCourse/>:<Navigate to={"/signup"}/>}/>
        <Route path='/viewlecture/:courseId' element={userData?<ViewLecture/>:<Navigate to={"/signup"}/>}/>
        <Route path='/live/:lectureId' element={userData ? <LiveStream /> : <Navigate to={"/signup"}/> }/>
        <Route path='/searchwithai' element={userData?<SearchWithAi/>:<Navigate to={"/signup"}/>}/>
        <Route path='/wishlist' element={userData?.role === "student"?<Wishlist/>:<Navigate to={"/signup"}/>}/>
        <Route path='/notifications' element={userData?<Notifications/>:<Navigate to={"/signup"}/>}/>

        <Route path='/dashboard' element={userData?.role === "educator"?<Dashboard/>:<Navigate to={"/signup"}/>}/>
        <Route path='/courses' element={userData?.role === "educator"?<Courses/>:<Navigate to={"/signup"}/>}/>
        <Route path='/addcourses/:courseId' element={userData?.role === "educator"?<AddCourses/>:<Navigate to={"/signup"}/>}/>
        <Route path='/createcourses' element={userData?.role === "educator"?<CreateCourse/>:<Navigate to={"/signup"}/>}/>
        <Route path='/createlecture/:courseId' element={userData?.role === "educator"?<CreateLecture/>:<Navigate to={"/signup"}/>}/>
        <Route path='/editlecture/:courseId/:lectureId' element={userData?.role === "educator"?<EditLecture/>:<Navigate to={"/signup"}/>}/>
        
        <Route path='/admin/dashboard' element={userData?.role === "admin" ? <AdminDashboard /> : <Navigate to={"/signup"} />}/>
        <Route path='/admin/users' element={userData?.role === "admin" ? <UserManagement /> : <Navigate to={"/signup"} />}/>
        <Route path='/admin/settings' element={userData?.role === "admin" ? <SystemSettings /> : <Navigate to={"/signup"} />}/>
        
        <Route path='/forgotpassword' element={<ForgotPassword/>}/>
        <Route path='/auth/callback' element={<AuthCallback/>}/>
      </Routes>
    </>
  )
}

export default App
