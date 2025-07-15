import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavigationBar from '@/components/NavigationBar';
import { Copy, RefreshCw, Mail } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const TempMail = () => {
  const [customName, setCustomName] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [showEmailInterface, setShowEmailInterface] = useState(false);
  const [emails, setEmails] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showEmailInterface && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setShowEmailInterface(false);
            setCurrentEmail('');
            toast({
              title: "Mail wygasł",
              description: "Twój tymczasowy mail został usunięty",
              variant: "destructive"
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showEmailInterface, timeLeft, toast]);

  const generateEmail = () => {
    if (!customName.trim()) {
      toast({
        title: "Błąd",
        description: "Wpisz nazwę dla swojego maila",
        variant: "destructive"
      });
      return;
    }

    const email = `${customName.trim()}@lorza.pl`;
    setCurrentEmail(email);
    setTimeLeft(600);
    setShowEmailInterface(true);
    setEmails([]);
    
    toast({
      title: "Mail wygenerowany",
      description: `Twój tymczasowy mail: ${email}`,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentEmail);
    toast({
      title: "Skopiowano",
      description: "Adres email został skopiowany do schowka",
    });
  };

  const generateNewMail = () => {
    setShowEmailInterface(false);
    setCurrentEmail('');
    setCustomName('');
    setTimeLeft(600);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-center mb-8">10 Minute Mail</h1>
          
          {!showEmailInterface ? (
            <div className="text-center">
              <div className="mb-6">
                <h2 className="text-xl mb-4">Wygeneruj swój tymczasowy email</h2>
                <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
                  <Input
                    type="text"
                    placeholder="Wpisz nazwę (np. test)"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-gray-500">@lorza.pl</span>
                </div>
              </div>
              <Button onClick={generateEmail} className="px-8 py-2">
                Wygeneruj Email
              </Button>
            </div>
          ) : (
            <div>
              {/* Email Info Section */}
              <div className="text-center mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span className="text-lg font-semibold">{currentEmail}</span>
                </div>
                
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Skopiuj do schowka
                  </Button>
                  
                  <div className="text-sm text-gray-600">
                    Czas pozostały: <span className="font-bold text-red-600">{formatTime(timeLeft)}</span>
                  </div>
                </div>
                
                <Button
                  onClick={generateNewMail}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Wygeneruj nowy mail
                </Button>
              </div>

              {/* Inbox Section */}
              <div className="border rounded-lg">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="font-semibold">Skrzynka odbiorcza</h3>
                </div>
                
                <div className="p-4">
                  {emails.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <Mail className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Brak nowych wiadomości</p>
                      <p className="text-sm">Wiadomości będą się pojawiać automatycznie</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {emails.map((email: any, index) => (
                        <div key={index} className="border rounded p-3 hover:bg-gray-50">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold">{email.from}</span>
                            <span className="text-sm text-gray-500">{email.time}</span>
                          </div>
                          <div className="text-sm font-medium mb-1">{email.subject}</div>
                          <div className="text-sm text-gray-600">{email.preview}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TempMail;