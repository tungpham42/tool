
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Upload, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClipboard } from "@/hooks/useClipboard";
import { base64Encode, base64Decode } from "@/utils/base64";

export const Base64Tool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { copyToClipboard, copied } = useClipboard();

  const handleEncode = () => {
    try {
      const encoded = base64Encode(input);
      setOutput(encoded);
      setError("");
      toast({
        title: "Encoded successfully",
        description: "Text has been encoded to Base64",
      });
    } catch (err) {
      setError("Failed to encode text");
      console.error("Encoding error:", err);
    }
  };

  const handleDecode = () => {
    try {
      const decoded = base64Decode(input);
      setOutput(decoded);
      setError("");
      toast({
        title: "Decoded successfully",
        description: "Base64 has been decoded to text",
      });
    } catch (err) {
      setError("Invalid Base64 string");
      setOutput("");
      toast({
        title: "Decode failed",
        description: "Please check your Base64 input",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    if (output) {
      await copyToClipboard(output);
      toast({
        title: "Copied to clipboard",
        description: "Output has been copied to your clipboard",
      });
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const handleSwap = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
    setError("");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Base64 Encoder & Decoder</h1>
        <p className="text-muted-foreground">
          Encode text to Base64 or decode Base64 strings back to readable text
        </p>
      </div>

      <Tabs defaultValue="encode" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Text to Base64
              </CardTitle>
              <CardDescription>
                Enter plain text to convert it to Base64 encoding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="input-group">
                <Label htmlFor="encode-input">Input Text</Label>
                <Textarea
                  id="encode-input"
                  placeholder="Enter text to encode..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleEncode} disabled={!input.trim()}>
                  Encode to Base64
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decode" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Base64 to Text
              </CardTitle>
              <CardDescription>
                Enter Base64 encoded string to convert it back to readable text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="input-group">
                <Label htmlFor="decode-input">Base64 Input</Label>
                <Textarea
                  id="decode-input"
                  placeholder="Enter Base64 encoded string..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[120px] resize-none font-mono"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleDecode} disabled={!input.trim()}>
                  Decode from Base64
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Output Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Output</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwap}
                disabled={!output}
              >
                Swap
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!output}
                className="copy-button"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
              {error}
            </div>
          ) : (
            <Textarea
              value={output}
              readOnly
              placeholder="Output will appear here..."
              className="min-h-[120px] resize-none font-mono bg-muted/50"
            />
          )}
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20 border-blue-200/50 dark:border-blue-800/50">
        <CardHeader>
          <CardTitle className="text-lg">💡 About Base64</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Base64 is a binary-to-text encoding scheme that represents binary data as ASCII text. 
            It's commonly used in web development, email systems, and data transmission.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Use Cases:</h4>
              <ul className="space-y-1 text-xs">
                <li>• Embedding images in HTML/CSS</li>
                <li>• API data transmission</li>
                <li>• Email attachments</li>
                <li>• Storing binary data in text format</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Features:</h4>
              <ul className="space-y-1 text-xs">
                <li>• Instant encoding/decoding</li>
                <li>• Copy to clipboard functionality</li>
                <li>• Swap input/output easily</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
