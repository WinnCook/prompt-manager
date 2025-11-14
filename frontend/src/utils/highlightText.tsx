import React from 'react';

/**
 * Highlight search terms in text
 * @param text - Text to search in
 * @param query - Search query to highlight
 * @returns React elements with highlighted matches
 */
export function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) {
    return text;
  }

  // Escape special regex characters in query
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Create regex for case-insensitive matching
  const regex = new RegExp(`(${escapedQuery})`, 'gi');

  // Split text by matches
  const parts = text.split(regex);

  return parts.map((part, index) => {
    // If part matches query (case-insensitive), highlight it
    if (part.toLowerCase() === query.toLowerCase()) {
      return (
        <mark
          key={index}
          style={{
            backgroundColor: '#ffeb3b',
            padding: '0 2px',
            borderRadius: '2px',
            fontWeight: 500,
          }}
        >
          {part}
        </mark>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

/**
 * Truncate text and add ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

/**
 * Get context around search match (like Google search results)
 * @param text - Full text
 * @param query - Search query
 * @param contextLength - Number of characters to show on each side
 * @returns Text snippet with context
 */
export function getSearchContext(
  text: string,
  query: string,
  contextLength: number = 50
): string {
  if (!query.trim()) {
    return truncateText(text, contextLength * 2);
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return truncateText(text, contextLength * 2);
  }

  const start = Math.max(0, index - contextLength);
  const end = Math.min(text.length, index + query.length + contextLength);

  let snippet = text.substring(start, end);

  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';

  return snippet;
}
