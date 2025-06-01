"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Mail, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Mock users data
const users = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@techcorp.com",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
    lastActive: "2024-01-15",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane.doe@techcorp.com",
    role: "moderator",
    avatar: "/placeholder.svg?height=40&width=40",
    lastActive: "2024-01-14",
    status: "active",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@techcorp.com",
    role: "moderator",
    avatar: "/placeholder.svg?height=40&width=40",
    lastActive: "2024-01-10",
    status: "inactive",
  },
]

export default function Users() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-muted-foreground">Manage company users and their permissions</p>
          </div>
        </div>
        <Link href="/users/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </Link>
      </header>

      <div className="flex-1 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      <DropdownMenuItem>Change Role</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Remove User</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Role</span>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={user.status === "active" ? "default" : "outline"}>{user.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Active</span>
                    <span className="text-sm">{user.lastActive}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
