import React from 'react';
import NavigationBar from '@/components/NavigationBar';

const About = () => {
  return (
    <div className="min-h-screen bg-sky-50">
      <NavigationBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            O Mnie
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Cześć, jestem Lorza. Bardzo lubię memy i informatykę. W wolnym czasie grzebię przy projektach webowych, uczę się nowych technologii i kombinuję, jak coś zbudować albo zepsuć dla nauki. Mam <a href="https://www.tiktok.com/@lorza_masonska" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">TikToka</a>, na którego od czasu do czasu wrzucam jakieś rzeczy – czasem śmieszne, czasem dziwne, czasem po prostu z nudów.<br />
                <br />
                Nie traktuję siebie przesadnie serio, ale lubię mieć miejsce, w którym mogę coś pokazać — czy to memy, czy jakiś mały projekt, który zrobiłem. Ta strona to jedna z takich rzeczy. Połączenie mojego poczucia humoru i zajawki na kod.<br />
                <br />
                Jeśli też siedzisz w memach, informatyce, albo po prostu lubisz się pośmiać z czegoś głupiego — to dobrze trafiłeś.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
