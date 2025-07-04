
import ImageGallery from "@/components/ImageGallery";
import NavigationBar from "@/components/NavigationBar";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  return (
    <div className="min-h-screen bg-sky-50">
      <NavigationBar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-4 animate-fade-in">
            Witaj!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Bardzo się cieszę że mnie odwiedziłeś na tej stronie. Tutaj, drogi użytkowniku,
  znajdziesz wszystkie cursed images i memy, które kiedykolwiek wstawiłem lub też nie. 
  Strona jest regularnie update'owana więc jeżeli czegoś nie ma, to za jakiś czas się pojawi. 
  Miłego oglądania
          </p>
        </div>

        {/* Image Gallery */}
        <div className="mt-12">
          <ImageGallery />
        </div>

        {/* Footer */}
        <div className="mt-16 pb-8">
          <Separator className="mb-6" />
          <div className="text-center text-sm text-gray-600 space-y-2">
            <div>
              <span className="font-medium">Wersja:</span> 16390e8
            </div>
            <div>
              <span className="font-medium">Kontakt:</span>
            </div>
            <div className="space-y-1">
              <div>Discord: treexno_</div>
              <div>TikTok: @lorza_masonska</div>
              <div>Instagram: lorzamasonska_</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
