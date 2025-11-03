import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { setCreatorCourseData } from '../redux/courseSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const getCreatorCourseData = () => {
    const dispatch = useDispatch()
    const {userData} = useSelector(state=>state.user)

  useEffect(()=>{
    // Only fetch creator-specific data when we have an authenticated user.
    // This prevents public page loads from triggering protected endpoints
    // that return 401 and cause a redirect via the axios interceptor.
    if (!userData) return

    const getCreatorData = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreatorcourses" , {withCredentials:true})
        await dispatch(setCreatorCourseData(result.data))
        console.log(result.data)
      } catch (error) {
        console.log(error)
        // Only show a toast for non-auth-related errors
        if (error.response?.status !== 401) {
          toast.error(error.response?.data?.message || 'Failed to fetch creator courses')
        }
      }
    }

    getCreatorData()
  },[userData, dispatch])
}

export default getCreatorCourseData
