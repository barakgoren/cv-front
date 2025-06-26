"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  File,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import useSWR from "swr";
import CVPreviewCard from "./cv-preview-card";

interface FilePreviewProps {
  fileUrl: string;
  fileName?: string;
  showInline?: boolean;
  maxInlineHeight?: string;
}

export function FilePreview({
  fileUrl,
  fileName,
  showInline = false,
  maxInlineHeight = "16rem",
}: FilePreviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const displayName = fileName || fileUrl.split("/").pop() || "Unknown file";
  const fileExtension = displayName.split(".").pop()?.toLowerCase();
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | undefined>(
    undefined
  );

  const { data, isLoading, isValidating } = useSWR(
    selectedFileUrl
      ? `${process.env.NEXT_PUBLIC_API_URL}/files/read-pdf?pdfUrl=${selectedFileUrl}`
      : undefined,
    {
      fetcher: (url: string) => fetch(url).then((res) => res.json()),
      revalidateOnFocus: false,
    }
  );

  // Get file type category
  const getFileType = () => {
    if (
      ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(
        fileExtension || ""
      )
    ) {
      return "image";
    }
    if (["pdf"].includes(fileExtension || "")) {
      return "pdf";
    }
    if (
      ["mp4", "webm", "ogg", "mov", "avi", "mkv"].includes(fileExtension || "")
    ) {
      return "video";
    }
    if (
      ["mp3", "wav", "ogg", "m4a", "aac", "flac"].includes(fileExtension || "")
    ) {
      return "audio";
    }
    if (
      ["txt", "md", "json", "xml", "csv", "log"].includes(fileExtension || "")
    ) {
      return "text";
    }
    if (
      ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(
        fileExtension || ""
      )
    ) {
      return "office";
    }
    return "other";
  };

  const fileType = getFileType();

  // Get appropriate icon
  const getFileIcon = () => {
    switch (fileType) {
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "audio":
        return <Music className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  // Render inline preview
  const renderInlinePreview = () => {
    if (!showInline) return null;

    switch (fileType) {
      case "image":
        return (
          <div className="mt-2 border rounded-lg overflow-hidden max-h-64">
            {!imageError ? (
              <img
                src={fileUrl}
                alt={displayName}
                className="w-full h-auto object-contain cursor-pointer hover:opacity-90 transition-opacity max-h-64"
                onClick={() => setIsModalOpen(true)}
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="flex items-center justify-center h-32 bg-gray-100 text-gray-500">
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Cannot preview image</p>
                </div>
              </div>
            )}
          </div>
        );

      case "video":
        return (
          <div className="mt-2 border rounded-lg overflow-hidden max-h-64">
            <video
              controls
              className="w-full h-auto max-h-64"
              preload="metadata"
            >
              <source src={fileUrl} type={`video/${fileExtension}`} />
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case "audio":
        return (
          <div className="mt-2">
            <audio controls className="w-full">
              <source src={fileUrl} type={`audio/${fileExtension}`} />
              Your browser does not support the audio tag.
            </audio>
          </div>
        );

      case "pdf":
      case "text":
        return (
          <div className="mt-2 space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {fileType === "pdf" ? "PDF Document" : "Text File"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Open Preview
                </Button>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Click to open {fileType === "pdf" ? "PDF" : "text file"} in
                preview
              </p>
              {fileType === "pdf" && (
                <div>
                  <Button
                    variant={"outline"}
                    className="w-full"
                    onClick={() => setSelectedFileUrl(fileUrl)}
                    disabled={isLoading || isValidating}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isLoading || isValidating
                      ? "Analyzing..."
                      : "Get AI Summary"}
                  </Button>
                </div>
              )}
              {/* CV Analysis Preview */}
              {data && !isLoading && <CVPreviewCard data={data.data} />}
            </div>
          </div>
        );

      default:
        return (
          <div className="mt-2 border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {displayName}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              File preview not available for this type
            </p>
          </div>
        );
    }
  };

  // Render modal content
  const renderModalContent = () => {
    switch (fileType) {
      case "image":
        return (
          <div className="max-w-4xl max-h-[80vh] overflow-auto">
            <img
              src={fileUrl}
              alt={displayName}
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        );

      case "pdf":
        return (
          <div className="w-full h-[80vh]">
            <iframe
              src={fileUrl}
              className="w-full h-full border-0 rounded"
              title={displayName}
            />
          </div>
        );

      case "video":
        return (
          <div className="max-w-4xl">
            <video controls className="w-full h-auto max-h-[70vh]">
              <source src={fileUrl} type={`video/${fileExtension}`} />
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case "text":
        return (
          <div className="max-w-4xl max-h-[70vh] overflow-auto">
            <iframe
              src={fileUrl}
              className="w-full h-96 border rounded"
              title={displayName}
            />
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <File className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-semibold mb-2">{displayName}</p>
            <p className="text-gray-600 mb-4">
              This file type cannot be previewed in the browser.
            </p>
            <Button asChild>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Download File
              </a>
            </Button>
          </div>
        );
    }
  };

  const canPreview = ["image", "pdf", "video", "text"].includes(fileType);

  return (
    <div className="space-y-2">
      {/* File info and actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" asChild>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4 mr-2" />
            Download
          </a>
        </Button>

        {canPreview && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 max-w-full overflow-hidden">
                  <div className="flex-shrink-0">{getFileIcon()}</div>
                  <span className="block truncate max-w-[calc(100%-2rem)]">
                    {displayName}
                  </span>
                </DialogTitle>
              </DialogHeader>
              {renderModalContent()}
            </DialogContent>
          </Dialog>
        )}

        <Button variant="ghost" size="sm" asChild>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in new tab
          </a>
        </Button>

        <Badge variant="secondary" className="text-xs">
          {fileExtension?.toUpperCase()} • {fileType}
        </Badge>
      </div>

      {/* Inline preview */}
      {renderInlinePreview()}
    </div>
  );
}

export default FilePreview;
