
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AppLayout } from "./components/AppLayout";
import { Base64Tool } from "./pages/Base64Tool";
import { TimezoneConverter } from "./pages/TimezoneConverter";
import { JsonFormatter } from "./pages/JsonFormatter";
import { TextCaseConverter } from "./pages/TextCaseConverter";
import { ImageToBase64 } from "./pages/ImageToBase64";
import { QRCodeGenerator } from "./pages/QRCodeGenerator";
import { ClipboardManager } from "./pages/ClipboardManager";
import { ColorPicker } from "./pages/ColorPicker";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="dev-tools-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Index />} />
              <Route path="base64" element={<Base64Tool />} />
              <Route path="timezone" element={<TimezoneConverter />} />
              <Route path="json" element={<JsonFormatter />} />
              <Route path="text-case" element={<TextCaseConverter />} />
              <Route path="image-base64" element={<ImageToBase64 />} />
              <Route path="qr-code" element={<QRCodeGenerator />} />
              <Route path="clipboard" element={<ClipboardManager />} />
              <Route path="color-picker" element={<ColorPicker />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
