"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import {
  applicationService,
  useApplication,
} from "@/services/application.service";
import { useAuthStore } from "@/store/auth.store";
import { Application, ServerApplication } from "@/types/application";
import { format } from "date-fns";
import DataTable from "@/components/data-table";

export default function Applications() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [applicationTypeFilter, setApplicationTypeFilter] = useState("all");
  const { user } = useAuthStore((state) => state);

  const { data: serverApplications = [] } = useApplication<ServerApplication[]>(
    {
      path: `company/${user?.companyId}`,
      shouldFetch: !!user && !!user.companyId,
    }
  );

  const applications = useMemo(() => {
    return serverApplications.map(applicationService.serialize);
  }, [serverApplications]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold">Applications</h1>
            <p className="text-muted-foreground">
              Manage and review all job applications
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </header>

      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Applications</CardTitle>
                <CardDescription>4 applications</CardDescription>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={applicationTypeFilter}
                onValueChange={setApplicationTypeFilter}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Application Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border">
              <DataTable<Application>
                data={applications}
                keyMap={{
                  id: "#",
                  fullName: "Full name",
                  applicationTypeName: "Application Type",
                  createdAt: "Applied Date",
                }}
                renderMap={{
                  createdAt: (date) => format(new Date(date), "MMM dd, yyyy"),
                  applicationTypeName: (type) => {
                    return (
                      <Badge
                        variant="default"
                        className="bg-blue-400/50 borde border-blue-400 text-black"
                      >
                        {type}
                      </Badge>
                    );
                  },
                }}
                actions={[
                  {
                    icon: <Eye className="h-4 w-4" />,
                    onClick: (application) => {
                      router.push(`/applications/${application.id}`);
                    },
                  },
                ]}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
