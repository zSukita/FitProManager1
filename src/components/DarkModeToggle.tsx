import { useTheme } from '../lib/theme';

  const DarkModeToggle = () => {
    const { darkMode, toggleDarkMode } = useTheme();
    
    return (
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? (
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 10h1m15.3-3a9 9 0 1 0-15.3 0m15.3 0a9 9 0 1 0-15.3 0" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 2 2 0 0111 2h1a2 2 0 012 2 9 9 0 011.414 17.646m-15.354-1.414A2 2 0 014 13H2a10 10 0 002 13 2 2 0 011 1.75L5.75 21H18.25l1.75-1.75A10 10 0 0019 10a9 9 0 01-2.354 6.354z" />
          </svg>
        )}
      </button>
    );
  };

  export default DarkModeToggle;
