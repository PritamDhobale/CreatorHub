"use client"

import React from "react"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  Folder,
  FolderOpen,
  Video,
  Calendar,
  CheckCircle,
  Eye,
  Share,
  ChevronDown,
  ChevronRight,
  Home,
  Settings,
  Instagram,
  Youtube,
  Facebook,
  Hash,
} from "lucide-react"

interface PostingVideo {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: Date
  uploadedBy: string
  url?: string
  status: "ready" | "posted"
  postedAt?: Date
  platforms?: string[]
  captions?: { [platform: string]: string }
  hashtags?: { [platform: string]: string }
}

interface PostingFolder {
  date: string
  videos: PostingVideo[]
  isExpanded: boolean
}

interface Client {
  id: string
  name: string
  folders: PostingFolder[]
  isExpanded: boolean
}

interface PostingData {
  platforms: string[]
  captions: { [platform: string]: string }
  hashtags: { [platform: string]: string }
}

export default function PosterDashboard() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Client A",
      isExpanded: true,
      folders: [
        {
          date: "2024-01-28",
          isExpanded: true,
          videos: [
            {
              id: "1",
              name: "beach_scene_1_final.mp4",
              size: 1536000,
              type: "video/mp4",
              uploadedAt: new Date("2024-01-27T16:30:00"),
              uploadedBy: "Editor Sarah",
              status: "ready",
            },
            {
              id: "2",
              name: "indoor_interview_final.mp4",
              size: 2048000,
              type: "video/mp4",
              uploadedAt: new Date("2024-01-27T17:15:00"),
              uploadedBy: "Editor Sarah",
              status: "ready",
            },
            {
              id: "3",
              name: "product_showcase_final.mp4",
              size: 1792000,
              type: "video/mp4",
              uploadedAt: new Date("2024-01-27T18:00:00"),
              uploadedBy: "Editor Sarah",
              status: "ready",
            },
          ],
        },
        {
          date: "2024-01-29",
          isExpanded: false,
          videos: [
            {
              id: "4",
              name: "testimonial_1_final.mp4",
              size: 1280000,
              type: "video/mp4",
              uploadedAt: new Date("2024-01-28T10:30:00"),
              uploadedBy: "Editor Mike",
              status: "posted",
              postedAt: new Date("2024-01-29T09:00:00"),
              platforms: ["instagram", "tiktok"],
              captions: {
                instagram: "Amazing testimonial from our happy customer! 🌟",
                tiktok: "Customer love! Check out this testimonial 💯",
              },
              hashtags: {
                instagram: "#testimonial #customer #success #business",
                tiktok: "#testimonial #customerreview #success",
              },
            },
            {
              id: "5",
              name: "behind_scenes_final.mp4",
              size: 1920000,
              type: "video/mp4",
              uploadedAt: new Date("2024-01-28T11:15:00"),
              uploadedBy: "Editor Mike",
              status: "posted",
              postedAt: new Date("2024-01-29T12:00:00"),
              platforms: ["youtube", "facebook"],
              captions: {
                youtube: "Behind the scenes of our latest project! See how we create amazing content.",
                facebook: "Take a peek behind the curtain! Here's how we make the magic happen.",
              },
              hashtags: {
                youtube: "#behindthescenes #production #content #video",
                facebook: "#bts #production #team #creative",
              },
            },
          ],
        },
      ],
    },
  ])

  const [selectedVideo, setSelectedVideo] = useState<PostingVideo | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [postingModal, setPostingModal] = useState<{
    isOpen: boolean
    video: PostingVideo | null
    clientId: string
    date: string
  }>({
    isOpen: false,
    video: null,
    clientId: "",
    date: "",
  })

  const [postingData, setPostingData] = useState<PostingData>({
    platforms: [],
    captions: {},
    hashtags: {},
  })

  const [defaultSettings, setDefaultSettings] = useState({
    preferredPlatforms: ["instagram", "tiktok"],
    defaultHashtags: {
      instagram: "#content #video #social #marketing",
      tiktok: "#viral #content #video",
      youtube: "#video #content #youtube #subscribe",
      facebook: "#video #content #social #facebook",
    },
  })

  const platforms = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-600" },
    { id: "tiktok", name: "TikTok", icon: Video, color: "text-black" },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-600" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600" },
  ]

  const toggleClientExpansion = (clientId: string) => {
    setClients(
      clients.map((client) => (client.id === clientId ? { ...client, isExpanded: !client.isExpanded } : client)),
    )
  }

  const toggleFolderExpansion = (clientId: string, date: string) => {
    setClients(
      clients.map((client) =>
        client.id === clientId
          ? {
              ...client,
              folders: client.folders.map((folder) =>
                folder.date === date ? { ...folder, isExpanded: !folder.isExpanded } : folder,
              ),
            }
          : client,
      ),
    )
  }

  const handlePlatformToggle = (platformId: string, checked: boolean) => {
    const newPlatforms = checked
      ? [...postingData.platforms, platformId]
      : postingData.platforms.filter((p) => p !== platformId)

    const newCaptions = { ...postingData.captions }
    const newHashtags = { ...postingData.hashtags }

    if (checked) {
      newCaptions[platformId] = ""
      newHashtags[platformId] =
        defaultSettings.defaultHashtags[platformId as keyof typeof defaultSettings.defaultHashtags] || ""
    } else {
      delete newCaptions[platformId]
      delete newHashtags[platformId]
    }

    setPostingData({
      platforms: newPlatforms,
      captions: newCaptions,
      hashtags: newHashtags,
    })
  }

  const handleCaptionChange = (platform: string, caption: string) => {
    setPostingData({
      ...postingData,
      captions: { ...postingData.captions, [platform]: caption },
    })
  }

  const handleHashtagsChange = (platform: string, hashtags: string) => {
    setPostingData({
      ...postingData,
      hashtags: { ...postingData.hashtags, [platform]: hashtags },
    })
  }

  const confirmPost = async () => {
    if (!postingModal.video || postingData.platforms.length === 0) return

    // Simulate API call to post to platforms
    console.log("Posting to platforms:", postingData.platforms)
    console.log("Captions:", postingData.captions)
    console.log("Hashtags:", postingData.hashtags)

    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update video status
    setClients(
      clients.map((client) =>
        client.id === postingModal.clientId
          ? {
              ...client,
              folders: client.folders.map((folder) =>
                folder.date === postingModal.date
                  ? {
                      ...folder,
                      videos: folder.videos.map((video) =>
                        video.id === postingModal.video?.id
                          ? {
                              ...video,
                              status: "posted" as const,
                              postedAt: new Date(),
                              platforms: postingData.platforms,
                              captions: postingData.captions,
                              hashtags: postingData.hashtags,
                            }
                          : video,
                      ),
                    }
                  : folder,
              ),
            }
          : client,
      ),
    )

    // Show success message
    alert(`Successfully posted to ${postingData.platforms.join(", ")}!`)

    // Reset modal
    setPostingModal({ isOpen: false, video: null, clientId: "", date: "" })
    setPostingData({ platforms: [], captions: {}, hashtags: {} })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusColor = (status: string) => {
    return status === "posted" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
  }

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find((p) => p.id === platformId)
    return platform ? platform.icon : Video
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
          variant={activeTab === "pipeline" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("pipeline")}
        >
          <Folder className="mr-2 h-4 w-4" />
          Posting Pipeline
        </Button>
        <Button
          variant={activeTab === "posted" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("posted")}
        >
          <Share className="mr-2 h-4 w-4" />
          Posted Content
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
    <ProtectedRoute requiredRole="poster">
      <DashboardLayout title="Posting Pipeline" sidebar={sidebar}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Video className="h-8 w-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Ready to Post</p>
                      <p className="text-2xl font-bold">
                        {clients.reduce(
                          (acc, client) =>
                            acc +
                            client.folders.reduce(
                              (folderAcc, folder) =>
                                folderAcc + folder.videos.filter((v) => v.status === "ready").length,
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
                      <p className="text-sm font-medium text-gray-600">Posted Today</p>
                      <p className="text-2xl font-bold">
                        {clients.reduce(
                          (acc, client) =>
                            acc +
                            client.folders.reduce(
                              (folderAcc, folder) =>
                                folderAcc +
                                folder.videos.filter(
                                  (v) =>
                                    v.status === "posted" &&
                                    v.postedAt &&
                                    v.postedAt.toDateString() === new Date().toDateString(),
                                ).length,
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
                    <Calendar className="h-8 w-8 text-purple-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Scheduled Dates</p>
                      <p className="text-2xl font-bold">
                        {clients.reduce((acc, client) => acc + client.folders.length, 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-4">
            {/* Posting Folders */}
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
                        {client.folders.map((folder) => (
                          <div key={folder.date} className="border rounded-lg">
                            <div
                              className="flex items-center gap-2 p-4 cursor-pointer hover:bg-gray-50"
                              onClick={() => toggleFolderExpansion(client.id, folder.date)}
                            >
                              {folder.isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              <Calendar className="h-4 w-4 text-green-500" />
                              <span className="font-medium">{folder.date}</span>
                              <Badge variant="outline" className="ml-2">
                                {folder.videos.length} videos
                              </Badge>
                              <Badge
                                className={`ml-2 ${
                                  folder.videos.length === 3
                                    ? "bg-green-100 text-green-800"
                                    : "bg-orange-100 text-orange-800"
                                }`}
                              >
                                {folder.videos.length === 3 ? "Complete" : "Incomplete"}
                              </Badge>
                              <span className="text-sm text-gray-500 ml-auto">
                                {folder.videos.filter((v) => v.status === "posted").length} posted
                              </span>
                            </div>

                            {folder.isExpanded && (
                              <div className="border-t bg-gray-50">
                                <div className="p-4">
                                  {folder.videos.length !== 3 && (
                                    <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                      <p className="text-sm text-orange-800 font-medium">
                                        ⚠️ This folder must contain exactly 3 videos for posting
                                      </p>
                                      <p className="text-xs text-orange-600 mt-1">
                                        Current count: {folder.videos.length}/3
                                      </p>
                                    </div>
                                  )}

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {folder.videos.map((video, index) => (
                                      <div key={video.id} className="bg-white rounded-lg border p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                          <Video className="h-5 w-5 text-blue-500" />
                                          <span className="font-medium text-sm">Video {index + 1}</span>
                                          <Badge className={getStatusColor(video.status)}>{video.status}</Badge>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                          <p className="text-sm font-medium truncate" title={video.name}>
                                            {video.name}
                                          </p>
                                          <div className="text-xs text-gray-500 space-y-1">
                                            <p>Size: {formatFileSize(video.size)}</p>
                                            <p>Uploaded: {video.uploadedAt.toLocaleDateString()}</p>
                                            <p>By: {video.uploadedBy}</p>
                                            {video.postedAt && (
                                              <p>
                                                Posted: {video.postedAt.toLocaleDateString()} at{" "}
                                                {video.postedAt.toLocaleTimeString()}
                                              </p>
                                            )}
                                            {video.platforms && (
                                              <div className="flex gap-1 mt-2">
                                                {video.platforms.map((platform) => {
                                                  const PlatformIcon = getPlatformIcon(platform)
                                                  return (
                                                    <PlatformIcon
                                                      key={platform}
                                                      className="h-4 w-4 text-gray-600"
                                                      title={platform}
                                                    />
                                                  )
                                                })}
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        <div className="flex gap-2">
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 bg-transparent"
                                                onClick={() => setSelectedVideo(video)}
                                              >
                                                <Eye className="mr-1 h-3 w-3" />
                                                Preview
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-4xl">
                                              <DialogHeader>
                                                <DialogTitle>{video.name}</DialogTitle>
                                              </DialogHeader>
                                              <div className="space-y-4">
                                                <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                                                  <Video className="h-16 w-16 text-gray-400" />
                                                  <span className="ml-2 text-gray-400">Video Preview</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                  <div>
                                                    <p>
                                                      <strong>File:</strong> {video.name}
                                                    </p>
                                                    <p>
                                                      <strong>Size:</strong> {formatFileSize(video.size)}
                                                    </p>
                                                  </div>
                                                  <div>
                                                    <p>
                                                      <strong>Uploaded:</strong> {video.uploadedAt.toLocaleDateString()}
                                                    </p>
                                                    <p>
                                                      <strong>Status:</strong> {video.status}
                                                    </p>
                                                  </div>
                                                </div>
                                                {video.platforms && (
                                                  <div>
                                                    <h4 className="font-medium mb-2">Posted to:</h4>
                                                    <div className="space-y-2">
                                                      {video.platforms.map((platform) => (
                                                        <div key={platform} className="border rounded p-3">
                                                          <div className="flex items-center gap-2 mb-2">
                                                            {React.createElement(getPlatformIcon(platform), {
                                                              className: "h-4 w-4",
                                                            })}
                                                            <span className="font-medium capitalize">{platform}</span>
                                                          </div>
                                                          {video.captions?.[platform] && (
                                                            <p className="text-sm text-gray-600 mb-1">
                                                              <strong>Caption:</strong> {video.captions[platform]}
                                                            </p>
                                                          )}
                                                          {video.hashtags?.[platform] && (
                                                            <p className="text-sm text-gray-600">
                                                              <strong>Hashtags:</strong> {video.hashtags[platform]}
                                                            </p>
                                                          )}
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </DialogContent>
                                          </Dialog>

                                          {video.status === "ready" && (
                                            <Dialog
                                              open={postingModal.isOpen && postingModal.video?.id === video.id}
                                              onOpenChange={(open) => {
                                                if (!open) {
                                                  setPostingModal({
                                                    isOpen: false,
                                                    video: null,
                                                    clientId: "",
                                                    date: "",
                                                  })
                                                  setPostingData({ platforms: [], captions: {}, hashtags: {} })
                                                }
                                              }}
                                            >
                                              <DialogTrigger asChild>
                                                <Button
                                                  size="sm"
                                                  onClick={() => {
                                                    setPostingModal({
                                                      isOpen: true,
                                                      video,
                                                      clientId: client.id,
                                                      date: folder.date,
                                                    })
                                                    setPostingData({
                                                      platforms: defaultSettings.preferredPlatforms,
                                                      captions: defaultSettings.preferredPlatforms.reduce(
                                                        (acc, platform) => ({ ...acc, [platform]: "" }),
                                                        {},
                                                      ),
                                                      hashtags: defaultSettings.preferredPlatforms.reduce(
                                                        (acc, platform) => ({
                                                          ...acc,
                                                          [platform]:
                                                            defaultSettings.defaultHashtags[
                                                              platform as keyof typeof defaultSettings.defaultHashtags
                                                            ],
                                                        }),
                                                        {},
                                                      ),
                                                    })
                                                  }}
                                                  className="bg-green-600 hover:bg-green-700"
                                                >
                                                  <CheckCircle className="mr-1 h-3 w-3" />
                                                  Post
                                                </Button>
                                              </DialogTrigger>
                                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                  <DialogTitle>Post Video: {video.name}</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-6">
                                                  {/* Platform Selection */}
                                                  <div>
                                                    <Label className="text-base font-medium">Select Platforms</Label>
                                                    <div className="grid grid-cols-2 gap-4 mt-3">
                                                      {platforms.map((platform) => (
                                                        <div
                                                          key={platform.id}
                                                          className="flex items-center space-x-3 p-3 border rounded-lg"
                                                        >
                                                          <Checkbox
                                                            id={platform.id}
                                                            checked={postingData.platforms.includes(platform.id)}
                                                            onCheckedChange={(checked) =>
                                                              handlePlatformToggle(platform.id, checked as boolean)
                                                            }
                                                          />
                                                          <platform.icon className={`h-5 w-5 ${platform.color}`} />
                                                          <Label htmlFor={platform.id} className="font-medium">
                                                            {platform.name}
                                                          </Label>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </div>

                                                  {/* Platform-specific content */}
                                                  {postingData.platforms.map((platformId) => {
                                                    const platform = platforms.find((p) => p.id === platformId)
                                                    if (!platform) return null

                                                    return (
                                                      <div key={platformId} className="border rounded-lg p-4">
                                                        <div className="flex items-center gap-2 mb-4">
                                                          <platform.icon className={`h-5 w-5 ${platform.color}`} />
                                                          <h3 className="font-medium">{platform.name}</h3>
                                                        </div>

                                                        <div className="space-y-4">
                                                          <div>
                                                            <Label htmlFor={`caption-${platformId}`}>Caption</Label>
                                                            <Textarea
                                                              id={`caption-${platformId}`}
                                                              value={postingData.captions[platformId] || ""}
                                                              onChange={(e) =>
                                                                handleCaptionChange(platformId, e.target.value)
                                                              }
                                                              placeholder={`Write your ${platform.name} caption...`}
                                                              rows={3}
                                                              className="mt-1"
                                                            />
                                                          </div>

                                                          <div>
                                                            <Label htmlFor={`hashtags-${platformId}`}>
                                                              <Hash className="inline h-4 w-4 mr-1" />
                                                              Hashtags
                                                            </Label>
                                                            <Input
                                                              id={`hashtags-${platformId}`}
                                                              value={postingData.hashtags[platformId] || ""}
                                                              onChange={(e) =>
                                                                handleHashtagsChange(platformId, e.target.value)
                                                              }
                                                              placeholder="#hashtag1 #hashtag2 #hashtag3"
                                                              className="mt-1"
                                                            />
                                                          </div>
                                                        </div>
                                                      </div>
                                                    )
                                                  })}

                                                  {/* Post Button */}
                                                  <div className="flex justify-end gap-4">
                                                    <Button
                                                      variant="outline"
                                                      onClick={() =>
                                                        setPostingModal({
                                                          isOpen: false,
                                                          video: null,
                                                          clientId: "",
                                                          date: "",
                                                        })
                                                      }
                                                    >
                                                      Cancel
                                                    </Button>
                                                    <Button
                                                      onClick={confirmPost}
                                                      disabled={postingData.platforms.length === 0}
                                                      className="bg-green-600 hover:bg-green-700"
                                                    >
                                                      <CheckCircle className="mr-2 h-4 w-4" />
                                                      Post Now to {postingData.platforms.length} Platform
                                                      {postingData.platforms.length !== 1 ? "s" : ""}
                                                    </Button>
                                                  </div>
                                                </div>
                                              </DialogContent>
                                            </Dialog>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
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
          </TabsContent>

          <TabsContent value="posted" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Posted Content Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.flatMap((client) =>
                    client.folders.flatMap((folder) =>
                      folder.videos
                        .filter((video) => video.status === "posted")
                        .map((video) => (
                          <div key={video.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h3 className="font-semibold">{video.name}</h3>
                                <p className="text-sm text-gray-600">
                                  {client.name} • {folder.date}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge className="bg-green-100 text-green-800">Posted</Badge>
                                <p className="text-xs text-gray-500 mt-1">
                                  {video.postedAt?.toLocaleDateString()} at {video.postedAt?.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Platforms:</span>
                                <div className="flex gap-2">
                                  {video.platforms?.map((platform) => {
                                    const PlatformIcon = getPlatformIcon(platform)
                                    return (
                                      <div key={platform} className="flex items-center gap-1">
                                        <PlatformIcon className="h-4 w-4" />
                                        <span className="text-sm capitalize">{platform}</span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>

                              {video.captions && Object.keys(video.captions).length > 0 && (
                                <div>
                                  <span className="text-sm font-medium">Captions:</span>
                                  <div className="mt-1 space-y-2">
                                    {Object.entries(video.captions).map(([platform, caption]) => (
                                      <div key={platform} className="bg-gray-50 rounded p-2">
                                        <div className="flex items-center gap-1 mb-1">
                                          {React.createElement(getPlatformIcon(platform), {
                                            className: "h-3 w-3",
                                          })}
                                          <span className="text-xs font-medium capitalize">{platform}:</span>
                                        </div>
                                        <p className="text-sm text-gray-700">{caption}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {video.hashtags && Object.keys(video.hashtags).length > 0 && (
                                <div>
                                  <span className="text-sm font-medium">Hashtags:</span>
                                  <div className="mt-1 space-y-1">
                                    {Object.entries(video.hashtags).map(([platform, hashtags]) => (
                                      <div key={platform} className="flex items-center gap-2">
                                        {React.createElement(getPlatformIcon(platform), {
                                          className: "h-3 w-3",
                                        })}
                                        <span className="text-xs capitalize">{platform}:</span>
                                        <span className="text-xs text-blue-600">{hashtags}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )),
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Posting Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Default Platforms</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {platforms.map((platform) => (
                        <div key={platform.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Checkbox
                            id={`default-${platform.id}`}
                            checked={defaultSettings.preferredPlatforms.includes(platform.id)}
                            onCheckedChange={(checked) => {
                              const newPreferred = checked
                                ? [...defaultSettings.preferredPlatforms, platform.id]
                                : defaultSettings.preferredPlatforms.filter((p) => p !== platform.id)
                              setDefaultSettings({
                                ...defaultSettings,
                                preferredPlatforms: newPreferred,
                              })
                            }}
                          />
                          <platform.icon className={`h-5 w-5 ${platform.color}`} />
                          <Label htmlFor={`default-${platform.id}`} className="font-medium">
                            {platform.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Default Hashtags</h3>
                    <div className="space-y-4">
                      {platforms.map((platform) => (
                        <div key={platform.id}>
                          <Label htmlFor={`hashtags-${platform.id}`} className="flex items-center gap-2">
                            <platform.icon className={`h-4 w-4 ${platform.color}`} />
                            {platform.name} Hashtags
                          </Label>
                          <Input
                            id={`hashtags-${platform.id}`}
                            value={
                              defaultSettings.defaultHashtags[
                                platform.id as keyof typeof defaultSettings.defaultHashtags
                              ] || ""
                            }
                            onChange={(e) =>
                              setDefaultSettings({
                                ...defaultSettings,
                                defaultHashtags: {
                                  ...defaultSettings.defaultHashtags,
                                  [platform.id]: e.target.value,
                                },
                              })
                            }
                            placeholder={`Default hashtags for ${platform.name}`}
                            className="mt-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      alert("Settings saved successfully!")
                    }}
                  >
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
