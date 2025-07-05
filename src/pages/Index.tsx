
import ImageGallery from "@/components/ImageGallery";
import NavigationBar from "@/components/NavigationBar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useGitCommitHash } from "@/hooks/useGitCommitHash";

const Index = () => {
  const { commitHash, loading, forceRefresh } = useGitCommitHash();

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
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium">Wersja:</span> 
              {loading ? 'ładowanie...' : commitHash}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={forceRefresh}
                disabled={loading}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
              </Button>
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
