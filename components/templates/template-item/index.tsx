"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { templateService } from "@/services/template.service";
import { Template } from "@/types/template";
import { MoreVertical, Edit2, Eye, Trash2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface TemplateItemProps {
  template: Template;
  onTemplateUpdate?: (template: Template) => void;
  onTemplateDelete?: (templateId: string) => void;
}

export default function TemplateItem({ 
  template, 
  onTemplateUpdate, 
  onTemplateDelete 
}: TemplateItemProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localTemplate, setLocalTemplate] = useState(template);

  const handleStatusToggle = async (checked: boolean) => {
    setIsToggling(true);
    
    // Optimistic update
    const previousTemplate = localTemplate;
    const optimisticTemplate = { ...localTemplate, isActive: checked };
    setLocalTemplate(optimisticTemplate);
    
    try {
      const result = await templateService.toggleTemplateStatus(template.id, checked);
      
      if (result) {
        setLocalTemplate(result);
        onTemplateUpdate?.(result);
        toast({
          title: "Success",
          description: `Template ${checked ? 'activated' : 'deactivated'} successfully`,
        });
      } else {
        // Revert on failure
        setLocalTemplate(previousTemplate);
        toast({
          title: "Error",
          description: "Failed to update template status",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Revert on error
      setLocalTemplate(previousTemplate);
      toast({
        title: "Error",
        description: "Failed to update template status",
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
    }
  };

  const handleEdit = () => {
    router.push(`/templates/edit/${template.id}`);
  };

  const handleView = () => {
    router.push(`/view/${template.companyId}?template=${template.id}`);
  };

  const handleViewInNewTab = () => {
    window.open(`/view/${template.companyId}?template=${template.id}`, '_blank');
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const result = await templateService.deleteTemplate(template.id);
      
      if (result) {
        onTemplateDelete?.(template.id);
        toast({
          title: "Success",
          description: "Template deleted successfully",
        });
        setShowDeleteDialog(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to delete template",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Unknown";
    return format(new Date(date), "MMM dd, yyyy");
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate">
                {localTemplate.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Created {formatDate(localTemplate.createdAt)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <Badge 
                variant={localTemplate.isActive ? "default" : "secondary"}
                className="text-xs"
              >
                {localTemplate.isActive ? "Active" : "Inactive"}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleView}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleViewInNewTab}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open in new tab
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {localTemplate.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Updated {formatDate(localTemplate.updatedAt)}
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor={`active-${template.id}`} className="text-sm font-medium">
                Active
              </label>
              <Switch
                id={`active-${template.id}`}
                checked={localTemplate.isActive}
                onCheckedChange={handleStatusToggle}
                disabled={isToggling}
                className="data-[state=checked]:bg-green-600"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleView}
            className="flex-1"
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleEdit}
            className="flex-1"
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{template.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
