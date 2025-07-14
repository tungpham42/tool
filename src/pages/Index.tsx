import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Code,
  Calendar,
  FileText,
  Text,
  Image,
  QrCode,
  Clipboard,
  Palette,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Github,
} from "lucide-react";

const tools = [
  {
    name: "Base64 Encoder",
    path: "/base64",
    icon: Code,
    description: "Encode and decode Base64 strings with copy functionality",
    status: "Ready",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Timezone Converter",
    path: "/timezone",
    icon: Calendar,
    description: "Convert dates and times between different timezones",
    status: "Ready",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "JSON Formatter",
    path: "/json",
    icon: FileText,
    description: "Format, validate, and prettify JSON data",
    status: "Ready",
    color: "from-yellow-500 to-orange-500",
  },
  {
    name: "Text Case Converter",
    path: "/text-case",
    icon: Text,
    description: "Transform text between different cases",
    status: "Ready",
    color: "from-purple-500 to-violet-500",
  },
  {
    name: "Image to Base64",
    path: "/image-base64",
    icon: Image,
    description: "Convert images to Base64 encoded strings",
    status: "Ready",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "QR Code Generator",
    path: "/qr-code",
    icon: QrCode,
    description: "Generate QR codes from text or URLs",
    status: "Ready",
    color: "from-indigo-500 to-blue-500",
  },
  {
    name: "Clipboard Manager",
    path: "/clipboard",
    icon: Clipboard,
    description: "Manage and track clipboard history",
    status: "Ready",
    color: "from-teal-500 to-cyan-500",
  },
  {
    name: "Color Picker",
    path: "/color-picker",
    icon: Palette,
    description: "Pick colors and convert between formats",
    status: "Ready",
    color: "from-red-500 to-pink-500",
  },
];

const Index = () => {
  return (
    <div className="space-y-12 relative">
      {/* Hero Section */}
      <div className="text-center space-y-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-3xl"></div>

        <div className="relative">
          <Link
            to="/"
            className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-full border border-primary/20 backdrop-blur-sm shadow-lg animate-bounce-subtle hover:bg-primary/20 transition-colors duration-200"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse-slow">
              <div className="w-6 h-6 bg-white rounded-lg"></div>
            </div>
            <span className="font-bold text-2xl gradient-text">Dev Tools</span>
          </Link>

          <h1 className="text-5xl md:text-6xl font-bold mt-8 mb-6">
            <span className="gradient-text">Professional</span>
            <br />
            <span className="text-foreground">Developer Utilities-Mal</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A comprehensive suite of{" "}
            <span className="text-primary font-semibold">
              development tools
            </span>{" "}
            designed for modern developers.
            <br />
            Fast, and reliable.
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          const isReady = tool.status === "Ready";

          return (
            <Link
              key={tool.path}
              to={isReady ? tool.path : "#"}
              className={cn("block group", !isReady && "pointer-events-none")}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card
                className={cn(
                  "tool-card h-full animate-fade-in relative overflow-hidden",
                  !isReady && "opacity-60"
                )}
              >
                <CardHeader className="space-y-6 relative z-10">
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "p-4 rounded-2xl shadow-lg relative",
                        `bg-gradient-to-br ${tool.color}`,
                        "group-hover:scale-110 transition-transform duration-300"
                      )}
                    >
                      <Icon className="h-7 w-7 text-white" />
                      <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={isReady ? "default" : "secondary"}
                        className={cn(
                          "text-xs font-medium px-3 py-1 rounded-full",
                          isReady &&
                            "bg-green-500/10 text-green-600 border-green-500/20"
                        )}
                      >
                        {tool.status}
                      </Badge>
                      {isReady && (
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                      )}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-200">
                      {tool.name}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                {/* Gradient overlay on hover */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl",
                    `bg-gradient-to-br ${tool.color}`
                  )}
                ></div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Index;
