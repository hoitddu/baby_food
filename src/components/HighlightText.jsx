/**
 * HighlightText Component
 * Highlights matching search terms within text
 */

/**
 * Highlights search term matches in text
 * @param {string} text - The full text to search within
 * @param {string} searchTerm - The term to highlight
 * @returns {JSX.Element} - Text with highlighted matches
 */
export function HighlightText({ text, searchTerm }) {
  if (!searchTerm || !text) {
    return <>{text}</>
  }

  // Escape special regex characters in search term
  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Create regex for case-insensitive matching
  const regex = new RegExp(`(${escapedSearchTerm})`, 'gi')

  // Split text by matches
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, index) => {
        // Check if this part matches the search term (case-insensitive)
        const isMatch = part.toLowerCase() === searchTerm.toLowerCase()

        return isMatch ? (
          <mark
            key={index}
            style={{
              background: 'linear-gradient(135deg, #FFD180 0%, #FFAB40 100%)',
              color: '#4E342E',
              fontWeight: '700',
              padding: '2px 4px',
              borderRadius: '4px',
              border: 'none'
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      })}
    </>
  )
}

export default HighlightText
