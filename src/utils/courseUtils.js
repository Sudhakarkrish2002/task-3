/**
 * Get display student count for a course
 * If enrolledCount exists and is > 0, use it
 * Otherwise, generate a random number less than 1000
 */
export const getDisplayStudentCount = (course) => {
  if (course.enrolledCount && course.enrolledCount > 0) {
    return course.enrolledCount
  }
  
  // Generate a random number between 50 and 999 for display purposes
  // Use course ID as seed for consistency (same course always shows same number)
  const seed = course._id || course.id || Math.random()
  const hash = seed.toString().split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0)
  }, 0)
  const random = Math.abs(hash) % 950 + 50 // Range: 50-999
  return random
}

/**
 * Format student count for display
 */
export const formatStudentCount = (count) => {
  if (!count) return '0+'
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K+`
  }
  return `${count}+`
}

