'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Ask anything...",
  disabled = false,
}: SearchInputProps) {
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Input validation and sanitization
    const sanitizedQuery = value.trim();
    
    if (!sanitizedQuery) {
      setError('Please enter a search query');
      return;
    }

    // Basic prompt injection prevention
    const potentialInjection = /(javascript:|data:|vbscript:|onload=|onerror=)/i;
    if (potentialInjection.test(sanitizedQuery)) {
      setError('Invalid characters detected in query');
      return;
    }

    setError('');
    onSubmit(sanitizedQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      // Allow shift+enter for new lines if this becomes a textarea
      return;
    } else if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Prevent excessive input length
    if (newValue.length > 1000) {
      setError('Query too long (max 1000 characters)');
      return;
    }

    setError('');
    onChange(newValue);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full" role="search">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search 
            className="h-5 w-5 text-gray-400" 
            aria-hidden="true"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={`block w-full pl-10 pr-4 py-3 border rounded-lg text-gray-900 dark:text-white 
            bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            placeholder-gray-500 dark:placeholder-gray-400
            ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
          placeholder={placeholder}
          disabled={disabled}
          aria-label="Search query"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'search-error' : undefined}
          maxLength={1000}
        />
      </div>
      
      {error && (
        <p id="search-error" className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}