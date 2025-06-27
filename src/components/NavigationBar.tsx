
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavigationBar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { name: 'About Me', path: '/about' },
    { name: 'Gallery', path: '/' },
    { name: 'Website', path: '/website' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link
            to="/about"
            className={`py-4 px-6 text-lg font-medium transition-colors ${
              isActive('/about')
                ? 'text-black border-b-2 border-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            About Me
          </Link>
          
          <Link
            to="/"
            className={`py-4 px-6 text-lg font-medium transition-colors ${
              isActive('/')
                ? 'text-black border-b-2 border-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Gallery
          </Link>
          
          <Link
            to="/website"
            className={`py-4 px-6 text-lg font-medium transition-colors ${
              isActive('/website')
                ? 'text-black border-b-2 border-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Website
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
