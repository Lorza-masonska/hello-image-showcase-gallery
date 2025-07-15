
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Website from "./pages/Website";
import Categories from "./pages/Categories";
import CommunityMemes from "./pages/CommunityMemes";
import Dashboard from "./pages/Dashboard";
import TempMail from "./pages/TempMail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/website" element={<Website />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/community-memes" element={<CommunityMemes />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/temp-mail" element={<TempMail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
