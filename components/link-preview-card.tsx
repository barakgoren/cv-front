import React from "react";
import { ExternalLink, Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkPreview } from "@/types/link-preview";

interface LinkPreviewCardProps {
  linkPreview: LinkPreview;
  className?: string;
}

export function LinkPreviewCard({ linkPreview, className }: LinkPreviewCardProps) {
  const handleClick = () => {
    window.open(linkPreview.url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card 
      className={`mt-3 cursor-pointer hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500 ${className}`}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold text-gray-900 line-clamp-2">
              {linkPreview.title || "Untitled"}
            </CardTitle>
            {linkPreview.siteName && (
              <div className="flex items-center gap-1 mt-1">
                <Globe className="h-3 w-3 text-muted-foreground" />
                <Badge variant="outline" className="text-xs">
                  {linkPreview.siteName}
                </Badge>
              </div>
            )}
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex gap-3">
          <div className="flex-1">
            {linkPreview.description && (
              <CardDescription className="text-sm text-gray-600 line-clamp-3 mb-2">
                {linkPreview.description}
              </CardDescription>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="truncate">
                {linkPreview.url}
              </span>
            </div>
          </div>
          
          {linkPreview.image && (
            <div className="flex-shrink-0">
              <img
                src={linkPreview.image}
                alt={linkPreview.title || "Link preview"}
                className="w-20 h-20 object-cover rounded-md border bg-gray-100"
                onError={(e) => {
                  // Hide image if it fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Default export for easier imports
export default LinkPreviewCard;
