"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Truck } from "lucide-react"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (username === "admin" && password === "admin123") {
      // Store auth state in localStorage for demo
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("username", username)
      router.push("/dashboard")
    } else {
      setError("Invalid credentials. Use admin/admin123")
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="font-serif">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
          className="font-serif"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="font-serif">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          className="font-serif"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="font-serif">{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full font-sans" disabled={isLoading}>
        <Truck className="w-4 h-4 mr-2" />
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="text-sm text-muted-foreground text-center font-serif">Demo  credentials: admin / admin123</div>
    </form>
  )
}
