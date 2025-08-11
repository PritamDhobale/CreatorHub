"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Folder,
  FolderOpen,
  Video,
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  ChevronRight,
  Upload,
  Home,
  Settings,
  Camera,
  AlertCircle,
  FileText,
} from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: Date
  uploadedBy: string
  url?: string
}

interface VideoSlot {
  id: string
  number: number
  status: "pending" | "filmed" | "edited" | "approved" | "posted"
  rawFootage: UploadedFile[]
}

interface Set {
  id: string
  name: string
  type: string
  description: string
  startTime: string
  location: string
  props: string[]
  actors: string[]
  videos: VideoSlot[]
}

interface Day {
  id: string
  name: string
  date: string
  sets: Set[]
  isExpanded: boolean
}

interface Client {
  id: string
  name: string
  days: Day[]
  isExpanded: boolean
}

export default function FilmerDashboard() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Client A",
      isExpanded: true,
      days: [
        {
          id: "1",
          name: "Day 1",
          date: "2024-01-15",
          isExpanded: true,
          sets: [
            {
              id: "1",
              name: "Beach Scene",
              type: "beach",
              description: "Outdoor beach scene with product showcase and sunset lighting",
              startTime: "09:00",
              location: "Santa Monica Beach",
              props: ["Surfboard", "Beach umbrella", "Cooler"],
              actors: ["Actor 1", "Actor 2"],
              videos: [
                { id: "1", number: 1, status: "pending", rawFootage: [] },
                { id: "2", number: 2, status: "pending", rawFootage: [] },
                { id: "3", number: 3, status: "pending", rawFootage: [] },
              ],
            },
            {
              id: "2",
              name: "Indoor Interview",
              type: "indoor",
              description: "Professional interview setup with controlled lighting",
              startTime: "14:00",
              location: "Studio B",
              props: ["Microphone", "Lighting kit"],
              actors: ["Host", "Guest"],
              videos: [
                { id: "4", number: 1, status: "pending", rawFootage: [] },
                { id: "5", number: 2, status: "pending", rawFootage: [] },
              ],
            },
          ],
        },
        {
          id: "2",
          name: "Day 2",
          date: "2024-01-16",
          isExpanded: false,
          sets: [
            {
              id: "3",
              name: "Product Showcase",
              type: "studio",
              description: "Clean product shots with rotating display",
              startTime: "10:00",
              location: "Studio A",
              props: ["Rotating platform", "White backdrop"],
              actors: [],
              videos: [
                { id: "6", number: 1, status: "pending", rawFootage: [] },
                { id: "7", number: 2, status: "pending", rawFootage: [] },
                { id: "8", number: 3, status: "pending", rawFootage: [] },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "2",
      name: "Client B",
      isExpanded: false,
      days: [
        {
          id: "3",
          name: "Day 1",
          date: "2024-01-20",
          isExpanded: false,
          sets: [
            {
              id: "4",
              name: "Office Tour",
              type: "office",
              description: "Walking tour of modern office space",
              startTime: "11:00",
              location: "Downtown Office",
              props: ["Steadicam", "Wireless mic"],
              actors: ["CEO", "Tour guide"],
              videos: [
                { id: "9", number: 1, status: "pending", rawFootage: [] },
                { id: "10", number: 2, status: "pending", rawFootage: [] },
              ],
            },
          ],
        },
      ],
    },
  ])

  const [activeTab, setActiveTab] = useState("dashboard")
  const [uploadSelection, setUploadSelection] = useState({
    clientId: "",
    dayId: "",
    setId: "",
  })

  const toggleClientExpansion = (clientId: string) => {
    setClients(
      clients.map((client) => (client.id === clientId ? { ...client, isExpanded: !client.isExpanded } : client)),
    )
  }

  const toggleDayExpansion = (clientId: string, dayId: string) => {
    setClients(
      clients.map((client) =>
        client.id === clientId
          ? {
              ...client,
              days: client.days.map((day) => (day.id === dayId ? { ...day, isExpanded: !day.isExpanded } : day)),
            }
          : client,
      ),
    )
  }

  const handleFileUpload = (files: UploadedFile[]) => {
    if (!uploadSelection.clientId || !uploadSelection.dayId || !uploadSelection.setId) {
      return
    }

    setClients(
      clients.map((client) =>
        client.id === uploadSelection.clientId
          ? {
              ...client,
              days: client.days.map((day) =>
                day.id === uploadSelection.dayId
                  ? {
                      ...day,
                      sets: day.sets.map((set) =>
                        set.id === uploadSelection.setId
                          ? {
                              ...set,
                              videos: set.videos.map((video, index) =>
                                index === 0 // Upload to first available video slot
                                  ? {
                                      ...video,
                                      rawFootage: files,
                                      status: files.length > 0 ? "filmed" : "pending",
                                    }
                                  : video,
                              ),
                            }
                          : set,
                      ),
                    }
                  : day,
              ),
            }
          : client,
      ),
    )
  }

  const getAvailableDays = () => {
    const selectedClient = clients.find((c) => c.id === uploadSelection.clientId)
    return selectedClient?.days || []
  }

  const getAvailableSets = () => {
    const selectedClient = clients.find((c) => c.id === uploadSelection.clientId)
    const selectedDay = selectedClient?.days.find((d) => d.id === uploadSelection.dayId)
    return selectedDay?.sets || []
  }

  const getSelectedSet = () => {
    const sets = getAvailableSets()
    return sets.find((s) => s.id === uploadSelection.setId)
  }

  const canUpload = uploadSelection.clientId && uploadSelection.dayId && uploadSelection.setId

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-gray-100 text-gray-800",
      filmed: "bg-blue-100 text-blue-800",
      edited: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      posted: "bg-purple-100 text-purple-800",
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const sidebar = (
    <nav className="p-4">
      <div className="space-y-2">
        <Button
          variant={activeTab === "dashboard" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("dashboard")}
        >
          <Home className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button
          variant={activeTab === "shoots" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("shoots")}
        >
          <Camera className="mr-2 h-4 w-4" />
          My Shoots
        </Button>
        <Button
          variant={activeTab === "upload" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("upload")}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Footage
        </Button>
        <Button
          variant={activeTab === "settings" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </nav>
  )

  return (
    <ProtectedRoute requiredRole="filmer">
      <DashboardLayout title="Filmer Dashboard" sidebar={sidebar}>
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Camera className="h-8 w-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Assigned Shoots</p>
                      <p className="text-2xl font-bold">
                        {clients.reduce((acc, client) => acc + client.days.length, 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Video className="h-8 w-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Videos to Film</p>
                      <p className="text-2xl font-bold">
                        {clients.reduce(
                          (acc, client) =>
                            acc +
                            client.days.reduce(
                              (dayAcc, day) =>
                                dayAcc +
                                day.sets.reduce(
                                  (setAcc, set) => setAcc + set.videos.filter((v) => v.status === "pending").length,
                                  0,
                                ),
                              0,
                            ),
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Upload className="h-8 w-8 text-purple-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Uploaded Today</p>
                      <p className="text-2xl font-bold">
                        {clients.reduce(
                          (acc, client) =>
                            acc +
                            client.days.reduce(
                              (dayAcc, day) =>
                                dayAcc +
                                day.sets.reduce(
                                  (setAcc, set) => setAcc + set.videos.filter((v) => v.rawFootage.length > 0).length,
                                  0,
                                ),
                              0,
                            ),
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assigned Shoots Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Shoots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.map((client) =>
                    client.days
                      .filter((day) => new Date(day.date).toDateString() === new Date().toDateString())
                      .map((day) => (
                        <div key={`${client.id}-${day.id}`} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">{client.name}</h3>
                              <p className="text-sm text-gray-600">
                                {day.name} - {new Date(day.date).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline">{day.sets.length} sets</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {day.sets.map((set, setIndex) => (
                              <div key={set.id} className="bg-gray-50 rounded p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Video className="h-4 w-4 text-purple-500" />
                                  <span className="font-medium text-sm">
                                    Set {setIndex + 1} - {set.name}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-600 space-y-1">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {set.startTime}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {set.location}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Video className="h-3 w-3" />
                                    {set.videos.length} videos
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "shoots" && (
          <div className="space-y-4">
            {clients.map((client) => (
              <Card key={client.id}>
                <CardHeader>
                  <CardTitle
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => toggleClientExpansion(client.id)}
                  >
                    {client.isExpanded ? (
                      <FolderOpen className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Folder className="h-5 w-5 text-gray-500" />
                    )}
                    {client.name}
                    {client.isExpanded ? (
                      <ChevronDown className="h-4 w-4 ml-auto" />
                    ) : (
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    )}
                  </CardTitle>
                </CardHeader>

                {client.isExpanded && (
                  <CardContent>
                    <div className="space-y-4">
                      {client.days.map((day) => (
                        <div key={day.id} className="border rounded-lg">
                          <div
                            className="flex items-center gap-2 p-4 cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleDayExpansion(client.id, day.id)}
                          >
                            {day.isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <Calendar className="h-4 w-4 text-green-500" />
                            <span className="font-medium">{day.name}</span>
                            <Badge variant="outline" className="ml-2">
                              {new Date(day.date).toLocaleDateString()}
                            </Badge>
                            <span className="text-sm text-gray-500 ml-auto">{day.sets.length} sets</span>
                          </div>

                          {day.isExpanded && (
                            <div className="border-t bg-gray-50">
                              <div className="p-4 space-y-4">
                                {day.sets.map((set, setIndex) => (
                                  <div key={set.id} className="bg-white rounded-lg border p-4">
                                    <div className="flex items-center justify-between mb-3">
                                      <div>
                                        <h4 className="font-semibold">
                                          Set {setIndex + 1} - {set.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">{set.description}</p>
                                      </div>
                                      <Badge variant="secondary">{set.type}</Badge>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                      <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-gray-500" />
                                        <span>{set.startTime}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <span>{set.location}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm">
                                        <Video className="h-4 w-4 text-gray-500" />
                                        <span>{set.videos.length} videos</span>
                                      </div>
                                    </div>

                                    {/* Uploaded Footage */}
                                    <div className="space-y-3">
                                      <h5 className="font-medium text-sm">Uploaded Footage:</h5>
                                      {set.videos.map((video) => (
                                        <div key={video.id} className="border rounded p-3">
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-sm">Video {video.number}</span>
                                            <Badge className={getStatusColor(video.status)}>{video.status}</Badge>
                                          </div>
                                          {video.rawFootage.length > 0 ? (
                                            <div className="space-y-2">
                                              {video.rawFootage.map((file) => (
                                                <div key={file.id} className="flex items-center gap-2 text-sm">
                                                  <Video className="h-4 w-4 text-blue-500" />
                                                  <span className="flex-1">{file.name}</span>
                                                  <span className="text-gray-500">{formatFileSize(file.size)}</span>
                                                  <span className="text-gray-500">
                                                    {file.uploadedAt.toLocaleString()}
                                                  </span>
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            <p className="text-sm text-gray-500">No footage uploaded yet</p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {activeTab === "upload" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Raw Footage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selection Form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="client">Select Client</Label>
                    <Select
                      value={uploadSelection.clientId}
                      onValueChange={(value) => setUploadSelection({ clientId: value, dayId: "", setId: "" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="day">Select Day</Label>
                    <Select
                      value={uploadSelection.dayId}
                      onValueChange={(value) => setUploadSelection({ ...uploadSelection, dayId: value, setId: "" })}
                      disabled={!uploadSelection.clientId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose day" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableDays().map((day) => (
                          <SelectItem key={day.id} value={day.id}>
                            {day.name} - {new Date(day.date).toLocaleDateString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="set">Select Set</Label>
                    <Select
                      value={uploadSelection.setId}
                      onValueChange={(value) => setUploadSelection({ ...uploadSelection, setId: value })}
                      disabled={!uploadSelection.dayId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose set" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableSets().map((set, index) => (
                          <SelectItem key={set.id} value={set.id}>
                            Set {index + 1} - {set.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Set Information */}
                {getSelectedSet() && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Video className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold text-blue-900">
                            {getSelectedSet()?.name} - {getSelectedSet()?.type}
                          </h3>
                        </div>
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                          <p className="text-sm text-blue-800">{getSelectedSet()?.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Start Time: {getSelectedSet()?.startTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            Location: {getSelectedSet()?.location}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Upload Section */}
                {!canUpload && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Please select a client, day, and set before uploading footage.</AlertDescription>
                  </Alert>
                )}

                {canUpload && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-green-300 bg-green-50 rounded-lg p-4">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-green-600 mb-2" />
                        <p className="text-green-800 font-medium">Ready to upload footage</p>
                        <p className="text-sm text-green-600">
                          Uploading to: {clients.find((c) => c.id === uploadSelection.clientId)?.name} /{" "}
                          {getAvailableDays().find((d) => d.id === uploadSelection.dayId)?.name} /{" "}
                          {getSelectedSet()?.name}
                        </p>
                      </div>
                    </div>

                    <FileUpload
                      onUpload={handleFileUpload}
                      accept={{ "video/*": [".mp4", ".mov", ".avi", ".mkv", ".m4v"] }}
                      maxFiles={5}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "settings" && (
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Profile Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <input
                        id="name"
                        type="text"
                        defaultValue="Filmer User"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <input
                        id="email"
                        type="email"
                        defaultValue="filmer@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <input
                        id="phone"
                        type="tel"
                        defaultValue="+1 (555) 123-4567"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Equipment Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="camera">Preferred Camera</Label>
                      <Select defaultValue="sony-fx6">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sony-fx6">Sony FX6</SelectItem>
                          <SelectItem value="canon-c70">Canon C70</SelectItem>
                          <SelectItem value="blackmagic-pocket">Blackmagic Pocket Cinema</SelectItem>
                          <SelectItem value="red-komodo">RED Komodo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="format">Recording Format</Label>
                      <Select defaultValue="4k-60fps">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4k-60fps">4K 60fps</SelectItem>
                          <SelectItem value="4k-30fps">4K 30fps</SelectItem>
                          <SelectItem value="1080p-60fps">1080p 60fps</SelectItem>
                          <SelectItem value="1080p-120fps">1080p 120fps</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    // Save settings logic here
                    alert("Settings saved successfully!")
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}
