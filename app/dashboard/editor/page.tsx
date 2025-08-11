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
  Edit,
  Send,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Home,
  Settings,
  AlertCircle,
  FileText,
  Clock,
  User,
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
  status: "pending" | "filmed" | "edited" | "revision" | "approved" | "posted"
  rawFootage: UploadedFile[]
  editedVideo: UploadedFile[]
  revisionNotes?: string
}

interface Set {
  id: string
  name: string
  type: string
  description: string
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
  postingFolders: { [date: string]: UploadedFile[] }
}

export default function EditorDashboard() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Client A",
      isExpanded: true,
      postingFolders: {
        "2024-01-28": [],
        "2024-01-29": [],
      },
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
              description: "Outdoor beach scene with product showcase",
              videos: [
                {
                  id: "1",
                  number: 1,
                  status: "filmed",
                  rawFootage: [
                    {
                      id: "raw1",
                      name: "beach_scene_1_raw.mp4",
                      size: 1024000,
                      type: "video/mp4",
                      uploadedAt: new Date("2024-01-15T09:30:00"),
                      uploadedBy: "Filmer John",
                    },
                  ],
                  editedVideo: [],
                },
                {
                  id: "2",
                  number: 2,
                  status: "revision",
                  rawFootage: [
                    {
                      id: "raw2",
                      name: "beach_scene_2_raw.mp4",
                      size: 2048000,
                      type: "video/mp4",
                      uploadedAt: new Date("2024-01-15T10:15:00"),
                      uploadedBy: "Filmer John",
                    },
                  ],
                  editedVideo: [
                    {
                      id: "edit2",
                      name: "beach_scene_2_edited.mp4",
                      size: 1536000,
                      type: "video/mp4",
                      uploadedAt: new Date("2024-01-16T14:20:00"),
                      uploadedBy: "Editor Sarah",
                    },
                  ],
                  revisionNotes: "Please adjust the color grading in the sunset scene and improve audio levels",
                },
                {
                  id: "3",
                  number: 3,
                  status: "filmed",
                  rawFootage: [
                    {
                      id: "raw3",
                      name: "beach_scene_3_raw.mp4",
                      size: 1800000,
                      type: "video/mp4",
                      uploadedAt: new Date("2024-01-15T11:00:00"),
                      uploadedBy: "Filmer John",
                    },
                  ],
                  editedVideo: [],
                },
              ],
            },
            {
              id: "2",
              name: "Indoor Interview",
              type: "indoor",
              description: "Professional interview setup with controlled lighting",
              videos: [
                {
                  id: "4",
                  number: 1,
                  status: "filmed",
                  rawFootage: [
                    {
                      id: "raw4",
                      name: "interview_1_raw.mp4",
                      size: 2500000,
                      type: "video/mp4",
                      uploadedAt: new Date("2024-01-15T14:30:00"),
                      uploadedBy: "Filmer Mike",
                    },
                  ],
                  editedVideo: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ])

  const [activeTab, setActiveTab] = useState("editing")
  const [uploadSelection, setUploadSelection] = useState({
    clientId: "",
    dayId: "",
    setId: "",
    videoId: "",
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

  const handleEditedVideoUpload = (files: UploadedFile[]) => {
    if (!uploadSelection.clientId || !uploadSelection.dayId || !uploadSelection.setId || !uploadSelection.videoId) {
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
                              videos: set.videos.map((video) =>
                                video.id === uploadSelection.videoId
                                  ? {
                                      ...video,
                                      editedVideo: files,
                                      status: files.length > 0 ? "edited" : video.status,
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

  const sendForRevision = () => {
    if (!uploadSelection.videoId) return

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
                              videos: set.videos.map((video) =>
                                video.id === uploadSelection.videoId ? { ...video, status: "revision" } : video,
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

    // Notify revision team (in production, this would be an API call)
    console.log("Notifying revision team about new video for review")
    alert("Video sent for revision successfully!")

    // Reset selection
    setUploadSelection({ clientId: "", dayId: "", setId: "", videoId: "" })
  }

  const approveForPosting = () => {
    if (!uploadSelection.videoId) return

    const client = clients.find((c) => c.id === uploadSelection.clientId)
    const day = client?.days.find((d) => d.id === uploadSelection.dayId)
    const set = day?.sets.find((s) => s.id === uploadSelection.setId)
    const video = set?.videos.find((v) => v.id === uploadSelection.videoId)

    if (video && video.editedVideo.length > 0) {
      const postingDate = "2024-01-28" // In production, this would be dynamic

      setClients(
        clients.map((client) =>
          client.id === uploadSelection.clientId
            ? {
                ...client,
                postingFolders: {
                  ...client.postingFolders,
                  [postingDate]: [...(client.postingFolders[postingDate] || []), ...video.editedVideo],
                },
                days: client.days.map((day) =>
                  day.id === uploadSelection.dayId
                    ? {
                        ...day,
                        sets: day.sets.map((set) =>
                          set.id === uploadSelection.setId
                            ? {
                                ...set,
                                videos: set.videos.map((v) =>
                                  v.id === uploadSelection.videoId ? { ...v, status: "approved" } : v,
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

      alert("Video approved for posting successfully!")
      setUploadSelection({ clientId: "", dayId: "", setId: "", videoId: "" })
    }
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

  const getAvailableVideos = () => {
    const sets = getAvailableSets()
    const selectedSet = sets.find((s) => s.id === uploadSelection.setId)
    return selectedSet?.videos.filter((v) => v.rawFootage.length > 0) || []
  }

  const getSelectedVideo = () => {
    const videos = getAvailableVideos()
    return videos.find((v) => v.id === uploadSelection.videoId)
  }

  const canUpload =
    uploadSelection.clientId && uploadSelection.dayId && uploadSelection.setId && uploadSelection.videoId

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
      revision: "bg-orange-100 text-orange-800",
      approved: "bg-green-100 text-green-800",
      posted: "bg-purple-100 text-purple-800",
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const sidebar = (
    <nav className="p-4">
      <div className="space-y-2">
        <Button
          variant={activeTab === "editing" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("editing")}
        >
          <Home className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button
          variant={activeTab === "queue" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("queue")}
        >
          <Edit className="mr-2 h-4 w-4" />
          Editing Queue
        </Button>
        <Button
          variant={activeTab === "upload" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("upload")}
        >
          <Send className="mr-2 h-4 w-4" />
          Upload Edited
        </Button>
        <Button
          variant={activeTab === "posting" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("posting")}
        >
          <Folder className="mr-2 h-4 w-4" />
          Posting Folders
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
    <ProtectedRoute requiredRole="editor">
      <DashboardLayout title="Editor Dashboard" sidebar={sidebar}>
        <div className="space-y-6">
          {activeTab === "editing" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Edit className="h-8 w-8 text-blue-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">To Edit</p>
                        <p className="text-2xl font-bold">
                          {clients.reduce(
                            (acc, client) =>
                              acc +
                              client.days.reduce(
                                (dayAcc, day) =>
                                  dayAcc +
                                  day.sets.reduce(
                                    (setAcc, set) => setAcc + set.videos.filter((v) => v.status === "filmed").length,
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
                      <Send className="h-8 w-8 text-orange-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">In Revision</p>
                        <p className="text-2xl font-bold">
                          {clients.reduce(
                            (acc, client) =>
                              acc +
                              client.days.reduce(
                                (dayAcc, day) =>
                                  dayAcc +
                                  day.sets.reduce(
                                    (setAcc, set) => setAcc + set.videos.filter((v) => v.status === "revision").length,
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
                      <CheckCircle className="h-8 w-8 text-green-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Approved</p>
                        <p className="text-2xl font-bold">
                          {clients.reduce(
                            (acc, client) =>
                              acc +
                              client.days.reduce(
                                (dayAcc, day) =>
                                  dayAcc +
                                  day.sets.reduce(
                                    (setAcc, set) => setAcc + set.videos.filter((v) => v.status === "approved").length,
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
                      <Folder className="h-8 w-8 text-purple-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Ready to Post</p>
                        <p className="text-2xl font-bold">
                          {Object.values(clients[0]?.postingFolders || {}).reduce(
                            (acc, files) => acc + files.length,
                            0,
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {activeTab === "queue" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Raw Videos - Editing Queue</CardTitle>
                </CardHeader>
                <CardContent>
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
                                  </div>

                                  {day.isExpanded && (
                                    <div className="border-t bg-gray-50">
                                      <div className="p-4 space-y-6">
                                        {day.sets.map((set, setIndex) => (
                                          <div key={set.id} className="bg-white rounded-lg border p-6">
                                            <div className="flex items-center gap-2 mb-4">
                                              <Video className="h-5 w-5 text-purple-500" />
                                              <div>
                                                <h3 className="font-semibold text-lg">
                                                  Set {setIndex + 1} - {set.name}
                                                </h3>
                                                <p className="text-sm text-gray-600">{set.description}</p>
                                              </div>
                                              <Badge variant="secondary" className="ml-auto">
                                                {set.type}
                                              </Badge>
                                            </div>

                                            <div className="space-y-4">
                                              {set.videos
                                                .filter((video) => video.rawFootage.length > 0)
                                                .map((video) => (
                                                  <div key={video.id} className="border rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                      <div className="flex items-center gap-2">
                                                        <Video className="h-4 w-4 text-blue-500" />
                                                        <span className="font-medium">Video {video.number}</span>
                                                        <Badge className={getStatusColor(video.status)}>
                                                          {video.status}
                                                        </Badge>
                                                      </div>
                                                    </div>

                                                    {/* Raw Footage */}
                                                    <div className="mb-4">
                                                      <h5 className="font-medium mb-2 text-sm">Raw Footage:</h5>
                                                      <div className="bg-gray-50 rounded p-3 space-y-2">
                                                        {video.rawFootage.map((file) => (
                                                          <div
                                                            key={file.id}
                                                            className="flex items-center justify-between text-sm"
                                                          >
                                                            <div className="flex items-center gap-2">
                                                              <Video className="h-4 w-4 text-blue-500" />
                                                              <span>{file.name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-gray-500">
                                                              <span>{formatFileSize(file.size)}</span>
                                                              <div className="flex items-center gap-1">
                                                                <User className="h-3 w-3" />
                                                                {file.uploadedBy}
                                                              </div>
                                                              <div className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {file.uploadedAt.toLocaleString()}
                                                              </div>
                                                            </div>
                                                          </div>
                                                        ))}
                                                      </div>
                                                    </div>

                                                    {/* Revision Notes */}
                                                    {video.revisionNotes && (
                                                      <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
                                                        <h5 className="font-medium text-orange-800 mb-1">
                                                          Revision Notes:
                                                        </h5>
                                                        <p className="text-sm text-orange-700">{video.revisionNotes}</p>
                                                      </div>
                                                    )}

                                                    {/* Edited Video Status */}
                                                    {video.editedVideo.length > 0 && (
                                                      <div className="mb-4">
                                                        <h5 className="font-medium mb-2 text-sm">Edited Video:</h5>
                                                        <div className="bg-green-50 rounded p-3">
                                                          {video.editedVideo.map((file) => (
                                                            <div
                                                              key={file.id}
                                                              className="flex items-center gap-2 text-sm"
                                                            >
                                                              <CheckCircle className="h-4 w-4 text-green-500" />
                                                              <span>{file.name}</span>
                                                              <span className="text-gray-500">
                                                                ({formatFileSize(file.size)})
                                                              </span>
                                                            </div>
                                                          ))}
                                                        </div>
                                                      </div>
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
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "upload" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Edited Video</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Selection Form */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="client">Select Client</Label>
                      <Select
                        value={uploadSelection.clientId}
                        onValueChange={(value) =>
                          setUploadSelection({ clientId: value, dayId: "", setId: "", videoId: "" })
                        }
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
                        onValueChange={(value) =>
                          setUploadSelection({ ...uploadSelection, dayId: value, setId: "", videoId: "" })
                        }
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
                        onValueChange={(value) => setUploadSelection({ ...uploadSelection, setId: value, videoId: "" })}
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

                    <div>
                      <Label htmlFor="video">Select Video</Label>
                      <Select
                        value={uploadSelection.videoId}
                        onValueChange={(value) => setUploadSelection({ ...uploadSelection, videoId: value })}
                        disabled={!uploadSelection.setId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose video" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableVideos().map((video) => (
                            <SelectItem key={video.id} value={video.id}>
                              Video {video.number} ({video.status})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Video Information */}
                  {getSelectedVideo() && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Video className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-blue-900">
                              Video {getSelectedVideo()?.number} - Raw Footage Available
                            </h3>
                            <Badge className={`${getStatusColor(getSelectedVideo()?.status || "")}`}>
                              {getSelectedVideo()?.status}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {getSelectedVideo()?.rawFootage.map((file) => (
                              <div key={file.id} className="flex items-center gap-2 text-sm text-blue-800">
                                <FileText className="h-4 w-4" />
                                <span>{file.name}</span>
                                <span>({formatFileSize(file.size)})</span>
                                <span>by {file.uploadedBy}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Upload Section */}
                  {!canUpload && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please select a client, day, set, and video before uploading edited footage.
                      </AlertDescription>
                    </Alert>
                  )}

                  {canUpload && (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-green-300 bg-green-50 rounded-lg p-4">
                        <div className="text-center">
                          <Edit className="mx-auto h-8 w-8 text-green-600 mb-2" />
                          <p className="text-green-800 font-medium">Ready to upload edited video</p>
                          <p className="text-sm text-green-600">
                            Uploading edited version for Video {getSelectedVideo()?.number}
                          </p>
                        </div>
                      </div>

                      <FileUpload
                        onUpload={handleEditedVideoUpload}
                        existingFiles={getSelectedVideo()?.editedVideo || []}
                        accept={{ "video/*": [".mp4", ".mov", ".avi", ".mkv"] }}
                        maxFiles={1}
                      />

                      {/* Action Buttons */}
                      {getSelectedVideo()?.editedVideo && getSelectedVideo()?.editedVideo.length > 0 && (
                        <div className="flex gap-4">
                          <Button onClick={sendForRevision} variant="outline" className="flex-1 bg-transparent">
                            <Send className="mr-2 h-4 w-4" />
                            Send for Revision
                          </Button>
                          <Button onClick={approveForPosting} className="flex-1 bg-green-600 hover:bg-green-700">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve for Posting
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "posting" && (
            <div className="space-y-4">
              {clients.map((client) => (
                <Card key={client.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Folder className="h-5 w-5 text-purple-500" />
                      {client.name} - Posting Pipeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(client.postingFolders).map(([date, files]) => (
                        <div key={date} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-green-500" />
                              <span className="font-medium">{date}</span>
                              <Badge variant="outline">{files.length} videos</Badge>
                            </div>
                          </div>

                          {files.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {files.map((file) => (
                                <div key={file.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                  <Video className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm truncate">{file.name}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No videos ready for this date</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                          defaultValue="Editor User"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <input
                          id="email"
                          type="email"
                          defaultValue="editor@example.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="software">Preferred Editing Software</Label>
                        <Select defaultValue="premiere">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="premiere">Adobe Premiere Pro</SelectItem>
                            <SelectItem value="finalcut">Final Cut Pro</SelectItem>
                            <SelectItem value="davinci">DaVinci Resolve</SelectItem>
                            <SelectItem value="avid">Avid Media Composer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Export Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="format">Default Export Format</Label>
                        <Select defaultValue="h264">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="h264">H.264 MP4</SelectItem>
                            <SelectItem value="h265">H.265 MP4</SelectItem>
                            <SelectItem value="prores">ProRes 422</SelectItem>
                            <SelectItem value="dnxhd">DNxHD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="quality">Quality Preset</Label>
                        <Select defaultValue="high">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="web">Web Optimized</SelectItem>
                            <SelectItem value="high">High Quality</SelectItem>
                            <SelectItem value="broadcast">Broadcast Quality</SelectItem>
                            <SelectItem value="archive">Archive Quality</SelectItem>
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
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
