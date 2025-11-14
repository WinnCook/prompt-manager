import { Prompt } from '@/types/api';
import { useFolderStore, useUIStore } from '@/store';
import { highlightText, getSearchContext } from '@/utils/highlightText';
import './SearchResults.css';

interface SearchResultsProps {
  prompts: Prompt[];
  query: string;
  total: number;
  onSelect: (prompt: Prompt) => void;
}

export function SearchResults({ prompts, query, total, onSelect }: SearchResultsProps) {
  const { getFolderById } = useFolderStore();

  const getFolderPath = (folderId: number): string => {
    const folder = getFolderById(folderId);
    return folder?.path || 'Unknown';
  };

  if (prompts.length === 0) {
    return (
      <div className="search-results-empty">
        <p>No results found for "{query}"</p>
        <small>Try a different search term</small>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="search-results-header">
        <h3>Search Results</h3>
        <span className="results-count">{total} result{total !== 1 ? 's' : ''} found</span>
      </div>

      <div className="search-results-list">
        {prompts.map((prompt) => {
          const contentSnippet = getSearchContext(prompt.content, query, 60);

          return (
            <div
              key={prompt.id}
              className="search-result-item"
              onClick={() => onSelect(prompt)}
            >
              <div className="result-title">
                {highlightText(prompt.title, query)}
              </div>

              <div className="result-snippet">
                {highlightText(contentSnippet, query)}
              </div>

              <div className="result-meta">
                <span className="result-folder">
                  📁 {getFolderPath(prompt.folder_id)}
                </span>

                {prompt.tags && prompt.tags.length > 0 && (
                  <div className="result-tags">
                    {prompt.tags.map((tag, index) => (
                      <span key={index} className="result-tag">
                        {highlightText(tag, query)}
                      </span>
                    ))}
                  </div>
                )}

                <span className="result-date">
                  Updated: {new Date(prompt.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
