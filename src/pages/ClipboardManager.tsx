
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clipboard, Copy, Trash2, Search, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClipboard } from "@/hooks/useClipboard";

interface ClipboardItem {
  id: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'url' | 'email';
}

export const ClipboardManager = () => {
  const [clipboardHistory, setClipboardHistory] = useState<ClipboardItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newItem, setNewItem] = useState("");
  const { toast } = useToast();
  const { copyToClipboard } = useClipboard();

  // Load history from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('clipboardHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setClipboardHistory(parsed);
      } catch (error) {
        console.error('Failed to load clipboard history:', error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('clipboardHistory', JSON.stringify(clipboardHistory));
  }, [clipboardHistory]);

  const detectContentType = (content: string): 'text' | 'url' | 'email' => {
    if (content.match(/^https?:\/\/.+/)) return 'url';
    if (content.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'email';
    return 'text';
  };

  const addToHistory = (content: string) => {
    if (!content.trim()) {
      toast({
        title: "Empty content",
        description: "Cannot add empty content to clipboard history",
        variant: "destructive"
      });
      return;
    }

    // Check if content already exists
    const exists = clipboardHistory.some(item => item.content === content);
    if (exists) {
      toast({
        title: "Duplicate content",
        description: "This content already exists in your clipboard history",
        variant: "destructive"
      });
      return;
    }

    const newClipboardItem: ClipboardItem = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      type: detectContentType(content)
    };

    setClipboardHistory(prev => [newClipboardItem, ...prev.slice(0, 49)]); // Keep only last 50 items
    setNewItem("");
    
    toast({
      title: "Added to clipboard history",
      description: "Content has been saved to your clipboard history"
    });
  };

  const copyItem = (content: string) => {
    copyToClipboard(content);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard"
    });
  };

  const deleteItem = (id: string) => {
    setClipboardHistory(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Deleted",
      description: "Item removed from clipboard history"
    });
  };

  const clearHistory = () => {
    setClipboardHistory([]);
    toast({
      title: "History cleared",
      description: "All clipboard history has been deleted"
    });
  };

  const filteredHistory = clipboardHistory.filter(item =>
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'url': return 'bg-blue-500';
      case 'email': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Clipboard Manager</h1>
        <p className="text-muted-foreground">
          Manage and track clipboard history
        </p>
      </div>

      <Card className="tool-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clipboard className="h-5 w-5" />
            Add to Clipboard History
          </CardTitle>
          <CardDescription>
            Add content to your clipboard history manually
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter text, URL, or any content..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addToHistory(newItem)}
            />
            <Button onClick={() => addToHistory(newItem)} disabled={!newItem.trim()}>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="tool-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Clipboard History</CardTitle>
              <CardDescription>
                {clipboardHistory.length} items stored
              </CardDescription>
            </div>
            <Button variant="destructive" size="sm" onClick={clearHistory} disabled={clipboardHistory.length === 0}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {clipboardHistory.length > 0 && (
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clipboard history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clipboard className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>
                  {clipboardHistory.length === 0 
                    ? "No clipboard history yet. Add some content above to get started."
                    : "No items match your search."
                  }
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className={`text-xs ${getTypeColor(item.type)} text-white`}>
                        {item.type.toUpperCase()}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(item.timestamp)}
                      </div>
                    </div>
                    <p className="text-sm truncate pr-2" title={item.content}>
                      {item.content}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyItem(item.content)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-yellow-50/50 to-transparent dark:from-yellow-950/20 border-yellow-200/50 dark:border-yellow-800/50">
        <CardHeader>
          <CardTitle className="text-lg">📋 Usage Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Clipboard history is stored locally in your browser</p>
          <p>• Maximum of 50 items are kept in history</p>
          <p>• Content types are automatically detected (Text, URL, Email)</p>
          <p>• Use the search box to quickly find specific content</p>
          <p>• All data remains private and is not sent to any server</p>
        </CardContent>
      </Card>
    </div>
  );
};
