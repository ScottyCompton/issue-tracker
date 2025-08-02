import _ from 'underscore'

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

const toProperCase = (snakeCaseString: string) => {
    // 1. Convert to lowercase and split by underscore
    const words = snakeCaseString.toLowerCase().split('_')
    // 2. Capitalize the first letter of each word
    // You can use Underscore's _.map here, or a native Array.prototype.map
    const properCaseWords = _.map(words, function (word: string) {
        if (word.length === 0) {
            return '' // Handle empty strings that might result from multiple underscores
        }
        return word.charAt(0).toUpperCase() + word.slice(1)
    })

    // 3. Join the words with spaces
    return properCaseWords.join(' ')
}

export { formatDate, toProperCase }
