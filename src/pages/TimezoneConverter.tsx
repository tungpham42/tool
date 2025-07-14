
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Copy, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClipboard } from "@/hooks/useClipboard";
import { format } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

const commonTimezones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)", offset: "+00:00" },
  { value: "America/New_York", label: "New York (EST/EDT)", offset: "-05:00/-04:00" },
  { value: "America/Chicago", label: "Chicago (CST/CDT)", offset: "-06:00/-05:00" },
  { value: "America/Denver", label: "Denver (MST/MDT)", offset: "-07:00/-06:00" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)", offset: "-08:00/-07:00" },
  { value: "Europe/London", label: "London (GMT/BST)", offset: "+00:00/+01:00" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)", offset: "+01:00/+02:00" },
  { value: "Europe/Berlin", label: "Berlin (CET/CEST)", offset: "+01:00/+02:00" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)", offset: "+09:00" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)", offset: "+08:00" },
  { value: "Asia/Dubai", label: "Dubai (GST)", offset: "+04:00" },
  { value: "Asia/Kolkata", label: "Mumbai (IST)", offset: "+05:30" },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)", offset: "+10:00/+11:00" },
  { value: "Pacific/Auckland", label: "Auckland (NZST/NZDT)", offset: "+12:00/+13:00" },
];

export const TimezoneConverter = () => {
  const [inputDateTime, setInputDateTime] = useState("");
  const [fromTimezone, setFromTimezone] = useState("UTC");
  const [toTimezone, setToTimezone] = useState("America/New_York");
  const [convertedResult, setConvertedResult] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();
  const { copyToClipboard } = useClipboard();

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Set current date and time as default
  useEffect(() => {
    const now = new Date();
    const localDateTime = format(now, "yyyy-MM-dd'T'HH:mm");
    setInputDateTime(localDateTime);
  }, []);

  const handleConvert = () => {
    if (!inputDateTime) {
      toast({
        title: "No date/time selected",
        description: "Please select a date and time to convert",
        variant: "destructive"
      });
      return;
    }

    try {
      // Parse the input date/time
      const inputDate = new Date(inputDateTime);
      
      // Convert from source timezone to target timezone
      const result = formatInTimeZone(
        inputDate,
        toTimezone,
        "yyyy-MM-dd HH:mm:ss zzz"
      );
      
      setConvertedResult(result);
      
      toast({
        title: "Conversion successful",
        description: `Time converted from ${fromTimezone} to ${toTimezone}`
      });
    } catch (error) {
      toast({
        title: "Conversion failed",
        description: "Please check your date/time input",
        variant: "destructive"
      });
      console.error("Timezone conversion error:", error);
    }
  };

  const handleCopy = () => {
    if (convertedResult) {
      copyToClipboard(convertedResult);
      toast({
        title: "Copied!",
        description: "Converted time copied to clipboard"
      });
    }
  };

  const handleClear = () => {
    const now = new Date();
    const localDateTime = format(now, "yyyy-MM-dd'T'HH:mm");
    setInputDateTime(localDateTime);
    setConvertedResult("");
  };

  const handleSwapTimezones = () => {
    const temp = fromTimezone;
    setFromTimezone(toTimezone);
    setToTimezone(temp);
  };

  const getCurrentTimeInTimezone = (timezone: string) => {
    return formatInTimeZone(currentTime, timezone, "HH:mm:ss");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Timezone Converter</h1>
        <p className="text-muted-foreground">
          Convert dates and times between different timezones
        </p>
      </div>

      {/* Current Time Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { tz: "UTC", name: "UTC" },
          { tz: "America/New_York", name: "New York" },
          { tz: "Europe/London", name: "London" },
          { tz: "Asia/Tokyo", name: "Tokyo" }
        ].map((item) => (
          <Card key={item.tz} className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-mono font-bold">
                {getCurrentTimeInTimezone(item.tz)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Converter Tool */}
      <Card className="tool-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Time Converter
          </CardTitle>
          <CardDescription>
            Convert a specific date and time between different timezones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="datetime">Date & Time</Label>
                <Input
                  id="datetime"
                  type="datetime-local"
                  value={inputDateTime}
                  onChange={(e) => setInputDateTime(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>From Timezone</Label>
                <Select value={fromTimezone} onValueChange={setFromTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {commonTimezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        <div className="flex flex-col">
                          <span>{tz.label}</span>
                          <span className="text-xs text-muted-foreground">{tz.offset}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>To Timezone</Label>
                <Select value={toTimezone} onValueChange={setToTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {commonTimezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        <div className="flex flex-col">
                          <span>{tz.label}</span>
                          <span className="text-xs text-muted-foreground">{tz.offset}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {convertedResult && (
                <div className="space-y-2">
                  <Label>Converted Result</Label>
                  <div className="p-3 bg-muted rounded-md flex items-center justify-between">
                    <code className="text-sm font-mono">{convertedResult}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleConvert} disabled={!inputDateTime}>
              <Clock className="h-4 w-4 mr-2" />
              Convert Time
            </Button>
            <Button variant="outline" onClick={handleSwapTimezones}>
              Swap Timezones
            </Button>
            <Button variant="outline" onClick={handleClear}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20 border-blue-200/50 dark:border-blue-800/50">
        <CardHeader>
          <CardTitle className="text-lg">🌍 About Timezones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            This tool helps you convert dates and times between different timezones. 
            Perfect for scheduling meetings, coordinating with international teams, or planning travel.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Features:</h4>
              <ul className="space-y-1 text-xs">
                <li>• Real-time clock display</li>
                <li>• Convert between popular timezones</li>
                <li>• Copy results to clipboard</li>
                <li>• Handles daylight saving time</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Use Cases:</h4>
              <ul className="space-y-1 text-xs">
                <li>• International meeting scheduling</li>
                <li>• Travel planning</li>
                <li>• Event coordination</li>
                <li>• Remote team collaboration</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
