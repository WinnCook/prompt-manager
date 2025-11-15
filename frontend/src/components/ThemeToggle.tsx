import { useState, useEffect, useRef } from 'react';
import { useUIStore } from '@/store';
import './ThemeToggle.css';

interface ThemeOption {
  value: 'light' | 'dark' | 'system';
  label: string;
  icon: string;
}

const themeOptions: ThemeOption[] = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'system', label: 'System', icon: '💻' },
];

export function ThemeToggle() {
  const { theme, setTheme } = useUIStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = themeOptions.find(opt => opt.value === theme) || themeOptions[2];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleThemeSelect = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="theme-toggle" ref={dropdownRef}>
      <button
        className="theme-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        title={`Current theme: ${currentOption.label}`}
        aria-label="Toggle theme"
        aria-expanded={isOpen}
      >
        <span className="theme-icon">{currentOption.icon}</span>
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          {themeOptions.map(option => (
            <button
              key={option.value}
              className={`theme-option ${theme === option.value ? 'active' : ''}`}
              onClick={() => handleThemeSelect(option.value)}
            >
              <span className="theme-option-icon">{option.icon}</span>
              <span className="theme-option-label">{option.label}</span>
              {theme === option.value && (
                <span className="theme-option-check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
