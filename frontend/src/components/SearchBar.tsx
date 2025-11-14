import { useState, useEffect, useRef } from 'react';
import { useUIStore } from '@/store';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search prompts...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const debounceTimer = useRef<number | null>(null);

  // Debounce search input (300ms)
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = window.setTimeout(() => {
      if (query.trim()) {
        onSearch(query.trim());
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // If cleared, immediately trigger empty search
    if (newQuery === '') {
      onSearch('');
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch(''); // Clear search results
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {query && (
        <button
          className="search-clear"
          onClick={handleClear}
          title="Clear search (Esc)"
        >
          ✕
        </button>
      )}
    </div>
  );
}
