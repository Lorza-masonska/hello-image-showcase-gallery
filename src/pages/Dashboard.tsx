import { useEffect, useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { lastModified } from "@/version";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMemes: 0,
    todayMemes: 0,
    lastWeekMemes: 0
  });
  
  const [umamiStats, setUmamiStats] = useState({
    pageViews: 'Niedostępne',
    visitors: 'Niedostępne',
    bounceRate: 'Niedostępne'
  });

  useEffect(() => {
    // Sprawdź czy użytkownik ma uprawnienia administratora
    const isAdmin = localStorage.getItem('adminAccess') === 'true';
    if (!isAdmin) {
      window.location.href = '/';
      return;
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Pobierz całkowitą liczbę memów
      const { count: totalCount } = await supabase
        .from('community_memes')
        .select('*', { count: 'exact', head: true });

      // Pobierz memy z dzisiaj
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayCount } = await supabase
        .from('community_memes')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Pobierz memy z ostatniego tygodnia
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count: weekCount } = await supabase
        .from('community_memes')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      setStats({
        totalMemes: totalCount || 0,
        todayMemes: todayCount || 0,
        lastWeekMemes: weekCount || 0
      });
    } catch (error) {
      console.error('Błąd przy pobieraniu statystyk:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminAccess');
    window.location.href = '/';
  };

  const getLastModifiedDate = () => {
    return `${lastModified.date} ${lastModified.time}`;
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-sky-50">
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Panel Administratora
          </h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Wyloguj
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wszystkie Memy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {stats.totalMemes}
              </div>
              <p className="text-gray-600">Łączna liczba dodanych memów</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dzisiejsze Memy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stats.todayMemes}
              </div>
              <p className="text-gray-600">Memy dodane dzisiaj</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ostatni Tydzień</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {stats.lastWeekMemes}
              </div>
              <p className="text-gray-600">Memy z ostatnich 7 dni</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informacje o Stronie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Wersja strony:</span>
                <Badge variant="outline">v{lastModified.version}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Ostatnia aktualizacja:</span>
                <span className="text-gray-600">{getLastModifiedDate()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status serwera:</span>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Baza danych:</span>
                <Badge className="bg-blue-100 text-blue-800">Supabase</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statystyki Umami</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Odsłony strony:</span>
                <span className="text-gray-600">{umamiStats.pageViews}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Unikalni użytkownicy:</span>
                <span className="text-gray-600">{umamiStats.visitors}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Współczynnik odrzuceń:</span>
                <span className="text-gray-600">{umamiStats.bounceRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">ID witryny Umami:</span>
                <span className="text-gray-600 text-xs">526d3380-1be8-4c29-bea9-27f3e76e887d</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statystyki Techniczne</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Framework:</span>
                <span className="text-gray-600">React + Vite</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Hosting:</span>
                <span className="text-gray-600">Lovable</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">CDN:</span>
                <span className="text-gray-600">Supabase Storage</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">SSL:</span>
                <Badge className="bg-green-100 text-green-800">Aktywny</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Szybkie Akcje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={fetchStats}
                className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center"
              >
                <div className="font-medium text-blue-800">Odśwież Statystyki</div>
                <div className="text-sm text-blue-600">Aktualizuj dane</div>
              </button>
              
              <a 
                href="https://supabase.com/dashboard/project/movyoqalilebfrfopwnw"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center block"
              >
                <div className="font-medium text-green-800">Panel Supabase</div>
                <div className="text-sm text-green-600">Zarządzaj bazą danych</div>
              </a>

              <button 
                onClick={() => window.open('/community-memes', '_blank')}
                className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center"
              >
                <div className="font-medium text-purple-800">Community Memy</div>
                <div className="text-sm text-purple-600">Zobacz sekcję</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;