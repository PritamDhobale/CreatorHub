"use client"

import React, { useState } from "react"
import { useAuth, type UserRole } from "@/lib/auth-context"
import "./login.css"

export default function LoginPage() {
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("admin")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const ok = await login(email, password, role)
      if (!ok) setError("Invalid credentials. Please try again.")
    } catch {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Top brand bar (same structure as AccountHub) */}
      <div className="logo-wrapper">
        <img src="/images/sage_healthy_rcm_logo.png" alt="Brand Logo" className="mysage-logo" />
      </div>

      {/* Main login card */}
      <div className="login-box">
        <img src="/images/creatorhub.png" alt="App Logo" className="login-logo-img" />

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* Email */}
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          {/* Password */}
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {/* Role (new row, kept visible) */}
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="role-select"
            required
          >
            <option value="admin">Admin</option>
            <option value="ideator">Ideator</option>
            <option value="filmer">Filmer</option>
            <option value="editor">Editor</option>
            <option value="revisions">Revisions</option>
            <option value="poster">Poster</option>
          </select>

          {/* Error */}
          {error && <p className="error-message">{error}</p>}

          {/* Submit */}
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "LOG IN"}
          </button>
        </form>
      </div>

      {/* Footer (same as AccountHub layout) */}
      <div className="powered-by-text">POWERED BY HUBONE SYSTEMS</div>
      <p className="footer-text">© 2014–2026 HubOne Systems Inc. – All Rights Reserved</p>
    </div>
  )
}


// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useAuth, type UserRole } from "@/lib/auth-context"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Video } from "lucide-react"

// export default function LoginPage() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [role, setRole] = useState<UserRole>("admin")
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState("")

//   const { login } = useAuth()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError("")

//     try {
//       const success = await login(email, password, role)
//       if (!success) {
//         setError("Invalid credentials. Use 'password' as password.")
//       }
//     } catch (err) {
//       setError("Login failed. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <Card className="w-full max-w-md">
//         <CardHeader className="text-center">
//           <div className="flex justify-center mb-4">
//             <Video className="h-12 w-12 text-blue-600" />
//           </div>
//           <CardTitle className="text-2xl font-bold">Video Workflow Platform</CardTitle>
//           <CardDescription>Sign in to your account</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 required
//               />
//             </div>

//             <div>
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter password (use 'password')"
//                 required
//               />
//             </div>

//             <div>
//               <Label htmlFor="role">Role</Label>
//               <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="admin">Admin</SelectItem>
//                   <SelectItem value="ideator">Ideator</SelectItem>
//                   <SelectItem value="filmer">Filmer</SelectItem>
//                   <SelectItem value="editor">Editor</SelectItem>
//                   <SelectItem value="revisions">Revisions</SelectItem>
//                   <SelectItem value="poster">Poster</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {error && <div className="text-red-600 text-sm text-center">{error}</div>}

//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? "Signing in..." : "Sign in"}
//             </Button>
//           </form>

//           <div className="mt-6 text-center text-sm text-gray-600">
//             <p>Demo credentials:</p>
//             <p>Email: any@email.com</p>
//             <p>Password: password</p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
