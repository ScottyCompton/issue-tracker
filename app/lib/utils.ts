

const formatDate = (dateString: string | Date) => {
    let date: Date
    
    if (typeof dateString === 'string') {
      // Check if it's a numeric string (Unix timestamp in milliseconds)
      if (/^\d+$/.test(dateString)) {
        date = new Date(parseInt(dateString))
      } else {
        date = new Date(dateString)
      }
    } else {
      date = new Date(dateString)
    }
    
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toDateString()
  }

  export { formatDate }