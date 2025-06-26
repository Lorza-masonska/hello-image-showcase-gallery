
import ImageGallery from "@/components/ImageGallery";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-4 animate-fade-in">
            Hi
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Welcome to my personal photo gallery! Here you can view all the images 
            from my curated collection. These photos are stored in a private GitHub 
            repository and are displayed here for easy browsing.
          </p>
        </div>

        {/* Image Gallery */}
        <div className="mt-12">
          <ImageGallery />
        </div>
      </div>
    </div>
  );
};

export default Index;
