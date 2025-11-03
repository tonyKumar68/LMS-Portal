import React from 'react'
import { useSelector } from 'react-redux'
import CourseCard from './Card'

const ReadyToStart = () => {
  const { courseData } = useSelector(state => state.course)

  // Pick top 4 courses (fallback to first 4)
  const popular = (courseData || []).slice(0, 4)

  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold mb-2">Ready to reimagine your carrer?</h3>
        <p className="text-gray-600 mb-6">Choose from our most popular courses and start learning today.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popular.map(course => (
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
      </div>
    </section>
  )
}

export default ReadyToStart
