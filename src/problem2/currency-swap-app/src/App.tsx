import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index"

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <Index />
  </QueryClientProvider>
);

export default App;
