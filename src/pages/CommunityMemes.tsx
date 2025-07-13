import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';

interface Meme {
  id: string;
  image_url: string;
  nickname: string | null;
  is_anonymous: boolean;
  created_at: string;
}

const CommunityMemes = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [nickname, setNickname] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    try {
      const { data, error } = await supabase
        .from('community_memes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMemes(data || []);
    } catch (error) {
      console.error('Error fetching memes:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać memów",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadMeme = async () => {
    if (!selectedFile) {
      toast({
        title: "Błąd",
        description: "Wybierz plik do wgrania",
        variant: "destructive"
      });
      return;
    }

    if (!isAnonymous && !nickname.trim()) {
      toast({
        title: "Błąd",
        description: "Wpisz nick lub wybierz opcję anonimową",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('community-memes')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('community-memes')
        .getPublicUrl(fileName);

      // Insert meme record
      const { error: insertError } = await supabase
        .from('community_memes')
        .insert({
          image_url: data.publicUrl,
          nickname: isAnonymous ? null : nickname.trim(),
          is_anonymous: isAnonymous
        });

      if (insertError) throw insertError;

      toast({
        title: "Sukces!",
        description: "Mem został zweryfikowany i dodany pomyślnie"
      });

      // Reset form
      setSelectedFile(null);
      setNickname('');
      setIsAnonymous(false);
      
      // Refresh memes
      fetchMemes();
    } catch (error) {
      console.error('Error uploading meme:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się dodać mema",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };


  return (
    <div className="min-h-screen bg-sky-50">
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-4">Memy od community</h1>
          <p className="text-muted-foreground text-center mb-8">
            Tu możecie wstawiać własne memy i przeglądać memy innych użytkowników!
          </p>

          {/* Upload Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Dodaj swój mem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Wybierz obrazek</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                />
                <Label htmlFor="anonymous">Wstaw anonimowo</Label>
              </div>

              {!isAnonymous && (
                <div>
                  <Label htmlFor="nickname">Twój nick</Label>
                  <Input
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Wpisz swój nick..."
                    className="mt-1"
                  />
                </div>
              )}

              <Button 
                onClick={uploadMeme} 
                disabled={uploading}
                className="w-full"
              >
                {uploading ? 'Wgrywanie...' : 'Dodaj mem'}
              </Button>
            </CardContent>
          </Card>

          {/* Memes Gallery */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Galeria memów</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Ładowanie memów...</p>
              </div>
            ) : memes.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Jeszcze nie ma żadnych memów. Bądź pierwszy!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memes.map((meme) => (
                  <Card key={meme.id} className="overflow-hidden">
                    <div className="aspect-square">
                      <img 
                        src={meme.image_url} 
                        alt="Community meme"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>
                          {meme.is_anonymous ? 'Anonimowy' : meme.nickname || 'Anonimowy'}
                        </span>
                        <span>
                          {new Date(meme.created_at).toLocaleDateString('pl-PL')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityMemes;