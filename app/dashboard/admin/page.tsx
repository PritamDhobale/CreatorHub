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
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Calendar, Users, Video, Settings, Home, UserPlus } from "lucide-react"

interface Ideator {
  id: string
  name: string
  email: string
  assignedClients: string[]
}

interface Client {
  id: string
  name: string
  status: "active" | "inactive"
  assignedIdeators: string[]
  upcomingShoots: number
  description?: string
}

interface Shoot {
  id: string
  clientId: string
  clientName: string
  date: string
  description: string
  assignedIdeators: string[]
}

export default function AdminDashboard() {
  const [ideators] = useState<Ideator[]>([
    { id: "1", name: "John Doe", email: "john@example.com", assignedClients: ["1"] },
    { id: "2", name: "Jane Smith", email: "jane@example.com", assignedClients: ["1"] },
    { id: "3", name: "Mike Johnson", email: "mike@example.com", assignedClients: ["2"] },
    { id: "4", name: "Sarah Wilson", email: "sarah@example.com", assignedClients: [] },
  ])

  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Client A",
      status: "active",
      assignedIdeators: ["1", "2"],
      upcomingShoots: 2,
      description: "Tech startup video content",
    },
    {
      id: "2",
      name: "Client B",
      status: "active",
      assignedIdeators: ["3"],
      upcomingShoots: 1,
      description: "E-commerce product videos",
    },
  ])

  const [shoots, setShoots] = useState<Shoot[]>([
    {
      id: "1",
      clientId: "1",
      clientName: "Client A",
      date: "2024-01-15",
      description: "Product launch video shoot",
      assignedIdeators: ["1"],
    },
  ])

  const [newClient, setNewClient] = useState({
    name: "",
    description: "",
    assignedIdeators: [] as string[],
  })
  const [newShoot, setNewShoot] = useState({
    clientId: "",
    date: "",
    description: "",
    assignedIdeators: [] as string[],
  })

  const [activeTab, setActiveTab] = useState("dashboard")

  const handleAddClient = () => {
    if (newClient.name.trim()) {
      const client: Client = {
        id: Date.now().toString(),
        name: newClient.name,
        status: "active",
        assignedIdeators: newClient.assignedIdeators,
        upcomingShoots: 0,
        description: newClient.description,
      }
      setClients([...clients, client])

      // Notify assigned ideators (in production, this would send actual notifications)
      console.log(`Notifying ideators: ${newClient.assignedIdeators.join(", ")} about new client: ${newClient.name}`)

      setNewClient({ name: "", description: "", assignedIdeators: [] })
    }
  }

  const handleScheduleShoot = () => {
    if (newShoot.clientId && newShoot.date && newShoot.description) {
      const client = clients.find((c) => c.id === newShoot.clientId)
      const shoot: Shoot = {
        id: Date.now().toString(),
        clientId: newShoot.clientId,
        clientName: client?.name || "",
        date: newShoot.date,
        description: newShoot.description,
        assignedIdeators: newShoot.assignedIdeators,
      }
      setShoots([...shoots, shoot])
      setNewShoot({ clientId: "", date: "", description: "", assignedIdeators: [] })
    }
  }

  const updateClientIdeators = (clientId: string, ideatorIds: string[]) => {
    setClients(clients.map((client) => (client.id === clientId ? { ...client, assignedIdeators: ideatorIds } : client)))
  }

  const getIdeatorName = (id: string) => {
    return ideators.find((ideator) => ideator.id === id)?.name || "Unknown"
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
          variant={activeTab === "clients" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("clients")}
        >
          <Users className="mr-2 h-4 w-4" />
          Clients
        </Button>
        <Button
          variant={activeTab === "shoots" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("shoots")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Shoots
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
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout title="Admin Dashboard" sidebar={sidebar}>
        <div className="space-y-6">
          {activeTab === "dashboard" && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="cursor-pointer" onClick={() => setActiveTab("clients")}>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-blue-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Clients</p>
                        <p className="text-2xl font-bold">{clients.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer" onClick={() => setActiveTab("shoots")}>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Calendar className="h-8 w-8 text-green-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Upcoming Shoots</p>
                        <p className="text-2xl font-bold">{shoots.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Video className="h-8 w-8 text-purple-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active Projects</p>
                        <p className="text-2xl font-bold">12</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <UserPlus className="h-8 w-8 text-orange-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Team Members</p>
                        <p className="text-2xl font-bold">{ideators.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Client
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Client</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="clientName">Client Name</Label>
                        <Input
                          id="clientName"
                          value={newClient.name}
                          onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                          placeholder="Enter client name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientDescription">Description</Label>
                        <Textarea
                          id="clientDescription"
                          value={newClient.description}
                          onChange={(e) => setNewClient({ ...newClient, description: e.target.value })}
                          placeholder="Client description"
                        />
                      </div>
                      <div>
                        <Label>Assign Ideators</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {ideators.map((ideator) => (
                            <div key={ideator.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`ideator-${ideator.id}`}
                                checked={newClient.assignedIdeators.includes(ideator.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNewClient({
                                      ...newClient,
                                      assignedIdeators: [...newClient.assignedIdeators, ideator.id],
                                    })
                                  } else {
                                    setNewClient({
                                      ...newClient,
                                      assignedIdeators: newClient.assignedIdeators.filter((id) => id !== ideator.id),
                                    })
                                  }
                                }}
                              />
                              <Label htmlFor={`ideator-${ideator.id}`} className="text-sm">
                                {ideator.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button onClick={handleAddClient} className="w-full">
                        Add Client & Notify Ideators
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Shoot
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule New Shoot</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="shootClient">Client</Label>
                        <Select
                          value={newShoot.clientId}
                          onValueChange={(value) => setNewShoot({ ...newShoot, clientId: value })}
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
                        <Label htmlFor="shootDate">Date</Label>
                        <Input
                          id="shootDate"
                          type="date"
                          value={newShoot.date}
                          onChange={(e) => setNewShoot({ ...newShoot, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="shootDescription">Description</Label>
                        <Textarea
                          id="shootDescription"
                          value={newShoot.description}
                          onChange={(e) => setNewShoot({ ...newShoot, description: e.target.value })}
                          placeholder="Shoot description"
                        />
                      </div>
                      <Button onClick={handleScheduleShoot} className="w-full">
                        Schedule Shoot
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </>
          )}

          {activeTab === "clients" && (
            <Card>
              <CardHeader>
                <CardTitle>Client Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.map((client) => (
                    <div key={client.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{client.name}</h3>
                          <p className="text-sm text-gray-600">{client.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={client.status === "active" ? "default" : "secondary"}>
                              {client.status}
                            </Badge>
                            <span className="text-sm text-gray-600">{client.upcomingShoots} upcoming shoots</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Assigned Ideators:</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {ideators.map((ideator) => (
                              <div key={ideator.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`client-${client.id}-ideator-${ideator.id}`}
                                  checked={client.assignedIdeators.includes(ideator.id)}
                                  onCheckedChange={(checked) => {
                                    const newIdeators = checked
                                      ? [...client.assignedIdeators, ideator.id]
                                      : client.assignedIdeators.filter((id) => id !== ideator.id)
                                    updateClientIdeators(client.id, newIdeators)
                                  }}
                                />
                                <Label htmlFor={`client-${client.id}-ideator-${ideator.id}`} className="text-sm">
                                  {ideator.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-1 flex-wrap">
                          {client.assignedIdeators.map((ideatorId) => (
                            <Badge key={ideatorId} variant="outline" className="text-xs">
                              {getIdeatorName(ideatorId)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "shoots" && (
            <Card>
              <CardHeader>
                <CardTitle>All Scheduled Shoots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shoots.map((shoot) => (
                    <div key={shoot.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{shoot.clientName}</h3>
                        <p className="text-sm text-gray-600">{shoot.description}</p>
                        <p className="text-sm text-gray-500 mt-1">Date: {new Date(shoot.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Assigned to:</p>
                        <div className="flex gap-1 mt-1">
                          {shoot.assignedIdeators.map((ideatorId) => (
                            <Badge key={ideatorId} variant="outline" className="text-xs">
                              {getIdeatorName(ideatorId)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
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
                        <Input id="name" defaultValue="Admin User" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="admin@example.com" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                    </div>
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
