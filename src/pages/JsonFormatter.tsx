
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Copy, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClipboard } from "@/hooks/useClipboard";

export const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { copyToClipboard } = useClipboard();

  const formatJson = () => {
    if (!input.trim()) {
      toast({
        title: "No input provided",
        description: "Please enter JSON data to format",
        variant: "destructive"
      });
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setIsValid(true);
      setError("");
      toast({
        title: "JSON formatted successfully",
        description: "Your JSON is valid and has been formatted"
      });
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setOutput("");
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax",
        variant: "destructive"
      });
    }
  };

  const minifyJson = () => {
    if (!input.trim()) {
      toast({
        title: "No input provided",
        description: "Please enter JSON data to minify",
        variant: "destructive"
      });
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
      setError("");
      toast({
        title: "JSON minified successfully",
        description: "Your JSON has been compressed"
      });
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setOutput("");
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax",
        variant: "destructive"
      });
    }
  };

  const validateJson = () => {
    if (!input.trim()) {
      toast({
        title: "No input provided",
        description: "Please enter JSON data to validate",
        variant: "destructive"
      });
      return;
    }

    try {
      JSON.parse(input);
      setIsValid(true);
      setError("");
      toast({
        title: "Valid JSON",
        description: "Your JSON syntax is correct"
      });
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid JSON");
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax",
        variant: "destructive"
      });
    }
  };

  const handleCopy = () => {
    const textToCopy = output || input;
    if (textToCopy) {
      copyToClipboard(textToCopy);
      toast({
        title: "Copied!",
        description: "JSON copied to clipboard"
      });
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setIsValid(null);
    setError("");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">JSON Formatter</h1>
        <p className="text-muted-foreground">
          Format, validate, and prettify JSON data
        </p>
      </div>

      <Card className="tool-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            JSON Tools
          </CardTitle>
          <CardDescription>
            Paste your JSON data below to format, minify, or validate it
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Input JSON</label>
              {isValid !== null && (
                <Badge variant={isValid ? "default" : "destructive"}>
                  {isValid ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Valid
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Invalid
                    </>
                  )}
                </Badge>
              )}
            </div>
            <Textarea
              placeholder="Paste your JSON here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[150px] font-mono text-sm"
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={formatJson}>
              Format JSON
            </Button>
            <Button variant="outline" onClick={minifyJson}>
              Minify JSON
            </Button>
            <Button variant="outline" onClick={validateJson}>
              Validate Only
            </Button>
            <Button variant="outline" onClick={handleClear}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>

          {output && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Formatted Output</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={output}
                readOnly
                className="min-h-[150px] font-mono text-sm"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
