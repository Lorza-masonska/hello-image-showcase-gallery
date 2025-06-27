
import React from 'react';
import NavigationBar from '@/components/NavigationBar';

const Website = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavigationBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            About This Website
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                This website was built using modern web technologies to provide a seamless 
                and responsive experience for viewing my photo collection. The gallery 
                automatically fetches images from my private GitHub repository, ensuring 
                that new photos are always up to date.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Responsive grid layout that adapts to different screen sizes</li>
                <li>Full-screen preview mode with navigation controls</li>
                <li>Automatic image loading from GitHub repository</li>
                <li>Clean, modern design focused on showcasing the photography</li>
                <li>Fast loading times and optimized performance</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Technology Stack</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Built with React, TypeScript, and Tailwind CSS for a modern, maintainable, 
                and visually appealing experience. The site is hosted and automatically 
                deployed to ensure reliability and fast global access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Website;
