
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavigationBar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { name: 'About Me', path: '/about' },
    { name: 'Gallery', path: '/' },
    { name: 'Website', path: '/website' },
    { name: 'Community Memy', path: '/community-memes' }
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
            O mnie
          </Link>
          
          <Link
            to="/"
            className={`py-4 px-6 text-lg font-medium transition-colors ${
              isActive('/')
                ? 'text-black border-b-2 border-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Główna
          </Link>
          
          <Link
            to="/website"
            className={`py-4 px-6 text-lg font-medium transition-colors ${
              isActive('/website')
                ? 'text-black border-b-2 border-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            O stronie
          </Link>
          
          <Link
            to="/community-memes"
            className={`py-4 px-6 text-lg font-medium transition-colors ${
              isActive('/community-memes')
                ? 'text-black border-b-2 border-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Community Memy
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
