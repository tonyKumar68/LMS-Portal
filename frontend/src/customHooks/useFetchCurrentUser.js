import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setUserData } from '../redux/userSlice'
import { serverUrl } from '../App'

const useFetchCurrentUser = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(serverUrl + '/api/user/current', { withCredentials: true })
        dispatch(setUserData(response.data.user))
      } catch (error) {
        dispatch(setUserData(null))
        console.error('Failed to fetch current user:', error)
      }
    }

    fetchUser()
  }, [dispatch])
}

export default useFetchCurrentUser
