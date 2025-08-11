"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, LogOut, Settings, User, X } from "lucide-react"
import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  sidebar?: React.ReactNode
}

export function DashboardLayout({ children, title, sidebar }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const [dismissedUpdates, setDismissedUpdates] = useState<number[]>([])

  // Get current time in Toronto EST timezone
  const torontoTime = toZonedTime(new Date(), "America/Toronto")

  const getRoleSpecificNotifications = (role: string) => {
    switch (role) {
      case "admin":
        return [
          { id: 1, message: "New client 'Tech Startup' added to system" },
          { id: 2, message: "Shoot for Client A scheduled for tomorrow" },
          { id: 3, message: "3 ideators assigned to upcoming projects" },
        ]
      case "ideator":
        return [
          { id: 1, message: "You've been assigned to Client A project" },
          { id: 2, message: "New shoot planning required for Client B" },
          { id: 3, message: "Day 2 structure needs completion" },
        ]
      case "filmer":
        return [
          { id: 1, message: "You have 5 videos to film today" },
          { id: 2, message: "Beach Scene shoot starts at 9:00 AM" },
          { id: 3, message: "Equipment checklist updated for tomorrow" },
        ]
      case "editor":
        return [
          { id: 1, message: "Client A sent 3 videos for editing" },
          { id: 2, message: "2 videos approved and moved to posting" },
          { id: 3, message: "Revision feedback received for Project X" },
        ]
      case "revisions":
        return [
          { id: 1, message: "4 videos pending your review" },
          { id: 2, message: "Client A - Beach Scene needs feedback" },
          { id: 3, message: "Editor responded to your revision notes" },
        ]
      case "poster":
        return [
          { id: 1, message: "You have 2 folders with videos ready for posting" },
          { id: 2, message: "Client A - 3 videos scheduled for today" },
          { id: 3, message: "Instagram posting completed for yesterday" },
        ]
      default:
        return [{ id: 1, message: "Welcome to the platform" }]
    }
  }

  const notifications = getRoleSpecificNotifications(user?.role || "")
  const visibleNotifications = notifications.filter((n) => !dismissedUpdates.includes(n.id))

  const dismissUpdate = (id: number) => {
    setDismissedUpdates((prev) => [...prev, id])
  }

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      ideator: "bg-blue-100 text-blue-800",
      filmer: "bg-green-100 text-green-800",
      editor: "bg-purple-100 text-purple-800",
      revisions: "bg-orange-100 text-orange-800",
      poster: "bg-pink-100 text-pink-800",
    }
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {format(torontoTime, "EEEE, MMMM do, yyyy")} • {format(torontoTime, "h:mm a")} EST
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {visibleNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2">
                  <h3 className="font-semibold mb-2">Notifications</h3>
                  {visibleNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-2 hover:bg-gray-50 rounded text-sm flex items-start justify-between"
                    >
                      <span className="flex-1">{notification.message}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-2"
                        onClick={() => dismissUpdate(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {visibleNotifications.length === 0 && (
                    <p className="text-sm text-gray-500 p-2">No new notifications</p>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="text-sm font-medium">{user?.name}</div>
                    <Badge className={`text-xs ${getRoleBadgeColor(user?.role || "")}`}>
                      {user?.role?.toUpperCase()}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebar && (
          <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)]">{sidebar}</aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Recent Updates Card - Only show if there are visible notifications */}
          {visibleNotifications.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {visibleNotifications.slice(0, 2).map((notification) => (
                    <div key={notification.id} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm flex-1">{notification.message}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => dismissUpdate(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {children}
        </main>
      </div>
    </div>
  )
}
