
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Text, Copy, RotateCcw } from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";
import { useToast } from "@/hooks/use-toast";

interface CaseOption {
  id: string;
  name: string;
  description: string;
  transform: (text: string) => string;
}

const caseOptions: CaseOption[] = [
  {
    id: "uppercase",
    name: "UPPERCASE",
    description: "Convert to all caps",
    transform: (text: string) => text.toUpperCase()
  },
  {
    id: "lowercase", 
    name: "lowercase",
    description: "Convert to all lowercase",
    transform: (text: string) => text.toLowerCase()
  },
  {
    id: "title",
    name: "Title Case",
    description: "Capitalize first letter of each word",
    transform: (text: string) => {
      // Handle both space-separated words and camelCase/PascalCase words
      return text
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camelCase/PascalCase
        .replace(/[_-]/g, ' ') // Replace underscores and hyphens with spaces
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }
  },
  {
    id: "sentence",
    name: "Sentence case",
    description: "Capitalize first letter of each sentence",
    transform: (text: string) => {
      // Split camelCase first, then apply sentence case
      const processedText = text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_-]/g, ' ');
      
      return processedText.toLowerCase().replace(/(^\w)|([.!?]\s+\w)/g, (match) => match.toUpperCase());
    }
  },
  {
    id: "camel",
    name: "camelCase",
    description: "Convert to camelCase format",
    transform: (text: string) => {
      // Handle all types of input including camelCase, spaces, hyphens, underscores
      return text
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Split existing camelCase
        .replace(/[^a-zA-Z0-9\s]/g, ' ') // Replace special characters with spaces
        .trim()
        .split(/\s+/) // Split by whitespace
        .filter(word => word.length > 0) // Remove empty strings
        .map((word, index) => {
          const cleanWord = word.toLowerCase();
          if (index === 0) return cleanWord;
          return cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
        })
        .join('');
    }
  },
  {
    id: "pascal",
    name: "PascalCase", 
    description: "Convert to PascalCase format",
    transform: (text: string) => {
      // Similar to camelCase but capitalize first word too
      return text
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Split existing camelCase
        .replace(/[^a-zA-Z0-9\s]/g, ' ') // Replace special characters with spaces
        .trim()
        .split(/\s+/) // Split by whitespace
        .filter(word => word.length > 0) // Remove empty strings
        .map(word => {
          const cleanWord = word.toLowerCase();
          return cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
        })
        .join('');
    }
  },
  {
    id: "kebab",
    name: "kebab-case",
    description: "Convert to kebab-case format",
    transform: (text: string) => {
      return text
        .replace(/([a-z])([A-Z])/g, '$1-$2') // Split camelCase with hyphens
        .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
        .toLowerCase()
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
    }
  },
  {
    id: "snake",
    name: "snake_case",
    description: "Convert to snake_case format", 
    transform: (text: string) => {
      return text
        .replace(/([a-z])([A-Z])/g, '$1_$2') // Split camelCase with underscores
        .replace(/[^a-zA-Z0-9\s_]/g, '') // Remove special characters except spaces and underscores
        .replace(/[\s-]+/g, '_') // Replace spaces and hyphens with underscores
        .toLowerCase()
        .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
        .replace(/_+/g, '_'); // Replace multiple underscores with single underscore
    }
  }
];

export const TextCaseConverter = () => {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<Record<string, string>>({});
  const { copyToClipboard } = useClipboard();
  const { toast } = useToast();

  const handleTransform = () => {
    if (!inputText.trim()) {
      toast({
        title: "No input text",
        description: "Please enter some text to convert",
        variant: "destructive"
      });
      return;
    }

    const newResults: Record<string, string> = {};
    caseOptions.forEach(option => {
      newResults[option.id] = option.transform(inputText);
    });
    setResults(newResults);
  };

  const handleCopy = (text: string, caseName: string) => {
    copyToClipboard(text);
    toast({
      title: "Copied!",
      description: `${caseName} text copied to clipboard`
    });
  };

  const handleClear = () => {
    setInputText("");
    setResults({});
  };

  const characterCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Text Case Converter</h1>
        <p className="text-muted-foreground">
          Transform text between different cases and formats
        </p>
      </div>

      <Card className="tool-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Text className="h-5 w-5" />
            Input Text
          </CardTitle>
          <CardDescription>
            Enter the text you want to convert to different cases
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[120px] resize-y"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Characters: {characterCount}</span>
              <span>Words: {wordCount}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={!inputText}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button
                onClick={handleTransform}
                disabled={!inputText.trim()}
              >
                Convert Text
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {Object.keys(results).length > 0 && (
        <div className="grid gap-4">
          <h2 className="text-xl font-semibold">Converted Results</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {caseOptions.map((option) => (
              <Card key={option.id} className="tool-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{option.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {option.description}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(results[option.id], option.name)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-muted rounded-md">
                    <code className="text-sm font-mono break-all">
                      {results[option.id] || "No result"}
                    </code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
