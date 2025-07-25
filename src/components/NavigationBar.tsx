
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

const NavigationBar = () => {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = () => {
    const adminAccess = localStorage.getItem('adminAccess') === 'true';
    setIsAdmin(adminAccess);
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { name: 'O mnie', path: '/about' },
    { name: 'Kategorie', path: '/categories' },
    { name: 'Główna', path: '/' },
    { name: 'Community Memy', path: '/community-memes' },
    { name: 'O stronie', path: '/website' },
    ...(isAdmin ? [
      { name: 'Dashboard', path: '/dashboard' },
      { name: '10 Minute Mail', path: '/temp-mail' }
    ] : [])
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`py-4 px-6 text-lg font-medium transition-colors ${
                isActive(item.path)
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
