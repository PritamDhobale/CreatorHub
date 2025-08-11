"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Calendar,
  Folder,
  FolderOpen,
  Clock,
  MapPin,
  Video,
  ChevronDown,
  ChevronRight,
  Home,
  Settings,
  Eye,
  FileText,
} from "lucide-react"

interface VideoSlot {
  id: string
  number: number
  status: "pending" | "filmed" | "edited" | "approved" | "posted"
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
  description: string
  days: Day[]
  isExpanded: boolean
}

export default function IdeatorDashboard() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Client A",
      description: "Tech startup video content",
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
              description: "Outdoor beach scene with product showcase",
              startTime: "09:00",
              location: "Santa Monica Beach",
              props: ["Surfboard", "Beach umbrella", "Cooler"],
              actors: ["Actor 1", "Actor 2"],
              videos: [
                { id: "1", number: 1, status: "pending" },
                { id: "2", number: 2, status: "filmed" },
                { id: "3", number: 3, status: "edited" },
              ],
            },
          ],
        },
      ],
    },
  ])

  const [newDay, setNewDay] = useState({ clientId: "", name: "", date: "" })
  const [newSet, setNewSet] = useState({
    dayId: "",
    name: "",
    type: "",
    description: "",
    startTime: "",
    location: "",
    props: "",
    actors: "",
    videoCount: 3,
  })

  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedProject, setSelectedProject] = useState<Client | null>(null)

  const setTypes = [
    "beach",
    "house",
    "indoor",
    "hospital",
    "office",
    "restaurant",
    "park",
    "studio",
    "street",
    "car",
    "other",
  ]

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

  const handleAddDay = () => {
    if (newDay.clientId && newDay.name && newDay.date) {
      const day: Day = {
        id: Date.now().toString(),
        name: newDay.name,
        date: newDay.date,
        sets: [],
        isExpanded: true,
      }

      setClients(
        clients.map((client) => (client.id === newDay.clientId ? { ...client, days: [...client.days, day] } : client)),
      )

      setNewDay({ clientId: "", name: "", date: "" })
    }
  }

  const handleAddSet = () => {
    if (newSet.dayId && newSet.name && newSet.type) {
      const videos: VideoSlot[] = Array.from({ length: newSet.videoCount }, (_, i) => ({
        id: `${Date.now()}-${i}`,
        number: i + 1,
        status: "pending" as const,
      }))

      // Auto-generate set name with number
      const dayClient = clients.find((c) => c.days.some((d) => d.id === newSet.dayId))
      const day = dayClient?.days.find((d) => d.id === newSet.dayId)
      const setNumber = (day?.sets.length || 0) + 1
      const autoName = newSet.name || `Set ${setNumber}`

      const set: Set = {
        id: Date.now().toString(),
        name: autoName,
        type: newSet.type,
        description: newSet.description,
        startTime: newSet.startTime,
        location: newSet.location,
        props: newSet.props
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
        actors: newSet.actors
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        videos,
      }

      setClients(
        clients.map((client) => ({
          ...client,
          days: client.days.map((day) => (day.id === newSet.dayId ? { ...day, sets: [...day.sets, set] } : day)),
        })),
      )

      setNewSet({
        dayId: "",
        name: "",
        type: "",
        description: "",
        startTime: "",
        location: "",
        props: "",
        actors: "",
        videoCount: 3,
      })
    }
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
          variant={activeTab === "projects" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("projects")}
        >
          <Folder className="mr-2 h-4 w-4" />
          Projects
        </Button>
        <Button
          variant={activeTab === "workflow" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("workflow")}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Workflow
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
    <ProtectedRoute requiredRole="ideator">
      <DashboardLayout title="Ideator Dashboard" sidebar={sidebar}>
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Day
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Day</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="dayClient">Client</Label>
                      <Select
                        value={newDay.clientId}
                        onValueChange={(value) => setNewDay({ ...newDay, clientId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
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
                      <Label htmlFor="dayName">Day Name</Label>
                      <Input
                        id="dayName"
                        value={newDay.name}
                        onChange={(e) => setNewDay({ ...newDay, name: e.target.value })}
                        placeholder="e.g., Day 1, Day 2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dayDate">Date</Label>
                      <Input
                        id="dayDate"
                        type="date"
                        value={newDay.date}
                        onChange={(e) => setNewDay({ ...newDay, date: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleAddDay} className="w-full">
                      Add Day
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Set
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Set</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="setDay">Day</Label>
                      <Select value={newSet.dayId} onValueChange={(value) => setNewSet({ ...newSet, dayId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.flatMap((client) =>
                            client.days.map((day) => (
                              <SelectItem key={day.id} value={day.id}>
                                {client.name} - {day.name}
                              </SelectItem>
                            )),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="setName">Set Name (auto-generated if empty)</Label>
                        <Input
                          id="setName"
                          value={newSet.name}
                          onChange={(e) => setNewSet({ ...newSet, name: e.target.value })}
                          placeholder="e.g., Beach Scene (optional)"
                        />
                      </div>
                      <div>
                        <Label htmlFor="setType">Set Type</Label>
                        <Select value={newSet.type} onValueChange={(value) => setNewSet({ ...newSet, type: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {setTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="setDescription">Set Description</Label>
                      <Textarea
                        id="setDescription"
                        value={newSet.description}
                        onChange={(e) => setNewSet({ ...newSet, description: e.target.value })}
                        placeholder="Describe the set and what will be filmed"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={newSet.startTime}
                          onChange={(e) => setNewSet({ ...newSet, startTime: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="videoCount">Number of Videos</Label>
                        <Input
                          id="videoCount"
                          type="number"
                          min="1"
                          max="10"
                          value={newSet.videoCount}
                          onChange={(e) => setNewSet({ ...newSet, videoCount: Number.parseInt(e.target.value) || 3 })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newSet.location}
                        onChange={(e) => setNewSet({ ...newSet, location: e.target.value })}
                        placeholder="Starting location"
                      />
                    </div>

                    <div>
                      <Label htmlFor="props">Props Required</Label>
                      <Textarea
                        id="props"
                        value={newSet.props}
                        onChange={(e) => setNewSet({ ...newSet, props: e.target.value })}
                        placeholder="Comma-separated list of props"
                      />
                    </div>

                    <div>
                      <Label htmlFor="actors">Actors Required</Label>
                      <Textarea
                        id="actors"
                        value={newSet.actors}
                        onChange={(e) => setNewSet({ ...newSet, actors: e.target.value })}
                        placeholder="Comma-separated list of actors"
                      />
                    </div>

                    <Button onClick={handleAddSet} className="w-full">
                      Add Set
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Clients and Projects */}
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
                      <Badge variant="outline" className="ml-2">
                        {client.description}
                      </Badge>
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
                                        <div className="flex items-center gap-2">
                                          <Video className="h-4 w-4 text-purple-500" />
                                          <span className="font-medium">
                                            Set {setIndex + 1} - {set.name}
                                          </span>
                                          <Badge variant="secondary">{set.type}</Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                          <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {set.startTime}
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {set.location}
                                          </div>
                                        </div>
                                      </div>

                                      {set.description && (
                                        <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
                                          <FileText className="h-3 w-3 inline mr-1" />
                                          {set.description}
                                        </div>
                                      )}

                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                          <p className="text-sm font-medium text-gray-700 mb-1">Props:</p>
                                          <div className="flex flex-wrap gap-1">
                                            {set.props.map((prop, index) => (
                                              <Badge key={index} variant="outline" className="text-xs">
                                                {prop}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-700 mb-1">Actors:</p>
                                          <div className="flex flex-wrap gap-1">
                                            {set.actors.map((actor, index) => (
                                              <Badge key={index} variant="outline" className="text-xs">
                                                {actor}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-700 mb-1">Videos:</p>
                                          <div className="flex flex-wrap gap-1">
                                            {set.videos.map((video) => (
                                              <Badge
                                                key={video.id}
                                                className={`text-xs ${getStatusColor(video.status)}`}
                                              >
                                                Video {video.number}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {set.videos.map((video) => (
                                          <div key={video.id} className="p-2 border rounded text-center">
                                            <Video className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                                            <p className="text-xs font-medium">Video {video.number}</p>
                                            <Badge className={`text-xs mt-1 ${getStatusColor(video.status)}`}>
                                              {video.status}
                                            </Badge>
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
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clients.map((client) => (
                    <Card
                      key={client.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedProject(client)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{client.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{client.description}</p>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-lg font-bold text-blue-600">{client.days.length}</p>
                            <p className="text-xs text-gray-600">Days</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-green-600">
                              {client.days.reduce((acc, day) => acc + day.sets.length, 0)}
                            </p>
                            <p className="text-xs text-gray-600">Sets</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-purple-600">
                              {client.days.reduce(
                                (acc, day) => acc + day.sets.reduce((setAcc, set) => setAcc + set.videos.length, 0),
                                0,
                              )}
                            </p>
                            <p className="text-xs text-gray-600">Videos</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Details Modal */}
            {selectedProject && (
              <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{selectedProject.name} - Project Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-gray-600">{selectedProject.description}</p>

                    <div className="space-y-4">
                      {selectedProject.days.map((day) => (
                        <Card key={day.id}>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Calendar className="h-5 w-5" />
                              {day.name} - {new Date(day.date).toLocaleDateString()}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {day.sets.map((set, setIndex) => (
                                <div key={set.id} className="border rounded p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium">
                                      Set {setIndex + 1} - {set.name}
                                    </h4>
                                    <Badge variant="secondary">{set.type}</Badge>
                                  </div>
                                  {set.description && <p className="text-sm text-gray-600 mb-2">{set.description}</p>}
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Time:</span> {set.startTime}
                                    </div>
                                    <div>
                                      <span className="font-medium">Location:</span> {set.location}
                                    </div>
                                    <div>
                                      <span className="font-medium">Videos:</span> {set.videos.length}
                                    </div>
                                    <div>
                                      <span className="font-medium">Status:</span>
                                      <div className="flex gap-1 mt-1">
                                        {set.videos.map((video) => (
                                          <Badge key={video.id} className={`text-xs ${getStatusColor(video.status)}`}>
                                            {video.number}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}

        {activeTab === "workflow" && (
          <Card>
            <CardHeader>
              <CardTitle>Complete Workflow Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800">Planning</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {clients.reduce(
                        (acc, client) => acc + client.days.reduce((dayAcc, day) => dayAcc + day.sets.length, 0),
                        0,
                      )}
                    </p>
                    <p className="text-xs text-blue-600">Sets planned</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800">Filming</h4>
                    <p className="text-2xl font-bold text-green-600">
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
                    <p className="text-xs text-green-600">Videos filmed</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-800">Editing</h4>
                    <p className="text-2xl font-bold text-yellow-600">
                      {clients.reduce(
                        (acc, client) =>
                          acc +
                          client.days.reduce(
                            (dayAcc, day) =>
                              dayAcc +
                              day.sets.reduce(
                                (setAcc, set) => setAcc + set.videos.filter((v) => v.status === "edited").length,
                                0,
                              ),
                            0,
                          ),
                        0,
                      )}
                    </p>
                    <p className="text-xs text-yellow-600">In editing</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-800">Review</h4>
                    <p className="text-2xl font-bold text-orange-600">
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
                    <p className="text-xs text-orange-600">Under review</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-800">Posted</h4>
                    <p className="text-2xl font-bold text-purple-600">
                      {clients.reduce(
                        (acc, client) =>
                          acc +
                          client.days.reduce(
                            (dayAcc, day) =>
                              dayAcc +
                              day.sets.reduce(
                                (setAcc, set) => setAcc + set.videos.filter((v) => v.status === "posted").length,
                                0,
                              ),
                            0,
                          ),
                        0,
                      )}
                    </p>
                    <p className="text-xs text-purple-600">Published</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Full Workflow Tracking</h3>
                  {clients.map((client) => (
                    <Card key={client.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{client.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {client.days.map((day) => (
                          <div key={day.id} className="mb-4">
                            <h4 className="font-medium mb-2">
                              {day.name} - {new Date(day.date).toLocaleDateString()}
                            </h4>
                            <div className="space-y-2">
                              {day.sets.map((set, setIndex) => (
                                <div key={set.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm">
                                    Set {setIndex + 1} - {set.name}
                                  </span>
                                  <div className="flex gap-1">
                                    {set.videos.map((video) => (
                                      <Badge key={video.id} className={`text-xs ${getStatusColor(video.status)}`}>
                                        {video.number}: {video.status}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
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
                      <Input id="name" defaultValue="Ideator User" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="ideator@example.com" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="est">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="est">Eastern Time (EST)</SelectItem>
                          <SelectItem value="cst">Central Time (CST)</SelectItem>
                          <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                          <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}
