
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Upload, Copy, RotateCcw, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClipboard } from "@/hooks/useClipboard";

export const ImageToBase64 = () => {
  const [base64Result, setBase64Result] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { copyToClipboard } = useClipboard();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    setFileName(file.name);
    setFileSize(formatFileSize(file.size));

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setBase64Result(result);
      setImagePreview(result);
      toast({
        title: "Image converted successfully",
        description: "Your image has been converted to Base64"
      });
    };
    reader.readAsDataURL(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        handleFileSelect({ target: input } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleCopy = () => {
    if (base64Result) {
      copyToClipboard(base64Result);
      toast({
        title: "Copied!",
        description: "Base64 string copied to clipboard"
      });
    }
  };

  const handleCopyDataUrl = () => {
    if (base64Result) {
      copyToClipboard(base64Result);
      toast({
        title: "Copied!",
        description: "Data URL copied to clipboard"
      });
    }
  };

  const handleCopyBase64Only = () => {
    if (base64Result) {
      const base64Only = base64Result.split(',')[1];
      copyToClipboard(base64Only);
      toast({
        title: "Copied!",
        description: "Base64 data (without prefix) copied to clipboard"
      });
    }
  };

  const handleClear = () => {
    setBase64Result("");
    setImagePreview("");
    setFileName("");
    setFileSize("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Image to Base64</h1>
        <p className="text-muted-foreground">
          Convert images to Base64 encoded strings
        </p>
      </div>

      <Card className="tool-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Image Converter
          </CardTitle>
          <CardDescription>
            Upload an image or drag and drop to convert it to Base64
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Drop your image here</p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse files
            </p>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Choose Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {imagePreview && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Preview</label>
                <div className="border rounded-lg p-4 bg-muted/50">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-48 mx-auto rounded"
                  />
                  <div className="mt-2 text-center text-sm text-muted-foreground">
                    <p>{fileName}</p>
                    <p>{fileSize}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Base64 Result</label>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyDataUrl}
                        className="h-8"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Data URL
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyBase64Only}
                        className="h-8"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Base64 Only
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={base64Result}
                    readOnly
                    className="min-h-[200px] font-mono text-xs"
                    placeholder="Base64 result will appear here..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClear}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20 border-blue-200/50 dark:border-blue-800/50">
        <CardHeader>
          <CardTitle className="text-lg">📝 Usage Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Supported formats: JPG, PNG, GIF, WebP, SVG, and more</p>
          <p>• Data URL includes the MIME type prefix (e.g., data:image/png;base64,)</p>
          <p>• Base64 Only copies just the encoded data without the prefix</p>
          <p>• Perfect for embedding images in CSS, HTML, or JSON</p>
        </CardContent>
      </Card>
    </div>
  );
};
