import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Code,
  Calendar,
  FileText,
  Text,
  Image,
  QrCode,
  Clipboard,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MainBrandLogo from "./MainBrandLogo";

const tools = [
  {
    name: "Home",
    path: "/",
    icon: Home,
    description: "Back to home page",
  },
  {
    name: "QR Code Generator",
    path: "/qr-code",
    icon: QrCode,
    description: "Generate QR codes",
  },
  {
    name: "JSON Formatter",
    path: "/json",
    icon: FileText,
    description: "Format & validate JSON",
  },
  {
    name: "Color Picker",
    path: "/color-picker",
    icon: Palette,
    description: "Pick & convert colors",
  },
  {
    name: "Timezone Converter",
    path: "/timezone",
    icon: Calendar,
    description: "Convert times between zones",
  },
  {
    name: "Text Case Converter",
    path: "/text-case",
    icon: Text,
    description: "Transform text cases",
  },
  {
    name: "Base64 Encoder",
    path: "/base64",
    icon: Code,
    description: "Encode & decode Base64 strings",
  },
  {
    name: "Image to Base64",
    path: "/image-base64",
    icon: Image,
    description: "Convert images to Base64",
  },
  {
    name: "Clipboard Manager",
    path: "/clipboard",
    icon: Clipboard,
    description: "Manage clipboard history",
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar = ({ collapsed, onToggleCollapse }: SidebarProps) => {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-72"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <MainBrandLogo
          logoSrc="/soft-logo.webp"
          mainDomain="soft.io.vn"
          dismissible={false}
          altText="Logo Soft"
        />
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = location.pathname === tool.path;

          return (
            <Link
              key={tool.path}
              to={tool.path}
              className={cn(
                "nav-item group relative flex items-center p-2 rounded-md hover:bg-sidebar-accent transition-colors duration-200",
                isActive && "bg-sidebar-accent",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon
                className={cn("h-5 w-5 flex-shrink-0 text-sidebar-foreground")}
              />

              {!collapsed && (
                <div className="flex-1 animate-slide-in-left ml-3">
                  <div
                    className={cn(
                      "font-medium text-sm text-sidebar-foreground"
                    )}
                  >
                    {tool.name}
                  </div>
                  <div className={cn("text-xs text-sidebar-foreground/60")}>
                    {tool.description}
                  </div>
                </div>
              )}

              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover border border-border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  <div className="font-medium text-sm">{tool.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {tool.description}
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
