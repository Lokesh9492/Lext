
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Palette } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  const applyTheme = (theme: string) => {
    localStorage.setItem("lext_theme", theme);
    onThemeChange(theme);
    
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    toast({
      title: "Theme Updated",
      description: `Switched to ${theme} mode`,
    });
  };

  const themes = [
    { id: "light", name: "Light Mode", icon: Sun, description: "Clean and bright interface" },
    { id: "dark", name: "Dark Mode", icon: Moon, description: "Easy on the eyes" },
    { id: "gradient", name: "Gradient", icon: Palette, description: "Colorful LEXT branding" }
  ];

  return (
    <Card className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border-white/20 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Palette className="w-5 h-5" />
          <span>Theme Selection</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {themes.map((theme) => {
          const Icon = theme.icon;
          const isActive = currentTheme === theme.id;
          
          return (
            <Button
              key={theme.id}
              onClick={() => applyTheme(theme.id)}
              variant="outline"
              className={`w-full justify-start h-auto p-4 ${
                isActive 
                  ? "bg-white/20 border-white/40 text-white" 
                  : "bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-semibold">{theme.name}</p>
                  <p className="text-sm opacity-70">{theme.description}</p>
                </div>
                {isActive && (
                  <div className="ml-auto w-3 h-3 bg-green-400 rounded-full"></div>
                )}
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ThemeSelector;
