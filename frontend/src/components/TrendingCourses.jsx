import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import CourseCard from './Card'
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa'

const TrendingCourses = () => {
  const { courseData } = useSelector(state => state.course)
  const [startIndex, setStartIndex] = useState(0)
  const visibleCount = 4

  const courses = courseData || []

  const maxStart = Math.max(0, courses.length - visibleCount)

  const visible = useMemo(() => {
    return courses.slice(startIndex, startIndex + visibleCount)
  }, [courses, startIndex])

  if (courses.length === 0) return null

  const handleNext = () => {
    setStartIndex(prev => Math.min(prev + 1, maxStart))
  }

  const handlePrev = () => {
    setStartIndex(prev => Math.max(prev - 1, 0))
  }

  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Trending courses</h3>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visible.map(course => (
              <CourseCard
                key={course._id || course.id}
                id={course._id || course.id}
                thumbnail={course.thumbnail || course.image}
                title={course.title || course.name}
                category={course.category || course.subcategory || ''}
                price={course.price || course.cost || 0}
                reviews={course.reviews || []}
                description={course.description || course.summary || ''}
              />
            ))}
          </div>

          {/* Left arrow */}
          {startIndex > 0 && (
            <button onClick={handlePrev} className="hidden lg:flex items-center justify-center absolute left-[-10px] top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow">
              <FaChevronLeft />
            </button>
          )}

          {/* Right arrow */}
          {startIndex + visibleCount < courses.length && (
            <button onClick={handleNext} className="hidden lg:flex items-center justify-center absolute right-[-10px] top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow">
              <FaChevronRight />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default TrendingCourses
