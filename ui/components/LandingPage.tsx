'use client';

import { useState } from 'react';
import { Settings, MessageCircle, Zap, Brain, Globe, Book } from 'lucide-react';
import SearchInput from './SearchInput';
import FocusModeDropdown, { FocusMode } from './FocusModeDropdown';

const focusModes: FocusMode[] = [
  {
    id: 'web',
    name: 'Web Search',
    description: 'Search across the entire web',
    icon: <Globe className="w-4 h-4" />,
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Focus on scholarly articles and papers',
    icon: <Book className="w-4 h-4" />,
  },
  {
    id: 'writing',
    name: 'Writing Assistant',
    description: 'Help with writing and content creation',
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: 'wolfram',
    name: 'Computational',
    description: 'Mathematical and scientific queries',
    icon: <Brain className="w-4 h-4" />,
  },
];

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState(focusModes[0]);
  const [showSettings, setShowSettings] = useState(false);

  const handleSearchSubmit = (searchQuery: string) => {
    // Handle search submission with validation
    console.log('Searching:', searchQuery, 'with mode:', selectedMode.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Perplexica</h1>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Section */}
          <div className="lg:col-span-3">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Search Smarter
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Ask questions, get answers, and explore the web with AI-powered intelligence
              </p>
            </div>

            {/* Search Form */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <SearchInput
                    value={query}
                    onChange={setQuery}
                    onSubmit={handleSearchSubmit}
                    placeholder="Ask anything..."
                  />
                </div>
                <div className="w-64">
                  <FocusModeDropdown
                    modes={focusModes}
                    selectedMode={selectedMode}
                    onModeChange={setSelectedMode}
                  />
                </div>
              </div>
            </div>

            {/* Chat History Placeholder */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Recent Conversations
                  </h3>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View all conversations
                </button>
              </div>
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your API key"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    AI Model
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>GPT-4</option>
                    <option>GPT-3.5</option>
                    <option>Claude-3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Focus Mode
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {selectedMode.icon}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedMode.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {selectedMode.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Focus Modes Info */}
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Focus Modes</h4>
              <div className="space-y-2">
                {focusModes.map((mode) => (
                  <div key={mode.id} className="flex items-start space-x-2">
                    <div className="text-gray-400 mt-0.5">{mode.icon}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{mode.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{mode.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}