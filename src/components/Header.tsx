import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";
import { Settings, Moon, Sun, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 animate-glow">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-xl gradient-text">
              Professional Developer Tools
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Professional Tools for Developers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="px-3 py-2 rounded-xl hover:bg-primary/10 transition-all duration-200 hover:scale-105"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-primary" />
            ) : (
              <Moon className="h-5 w-5 text-primary" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
