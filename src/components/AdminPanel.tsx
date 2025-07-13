import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const [adminCode, setAdminCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const ADMIN_CODE = "6'FG'7F-]D~hd1Z^t+NnA!xPAOg}JQ";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (adminCode === ADMIN_CODE) {
      localStorage.setItem('adminAccess', 'true');
      toast({
        title: "Dostęp udzielony",
        description: "Pomyślnie zalogowano jako administrator. Odśwież stronę aby zobaczyć nową zakładkę.",
        variant: "default"
      });
      setIsDialogOpen(false);
      setAdminCode("");
      // Odśwież stronę po krótkim opóźnieniu
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      toast({
        title: "Błędny kod",
        description: "Wprowadzony kod administratora jest nieprawidłowy.",
        variant: "destructive"
      });
      setAdminCode("");
    }
  };

  return (
    <div className="mt-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Shield className="w-3 h-3 mr-1" />
            Tryb administratora
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Dostęp Administratora
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="adminCode" className="text-sm font-medium">
                Kod administratora:
              </label>
              <div className="relative">
                <Input
                  id="adminCode"
                  type={showPassword ? "text" : "password"}
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Wprowadź kod administratora"
                  className="pr-10"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Potwierdź
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsDialogOpen(false);
                  setAdminCode("");
                }}
              >
                Anuluj
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;