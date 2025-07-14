
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Download, Copy, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClipboard } from "@/hooks/useClipboard";

export const QRCodeGenerator = () => {
  const [text, setText] = useState("");
  const [size, setSize] = useState("200");
  const [errorCorrection, setErrorCorrection] = useState("M");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const { toast } = useToast();
  const { copyToClipboard } = useClipboard();

  const generateQRCode = () => {
    if (!text.trim()) {
      toast({
        title: "No text provided",
        description: "Please enter text or URL to generate QR code",
        variant: "destructive"
      });
      return;
    }

    // Using QR Server API for QR code generation
    const encodedText = encodeURIComponent(text);
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&ecc=${errorCorrection}`;
    
    setQrCodeUrl(url);
    toast({
      title: "QR Code generated",
      description: "Your QR code has been created successfully"
    });
  };

  const downloadQRCode = async () => {
    if (!qrCodeUrl) return;

    try {
      // Fetch the image as blob
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      
      // Create object URL
      const objectUrl = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `qrcode-${Date.now()}.png`;
      link.style.display = 'none';
      
      // Add to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up object URL
      URL.revokeObjectURL(objectUrl);
      
      toast({
        title: "Download started",
        description: "QR code image is being downloaded"
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download failed",
        description: "Unable to download the QR code. Please try again.",
        variant: "destructive"
      });
    }
  };

  const copyQRCodeUrl = () => {
    if (qrCodeUrl) {
      copyToClipboard(qrCodeUrl);
      toast({
        title: "Copied!",
        description: "QR code URL copied to clipboard"
      });
    }
  };

  const handleClear = () => {
    setText("");
    setQrCodeUrl("");
  };

  const handlePresetClick = (presetValue: string) => {
    setText(presetValue);
    toast({
      title: "Preset applied",
      description: "Template text has been inserted"
    });
  };

  const presetTexts = [
    { label: "WiFi Network", value: "WIFI:T:WPA;S:NetworkName;P:password;;" },
    { label: "Email", value: "mailto:example@email.com" },
    { label: "Phone", value: "tel:+1234567890" },
    { label: "SMS", value: "sms:+1234567890" },
    { label: "Website", value: "https://example.com" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">QR Code Generator</h1>
        <p className="text-muted-foreground">
          Generate QR codes from text or URLs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="tool-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code Settings
            </CardTitle>
            <CardDescription>
              Configure your QR code parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Text or URL</Label>
              <Textarea
                id="text"
                placeholder="Enter text, URL, or other data..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Size (pixels)</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="150">150x150</SelectItem>
                    <SelectItem value="200">200x200</SelectItem>
                    <SelectItem value="250">250x250</SelectItem>
                    <SelectItem value="300">300x300</SelectItem>
                    <SelectItem value="400">400x400</SelectItem>
                    <SelectItem value="500">500x500</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Error Correction</Label>
                <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7%)</SelectItem>
                    <SelectItem value="M">Medium (15%)</SelectItem>
                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                    <SelectItem value="H">High (30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quick Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                {presetTexts.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetClick(preset.value)}
                    className="text-xs"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={generateQRCode} disabled={!text.trim()}>
                Generate QR Code
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="tool-card">
          <CardHeader>
            <CardTitle>Generated QR Code</CardTitle>
            <CardDescription>
              Your QR code will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {qrCodeUrl ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={qrCodeUrl}
                    alt="Generated QR Code"
                    className="border rounded-lg shadow-sm"
                  />
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button onClick={downloadQRCode}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={copyQRCodeUrl}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy URL
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <QrCode className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Enter text and click "Generate QR Code" to create your QR code</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-950/20 border-green-200/50 dark:border-green-800/50">
        <CardHeader>
          <CardTitle className="text-lg">💡 QR Code Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong>WiFi:</strong> Format: WIFI:T:WPA;S:NetworkName;P:password;;</p>
          <p>• <strong>Email:</strong> Format: mailto:email@example.com</p>
          <p>• <strong>Phone:</strong> Format: tel:+1234567890</p>
          <p>• <strong>SMS:</strong> Format: sms:+1234567890</p>
          <p>• Higher error correction allows the QR code to be read even if partially damaged</p>
        </CardContent>
      </Card>
    </div>
  );
};
