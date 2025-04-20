// Format date to more readable form
export const formatDate = (date: Date | string) => {
  // Check if date is a string and convert it to a Date object
  const dateObj = typeof date === 'string' ? new Date(date) : date

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date' // Handle invalid date
  }

  const options = { year: 'numeric', month: 'long', day: 'numeric' } as const
  return dateObj.toLocaleDateString('en-US', options)
}
