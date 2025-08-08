'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FocusMode {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
}

interface FocusModeDropdownProps {
  modes: FocusMode[];
  selectedMode: FocusMode;
  onModeChange: (mode: FocusMode) => void;
  disabled?: boolean;
}

export default function FocusModeDropdown({
  modes,
  selectedMode,
  onModeChange,
  disabled = false,
}: FocusModeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
    }
  };

  const handleModeSelect = (mode: FocusMode) => {
    onModeChange(mode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left 
          bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
          rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 
          focus:outline-none focus:ring-2 focus:ring-blue-500 
          disabled:opacity-50 disabled:cursor-not-allowed"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select focus mode"
      >
        <span className="flex items-center">
          {selectedMode.icon && <span className="mr-2">{selectedMode.icon}</span>}
          {selectedMode.name}
        </span>
        <ChevronDown 
          className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div 
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
            rounded-lg shadow-lg max-h-60 overflow-auto"
          role="listbox"
          aria-activedescendant={`mode-${selectedMode.id}`}
        >
          <div className="py-1">
            {modes.map((mode) => (
              <button
                key={mode.id}
                id={`mode-${mode.id}`}
                type="button"
                role="option"
                aria-selected={mode.id === selectedMode.id}
                onClick={() => handleModeSelect(mode)}
                className={`flex items-center w-full px-4 py-2 text-sm text-left 
                  ${mode.id === selectedMode.id 
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100' 
                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
              >
                {mode.icon && <span className="mr-2">{mode.icon}</span>}
                <div className="flex-1">
                  <div className="font-medium">{mode.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{mode.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}