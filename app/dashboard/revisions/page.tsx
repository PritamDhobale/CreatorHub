"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { VideoPlayer } from "@/components/video-player"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Video, MessageCircle, CheckCircle, XCircle, Clock, Home, Settings, Eye, RotateCcw, Send } from "lucide-react"

interface Comment {
  id: string
  timestamp: number
  author: string
  content: string
  createdAt: Date
  replies?: Comment[]
}

interface VideoForReview {
  id: string
  title: string
  clientName: string
  setName: string
  videoNumber: number
  videoUrl: string
  status: "pending_review" | "needs_changes" | "approved"
  submittedAt: Date
  comments: Comment[]
  revisionNotes?: string
  editedBy: string
}

export default function RevisionsDashboard() {
  const [videos, setVideos] = useState<VideoForReview[]>([
    {
      id: "1",
      title: "Beach Scene - Video 1",
      clientName: "Client A",
      setName: "Beach Scene",
      videoNumber: 1,
      videoUrl: "/videos/sample.mp4",
      status: "pending_review",
      submittedAt: new Date("2024-01-15T10:30:00"),
      editedBy: "Editor Sarah",
      comments: [
        {
          id: "1",
          timestamp: 45,
          author: "Reviewer John",
          content: "The lighting looks great here, but could we adjust the color temperature slightly?",
          createdAt: new Date("2024-01-15T11:00:00"),
        },
        {
          id: "2",
          timestamp: 120,
          author: "Reviewer Sarah",
          content: "Love the composition in this shot!",
          createdAt: new Date("2024-01-15T11:15:00"),
        },
      ],
    },
    {
      id: "2",
      title: "Indoor Interview - Video 2",
      clientName: "Client A",
      setName: "Indoor Interview",
      videoNumber: 2,
      videoUrl: "/videos/sample.mp4",
      status: "needs_changes",
      submittedAt: new Date("2024-01-14T14:20:00"),
      editedBy: "Editor Mike",
      comments: [
        {
          id: "3",
          timestamp: 30,
          author: "Reviewer Mike",
          content: "Audio levels seem inconsistent here",
          createdAt: new Date("2024-01-14T15:00:00"),
          replies: [
            {
              id: "4",
              timestamp: 0,
              author: "Editor Mike",
              content: "I'll adjust the audio levels and resubmit",
              createdAt: new Date("2024-01-14T15:30:00"),
            },
          ],
        },
      ],
      revisionNotes: "Please adjust audio levels and improve color grading in the first 60 seconds",
    },
    {
      id: "3",
      title: "Product Showcase - Video 1",
      clientName: "Client A",
      setName: "Product Showcase",
      videoNumber: 1,
      videoUrl: "/videos/sample.mp4",
      status: "approved",
      submittedAt: new Date("2024-01-13T09:15:00"),
      editedBy: "Editor Sarah",
      comments: [
        {
          id: "5",
          timestamp: 15,
          author: "Reviewer John",
          content: "Perfect! This is exactly what we needed.",
          createdAt: new Date("2024-01-13T10:00:00"),
        },
      ],
    },
  ])

  const [selectedVideo, setSelectedVideo] = useState<VideoForReview | null>(null)
  const [revisionNotes, setRevisionNotes] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")

  const handleAddComment = (videoId: string, timestamp: number, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      timestamp,
      author: "Current Reviewer", // In production, get from auth context
      content,
      createdAt: new Date(),
    }

    setVideos(
      videos.map((video) => (video.id === videoId ? { ...video, comments: [...video.comments, newComment] } : video)),
    )

    if (selectedVideo?.id === videoId) {
      setSelectedVideo({
        ...selectedVideo,
        comments: [...selectedVideo.comments, newComment],
      })
    }
  }

  const handleReply = (videoId: string, commentId: string, content: string) => {
    const reply: Comment = {
      id: Date.now().toString(),
      timestamp: 0,
      author: "Current Reviewer",
      content,
      createdAt: new Date(),
    }

    setVideos(
      videos.map((video) =>
        video.id === videoId
          ? {
              ...video,
              comments: video.comments.map((comment) =>
                comment.id === commentId ? { ...comment, replies: [...(comment.replies || []), reply] } : comment,
              ),
            }
          : video,
      ),
    )

    if (selectedVideo?.id === videoId) {
      setSelectedVideo({
        ...selectedVideo,
        comments: selectedVideo.comments.map((comment) =>
          comment.id === commentId ? { ...comment, replies: [...(comment.replies || []), reply] } : comment,
        ),
      })
    }
  }

  const handleApprove = (videoId: string) => {
    setVideos(videos.map((video) => (video.id === videoId ? { ...video, status: "approved" } : video)))
    setSelectedVideo(null)
    // Notify editor (in production, this would be an API call)
    console.log("Notifying editor about video approval")
    alert("Video approved successfully!")
  }

  const handleSendBackForFixes = (videoId: string) => {
    if (revisionNotes.trim()) {
      setVideos(
        videos.map((video) =>
          video.id === videoId
            ? {
                ...video,
                status: "needs_changes",
                revisionNotes: revisionNotes,
              }
            : video,
        ),
      )

      // Notify assigned editor (in production, this would be an API call)
      const video = videos.find((v) => v.id === videoId)
      console.log(`Notifying ${video?.editedBy} about required changes for ${video?.title}`)
      alert(`Revision notes sent to ${video?.editedBy} successfully!`)

      setRevisionNotes("")
      setSelectedVideo(null)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending_review: "bg-yellow-100 text-yellow-800",
      needs_changes: "bg-red-100 text-red-800",
      approved: "bg-green-100 text-green-800",
    }
    return colors[status as keyof typeof colors] || colors.pending_review
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending_review":
        return <Clock className="h-4 w-4" />
      case "needs_changes":
        return <XCircle className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
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
          variant={activeTab === "queue" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("queue")}
        >
          <Eye className="mr-2 h-4 w-4" />
          Review Queue
        </Button>
        <Button
          variant={activeTab === "revisions" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("revisions")}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Revisions
        </Button>
        <Button
          variant={activeTab === "comments" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("comments")}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Comments
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
    <ProtectedRoute requiredRole="revisions">
      <DashboardLayout title="Revisions Dashboard" sidebar={sidebar}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-yellow-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending Review</p>
                      <p className="text-2xl font-bold">{videos.filter((v) => v.status === "pending_review").length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <XCircle className="h-8 w-8 text-red-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Needs Changes</p>
                      <p className="text-2xl font-bold">{videos.filter((v) => v.status === "needs_changes").length}</p>
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
                      <p className="text-2xl font-bold">{videos.filter((v) => v.status === "approved").length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Videos for Review */}
            <Card>
              <CardHeader>
                <CardTitle>Videos for Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <Video className="h-8 w-8 text-blue-500" />
                        <div>
                          <h3 className="font-semibold">{video.title}</h3>
                          <p className="text-sm text-gray-600">
                            {video.clientName} • {video.setName} • Video {video.videoNumber}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-gray-500">
                              Submitted: {video.submittedAt.toLocaleDateString()} at{" "}
                              {video.submittedAt.toLocaleTimeString()}
                            </p>
                            <span className="text-xs text-gray-400">•</span>
                            <p className="text-xs text-gray-500">Edited by: {video.editedBy}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{video.comments.length}</span>
                        </div>

                        <Badge className={`${getStatusColor(video.status)} flex items-center gap-1`}>
                          {getStatusIcon(video.status)}
                          {video.status.replace("_", " ")}
                        </Badge>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedVideo(video)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                {video.title}
                                <Badge className={getStatusColor(video.status)}>{video.status.replace("_", " ")}</Badge>
                              </DialogTitle>
                            </DialogHeader>

                            {selectedVideo && (
                              <div className="space-y-4">
                                {/* Video Info */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Client:</span> {selectedVideo.clientName}
                                    </div>
                                    <div>
                                      <span className="font-medium">Set:</span> {selectedVideo.setName}
                                    </div>
                                    <div>
                                      <span className="font-medium">Edited by:</span> {selectedVideo.editedBy}
                                    </div>
                                    <div>
                                      <span className="font-medium">Submitted:</span>{" "}
                                      {selectedVideo.submittedAt.toLocaleString()}
                                    </div>
                                  </div>
                                </div>

                                {/* Video Player with Comments */}
                                <VideoPlayer
                                  videoUrl={selectedVideo.videoUrl}
                                  videoTitle={selectedVideo.title}
                                  comments={selectedVideo.comments}
                                  onAddComment={(timestamp, content) =>
                                    handleAddComment(selectedVideo.id, timestamp, content)
                                  }
                                  onReply={(commentId, content) => handleReply(selectedVideo.id, commentId, content)}
                                  onApprove={() => handleApprove(selectedVideo.id)}
                                  onRequestChanges={() => handleSendBackForFixes(selectedVideo.id)}
                                  canModerate={selectedVideo.status === "pending_review"}
                                />

                                {/* Send Back for Fixes */}
                                {selectedVideo.status === "pending_review" && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg flex items-center gap-2">
                                        <RotateCcw className="h-5 w-5" />
                                        Send Back for Fixes
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div>
                                        <Label htmlFor="revisionNotes">
                                          Revision Notes (required if requesting changes)
                                        </Label>
                                        <Textarea
                                          id="revisionNotes"
                                          value={revisionNotes}
                                          onChange={(e) => setRevisionNotes(e.target.value)}
                                          placeholder="Provide detailed feedback for the editor..."
                                          rows={4}
                                          className="mt-2"
                                        />
                                      </div>
                                      <div className="flex gap-4">
                                        <Button
                                          onClick={() => handleSendBackForFixes(selectedVideo.id)}
                                          disabled={!revisionNotes.trim()}
                                          variant="outline"
                                          className="flex-1"
                                        >
                                          <Send className="mr-2 h-4 w-4" />
                                          Send Back to {selectedVideo.editedBy}
                                        </Button>
                                        <Button
                                          onClick={() => handleApprove(selectedVideo.id)}
                                          className="flex-1 bg-green-600 hover:bg-green-700"
                                        >
                                          <CheckCircle className="mr-2 h-4 w-4" />
                                          Approve Video
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}

                                {/* Previous Revision Notes */}
                                {selectedVideo.revisionNotes && (
                                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                    <h4 className="font-medium text-orange-800 mb-2">Previous Revision Notes:</h4>
                                    <p className="text-sm text-orange-700">{selectedVideo.revisionNotes}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="queue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Review Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {videos
                    .filter((v) => v.status === "pending_review")
                    .map((video) => (
                      <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{video.title}</h3>
                          <p className="text-sm text-gray-600">
                            {video.clientName} • {video.setName} • Edited by {video.editedBy}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Submitted: {video.submittedAt.toLocaleString()}</p>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedVideo(video)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Review Now
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{video.title}</DialogTitle>
                            </DialogHeader>
                            {selectedVideo && (
                              <VideoPlayer
                                videoUrl={selectedVideo.videoUrl}
                                videoTitle={selectedVideo.title}
                                comments={selectedVideo.comments}
                                onAddComment={(timestamp, content) =>
                                  handleAddComment(selectedVideo.id, timestamp, content)
                                }
                                onReply={(commentId, content) => handleReply(selectedVideo.id, commentId, content)}
                                onApprove={() => handleApprove(selectedVideo.id)}
                                onRequestChanges={() => handleSendBackForFixes(selectedVideo.id)}
                                canModerate={true}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revisions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Videos with Revision Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {videos.map((video) => (
                    <div key={video.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{video.title}</h3>
                          <p className="text-sm text-gray-600">
                            {video.clientName} • {video.setName} • Edited by {video.editedBy}
                          </p>
                        </div>
                        <Badge className={getStatusColor(video.status)}>{video.status.replace("_", " ")}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Submitted:</span> {video.submittedAt.toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Comments:</span> {video.comments.length}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> {video.status.replace("_", " ")}
                        </div>
                      </div>

                      {video.revisionNotes && (
                        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded">
                          <h5 className="font-medium text-orange-800 mb-1">Revision Notes:</h5>
                          <p className="text-sm text-orange-700">{video.revisionNotes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Comments & Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {videos.flatMap((video) =>
                    video.comments.map((comment) => (
                      <div key={comment.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{video.title}</span>
                            <Badge variant="outline">
                              {Math.floor(comment.timestamp / 60)}:
                              {(comment.timestamp % 60).toString().padStart(2, "0")}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">{comment.createdAt.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>by {comment.author}</span>
                          <span>•</span>
                          <span>
                            {video.clientName} - {video.setName}
                          </span>
                        </div>

                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-3 ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="text-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{reply.author}</span>
                                  <span className="text-xs text-gray-500">{reply.createdAt.toLocaleString()}</span>
                                </div>
                                <p className="text-gray-700">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
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
                          defaultValue="Reviewer User"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <input
                          id="email"
                          type="email"
                          defaultValue="reviewer@example.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Review Preferences</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="notifications">Email Notifications</Label>
                        <select
                          id="notifications"
                          defaultValue="immediate"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="immediate">Immediate</option>
                          <option value="daily">Daily Digest</option>
                          <option value="weekly">Weekly Summary</option>
                          <option value="none">None</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="autoplay">Auto-play Videos</Label>
                        <select
                          id="autoplay"
                          defaultValue="enabled"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="enabled">Enabled</option>
                          <option value="disabled">Disabled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      alert("Settings saved successfully!")
                    }}
                  >
                    Save Changes
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
