
import React from 'react';
import NavigationBar from '@/components/NavigationBar';

const About = () => {
  return (
    <div className="min-h-screen bg-sky-50">
      <NavigationBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            About Me
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Welcome to my personal space! I'm passionate about photography and capturing 
                moments that tell stories. Through my lens, I explore the world around me 
                and share these experiences with others.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                This gallery represents a collection of my favorite captures, each image 
                carefully selected to showcase different perspectives and emotions. Whether 
                it's landscapes, portraits, or everyday moments, I believe every photograph 
                has its own unique narrative.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Feel free to browse through my gallery and experience these visual stories. 
                I hope you find something that resonates with you and brings a moment of 
                joy or contemplation to your day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
