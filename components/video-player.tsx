"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Volume2, VolumeX, MessageCircle, CheckCircle, XCircle, Reply } from "lucide-react"

interface Comment {
  id: string
  timestamp: number
  author: string
  content: string
  createdAt: Date
  replies?: Comment[]
}

interface VideoPlayerProps {
  videoUrl: string
  videoTitle: string
  comments?: Comment[]
  onAddComment?: (timestamp: number, content: string) => void
  onReply?: (commentId: string, content: string) => void
  onApprove?: () => void
  onRequestChanges?: () => void
  canModerate?: boolean
}

export function VideoPlayer({
  videoUrl,
  videoTitle,
  comments = [],
  onAddComment,
  onReply,
  onApprove,
  onRequestChanges,
  canModerate = false,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const seekTo = (time: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = time
    setCurrentTime(time)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const newTime = (clickX / width) * duration
    seekTo(newTime)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const addComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(Math.floor(currentTime), newComment.trim())
      setNewComment("")
    }
  }

  const addReply = (commentId: string) => {
    if (replyContent.trim() && onReply) {
      onReply(commentId, replyContent.trim())
      setReplyContent("")
      setReplyingTo(null)
    }
  }

  const jumpToTimestamp = (timestamp: number) => {
    seekTo(timestamp)
  }

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <Card>
        <CardHeader>
          <CardTitle>{videoTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Video Element */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full aspect-video"
                src={videoUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-600 rounded-full cursor-pointer mb-3" onClick={handleProgressClick}>
                  <div
                    className="h-full bg-blue-500 rounded-full relative"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={togglePlay} className="text-white hover:bg-white/20">
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>

                    <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:bg-white/20">
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>

                    <span className="text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {canModerate && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={onRequestChanges}
                        className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Request Changes
                      </Button>
                      <Button size="sm" onClick={onApprove} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Add Comment */}
            {onAddComment && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Add Comment at {formatTime(currentTime)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add your comment about this timestamp..."
                    rows={3}
                  />
                  <Button onClick={addComment} disabled={!newComment.trim()}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Add Comment
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      {comments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comments
                .sort((a, b) => a.timestamp - b.timestamp)
                .map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-50"
                          onClick={() => jumpToTimestamp(comment.timestamp)}
                        >
                          {formatTime(comment.timestamp)}
                        </Badge>
                        <span className="font-medium">{comment.author}</span>
                      </div>
                      <span className="text-xs text-gray-500">{comment.createdAt.toLocaleString()}</span>
                    </div>

                    <p className="text-gray-700 mb-3">{comment.content}</p>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => jumpToTimestamp(comment.timestamp)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Jump to {formatTime(comment.timestamp)}
                      </Button>

                      {onReply && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyingTo(comment.id)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Reply className="mr-1 h-3 w-3" />
                          Reply
                        </Button>
                      )}
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <div className="mt-3 ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
                        <Textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write your reply..."
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => addReply(comment.id)} disabled={!replyContent.trim()}>
                            Reply
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setReplyingTo(null)
                              setReplyContent("")
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3 ml-4 space-y-3 border-l-2 border-gray-200 pl-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="bg-gray-50 rounded p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{reply.author}</span>
                              <span className="text-xs text-gray-500">{reply.createdAt.toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-gray-700">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
