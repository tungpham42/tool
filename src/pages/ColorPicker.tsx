
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, Copy, RotateCcw, Shuffle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClipboard } from "@/hooks/useClipboard";

export const ColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [hexInput, setHexInput] = useState("#3b82f6");
  const [colorHistory, setColorHistory] = useState<string[]>([]);
  const { toast } = useToast();
  const { copyToClipboard } = useClipboard();

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const hexToHsl = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;

    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const getColorFormats = (hex: string) => {
    const rgb = hexToRgb(hex);
    const hsl = hexToHsl(hex);
    
    return {
      hex: hex.toUpperCase(),
      rgb: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '',
      rgba: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` : '',
      hsl: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '',
      hsla: hsl ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)` : ''
    };
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setHexInput(color);
    
    // Add to history if not already present
    if (!colorHistory.includes(color)) {
      setColorHistory(prev => [color, ...prev.slice(0, 11)]); // Keep last 12 colors
    }
  };

  const handleHexInputChange = (value: string) => {
    setHexInput(value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setSelectedColor(value);
    }
  };

  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    handleColorChange(randomColor);
  };

  const copyFormat = (format: string) => {
    copyToClipboard(format);
    toast({
      title: "Copied!",
      description: `${format} copied to clipboard`
    });
  };

  const clearHistory = () => {
    setColorHistory([]);
    toast({
      title: "History cleared",
      description: "Color history has been cleared"
    });
  };

  const colorFormats = getColorFormats(selectedColor);
  const rgb = hexToRgb(selectedColor);

  const presetColors = [
    "#FF0000", "#FF8000", "#FFFF00", "#80FF00",
    "#00FF00", "#00FF80", "#00FFFF", "#0080FF",
    "#0000FF", "#8000FF", "#FF00FF", "#FF0080",
    "#800000", "#804000", "#808000", "#408000",
    "#008000", "#008040", "#008080", "#004080",
    "#000080", "#400080", "#800080", "#800040"
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Color Picker</h1>
        <p className="text-muted-foreground">
          Pick colors and convert between formats
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="tool-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Picker
            </CardTitle>
            <CardDescription>
              Select a color using the picker or enter a hex value
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div
                  className="w-32 h-32 rounded-lg border-4 border-white shadow-lg"
                  style={{ backgroundColor: selectedColor }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color-picker">Color Picker</Label>
                <input
                  id="color-picker"
                  type="color"
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-full h-12 rounded border border-input cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hex-input">Hex Value</Label>
                <div className="flex gap-2">
                  <Input
                    id="hex-input"
                    value={hexInput}
                    onChange={(e) => handleHexInputChange(e.target.value)}
                    placeholder="#3b82f6"
                    className="font-mono"
                  />
                  <Button onClick={generateRandomColor}>
                    <Shuffle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preset Colors</Label>
                <div className="grid grid-cols-8 gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className="w-8 h-8 rounded border-2 border-white shadow-sm hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="tool-card">
          <CardHeader>
            <CardTitle>Color Formats</CardTitle>
            <CardDescription>
              Different format representations of your selected color
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {Object.entries(colorFormats).map(([format, value]) => (
                <div key={format} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium text-sm uppercase">{format}</div>
                    <div className="font-mono text-sm">{value}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyFormat(value)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {rgb && (
              <div className="space-y-2 pt-4 border-t">
                <Label>RGB Values</Label>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded">
                    <div className="text-xs text-muted-foreground">Red</div>
                    <div className="font-bold">{rgb.r}</div>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded">
                    <div className="text-xs text-muted-foreground">Green</div>
                    <div className="font-bold">{rgb.g}</div>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                    <div className="text-xs text-muted-foreground">Blue</div>
                    <div className="font-bold">{rgb.b}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {colorHistory.length > 0 && (
        <Card className="tool-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Color History</CardTitle>
                <CardDescription>Recently selected colors</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={clearHistory}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 md:grid-cols-12 gap-2">
              {colorHistory.map((color, index) => (
                <button
                  key={`${color}-${index}`}
                  onClick={() => handleColorChange(color)}
                  className="w-10 h-10 rounded border-2 border-white shadow-sm hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-950/20 border-purple-200/50 dark:border-purple-800/50">
        <CardHeader>
          <CardTitle className="text-lg">🎨 Color Format Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong>HEX:</strong> Most common format for web development (#FF0000)</p>
          <p>• <strong>RGB:</strong> Red, Green, Blue values (0-255)</p>
          <p>• <strong>HSL:</strong> Hue, Saturation, Lightness - more intuitive</p>
          <p>• <strong>RGBA/HSLA:</strong> Include alpha channel for transparency</p>
        </CardContent>
      </Card>
    </div>
  );
};
