import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import NavigationBar from '@/components/NavigationBar';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  description: string;
  image_urls: string[];
  created_at: string;
  updated_at: string;
}

interface Image {
  id: string;
  url: string;
  name: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'gallery'>('list');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Formularz dla nowej/edytowanej kategorii
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedImages: [] as string[]
  });

  // Lista dostępnych obrazów
  const [availableImages, setAvailableImages] = useState<Image[]>([]);

  useEffect(() => {
    checkAdminStatus();
    fetchCategories();
    loadAvailableImages();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase.rpc('is_admin');
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data === true);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching categories:', error);
        toast.error('Błąd podczas pobierania kategorii');
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Błąd podczas pobierania kategorii');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableImages = () => {
    try {
      const imageModules = import.meta.glob('/src/assets/images/*.{png,jpg,jpeg,gif,webp}', { 
        eager: true,
        as: 'url'
      });
      
      const images: Image[] = [];
      Object.entries(imageModules).forEach(([path, module], index) => {
        const imageName = path.replace('/src/assets/images/', '');
        if (imageName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          images.push({
            id: `img-${index}`,
            url: module as string,
            name: imageName
          });
        }
      });
      
      setAvailableImages(images);
    } catch (error) {
      console.error('Error loading images:', error);
      toast.error('Błąd podczas ładowania obrazów');
    }
  };

  const handleCreateCategory = async () => {
    if (!formData.name.trim()) {
      toast.error('Nazwa kategorii jest wymagana');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: formData.name,
          description: formData.description,
          image_urls: formData.selectedImages
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating category:', error);
        toast.error('Błąd podczas tworzenia kategorii');
        return;
      }

      setCategories([data, ...categories]);
      setIsCreateDialogOpen(false);
      setFormData({ name: '', description: '', selectedImages: [] });
      toast.success('Kategoria została utworzona');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Błąd podczas tworzenia kategorii');
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory || !formData.name.trim()) {
      toast.error('Nazwa kategorii jest wymagana');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: formData.name,
          description: formData.description,
          image_urls: formData.selectedImages
        })
        .eq('id', editingCategory.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating category:', error);
        toast.error('Błąd podczas aktualizacji kategorii');
        return;
      }

      setCategories(categories.map(cat => cat.id === editingCategory.id ? data : cat));
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', selectedImages: [] });
      toast.success('Kategoria została zaktualizowana');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Błąd podczas aktualizacji kategorii');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę kategorię?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) {
        console.error('Error deleting category:', error);
        toast.error('Błąd podczas usuwania kategorii');
        return;
      }

      setCategories(categories.filter(cat => cat.id !== categoryId));
      toast.success('Kategoria została usunięta');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Błąd podczas usuwania kategorii');
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      selectedImages: category.image_urls || []
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', selectedImages: [] });
  };

  const handleImageToggle = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      selectedImages: prev.selectedImages.includes(imageUrl)
        ? prev.selectedImages.filter(url => url !== imageUrl)
        : [...prev.selectedImages, imageUrl]
    }));
  };

  const viewCategory = (category: Category) => {
    setSelectedCategory(category);
    setViewMode('gallery');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Ładowanie...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <div className="container mx-auto px-4 py-8">
        {viewMode === 'list' ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Kategorie</h1>
              {isAdmin && (
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm}>
                      <Plus className="mr-2 h-4 w-4" />
                      Dodaj kategorię
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Dodaj nową kategorię</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nazwa kategorii</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Wprowadź nazwę kategorii"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Opis</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Wprowadź opis kategorii"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Wybierz obrazy</Label>
                        <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto mt-2">
                          {availableImages.map((image) => (
                            <div key={image.id} className="relative">
                              <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-20 object-cover rounded cursor-pointer"
                                onClick={() => handleImageToggle(image.url)}
                              />
                              <Checkbox
                                checked={formData.selectedImages.includes(image.url)}
                                onCheckedChange={() => handleImageToggle(image.url)}
                                className="absolute top-1 right-1"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button onClick={handleCreateCategory} className="w-full">
                        Utwórz kategorię
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {category.name}
                      {isAdmin && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {category.image_urls.slice(0, 3).map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-16 object-cover rounded"
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {category.image_urls.length} obrazów
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewCategory(category)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Zobacz
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {categories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nie ma jeszcze żadnych kategorii</p>
                {isAdmin && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Kliknij "Dodaj kategorię" aby utworzyć pierwszą kategorię
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="outline"
                onClick={() => setViewMode('list')}
              >
                ← Wróć do kategorii
              </Button>
              <h1 className="text-3xl font-bold">{selectedCategory?.name}</h1>
              <div></div>
            </div>

            {selectedCategory?.description && (
              <p className="text-muted-foreground mb-6">{selectedCategory.description}</p>
            )}

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {selectedCategory?.image_urls.map((url, index) => (
                <div key={index} className="group">
                  <img
                    src={url}
                    alt={`Obraz ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  />
                </div>
              ))}
            </div>

            {selectedCategory && selectedCategory.image_urls.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Ta kategoria nie zawiera jeszcze żadnych obrazów</p>
              </div>
            )}
          </>
        )}

        {/* Dialog edycji kategorii */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edytuj kategorię</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nazwa kategorii</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Wprowadź nazwę kategorii"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Opis</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Wprowadź opis kategorii"
                  rows={3}
                />
              </div>
              <div>
                <Label>Wybierz obrazy</Label>
                <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto mt-2">
                  {availableImages.map((image) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-20 object-cover rounded cursor-pointer"
                        onClick={() => handleImageToggle(image.url)}
                      />
                      <Checkbox
                        checked={formData.selectedImages.includes(image.url)}
                        onCheckedChange={() => handleImageToggle(image.url)}
                        className="absolute top-1 right-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={handleEditCategory} className="w-full">
                Zapisz zmiany
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Categories;