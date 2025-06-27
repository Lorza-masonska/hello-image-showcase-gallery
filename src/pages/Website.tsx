
import React from 'react';
import NavigationBar from '@/components/NavigationBar';

const Website = () => {
  return (
    <div className="min-h-screen bg-sky-50">
      <NavigationBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            O Tej Stronie
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Stworzyłem tę stronę, aby pokazać światu, co mnie śmieszy. To miejsce to moje dzieło, tworzone z pasji do programowania, ale też zwyczajnie z nudów. Chciałem mieć przestrzeń, w której mogę zbierać i publikować memy oraz obrazy, które uważam za zabawne, dziwne albo po prostu warte pokazania.

Nie zależało mi na robieniu czegoś profesjonalnego czy perfekcyjnego. Zależało mi na autentyczności. Ta strona to coś osobistego – galeria mojego humoru i spojrzenia na internetowy śmietnik obrazków.

Nie znajdziesz tu reklam, niepotrzebnych dodatków ani algorytmów wybierających, co masz zobaczyć. Wszystko, co jest na stronie, dodałem ręcznie, bo mnie to bawi albo wywołuje jakiś dziwny rodzaj satysfakcji.

Projekt rozwijam na bieżąco – dorzucam nowe rzeczy, zmieniam układ, poprawiam szczegóły. To ciągle żyje i trochę też ewoluuje razem ze mną. Jeśli kogoś to rozbawi – super. Jeśli nie – też okej. Strona powstała głównie dla mnie, ale jeśli ktoś się na niej uśmiechnie, to tylko lepiej.
              </p>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Website;
