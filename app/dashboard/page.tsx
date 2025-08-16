"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VehicleRegistrationForm } from "@/components/vehicle-registration-form"
import { VehicleList } from "@/components/vehicle-list"
import { Truck, Plus, LogOut, BarChart3, Calendar } from "lucide-react"

interface VehicleStats {
  totalVehicles: number
  activeVehicles: number
  inTransitVehicles: number
  todayRegistrations: number
  statusBreakdown: Record<string, number>
  currentDate: string
}

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState<VehicleStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    const user = localStorage.getItem("username")

    if (!auth || auth !== "true") {
      router.push("/")
      return
    }

    setIsAuthenticated(true)
    setUsername(user || "Admin")
  }, [router])

  const fetchStats = async () => {
    setIsLoadingStats(true)
    try {
      const response = await fetch("/api/vehicles/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && activeTab === "overview") {
      fetchStats()
    }
  }, [isAuthenticated, activeTab])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("username")
    router.push("/")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Truck className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground font-sans">Vehicle Management System</h1>
                
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground font-serif">Welcome, {username}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 border-b-2 font-medium text-sm font-serif ${
                activeTab === "overview"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
               Overview
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`py-4 px-1 border-b-2 font-medium text-sm font-serif ${
                activeTab === "register"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <Plus className="h-4 w-4 inline mr-2" />
              Register Vehicle
            </button>
            <button
              onClick={() => setActiveTab("vehicles")}
              className={`py-4 px-1 border-b-2 font-medium text-sm font-serif ${
                activeTab === "vehicles"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <Truck className="h-4 w-4 inline mr-2" />
              All Vehicles
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-sans">Dashboard Overview</h2>
              <div className="flex items-center text-sm text-muted-foreground font-serif">
                <Calendar className="h-4 w-4 mr-2" />
                {stats?.currentDate || new Date().toLocaleDateString()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-serif">Total Vehicles</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-sans">
                    {isLoadingStats ? "..." : stats?.totalVehicles || 0}
                  </div>
                  <p className="text-xs text-muted-foreground font-serif">Registered in system</p>
                </CardContent>
              </Card> */}

              {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-serif">Active Vehicles</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-sans">
                    {isLoadingStats ? "..." : stats?.activeVehicles || 0}
                  </div>
                  <p className="text-xs text-muted-foreground font-serif">Currently operational</p>
                </CardContent>
              </Card> */}

              {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-serif">In Transit</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-sans">
                    {isLoadingStats ? "..." : stats?.inTransitVehicles || 0}
                  </div>
                  <p className="text-xs text-muted-foreground font-serif">On active routes</p>
                </CardContent>
              </Card> */}

              {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-serif">Today's Registrations</CardTitle>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-sans">
                    {isLoadingStats ? "..." : stats?.todayRegistrations || 0}
                  </div>
                  <p className="text-xs text-muted-foreground font-serif">Registered today</p>
                </CardContent>
              </Card> */}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans">Quick Actions</CardTitle>
                  <CardDescription className="font-serif">Common tasks for vehicle management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={() => setActiveTab("register")} className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Register New Vehicle
                  </Button>
                  <Button onClick={() => setActiveTab("vehicles")} variant="outline" className="w-full justify-start">
                    <Truck className="h-4 w-4 mr-2" />
                    View All Vehicles
                  </Button>
                </CardContent>
              </Card>

              {/* <Card>
                <CardHeader>
                  <CardTitle className="font-sans">Status Breakdown</CardTitle>
                  <CardDescription className="font-serif">Vehicle distribution by status</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingStats ? (
                    <div className="text-sm text-muted-foreground">Loading...</div>
                  ) : (
                    <div className="space-y-2">
                      {stats?.statusBreakdown &&
                        Object.entries(stats.statusBreakdown).map(([status, count]) => (
                          <div key={status} className="flex justify-between items-center text-sm font-serif">
                            <span className="capitalize">{status}:</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card> */}
            </div>
          </div>
        )}

        {activeTab === "register" && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Register New Vehicle</CardTitle>
                <CardDescription className="font-serif">
                  Add a new vehicle to your fleet management system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VehicleRegistrationForm />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "vehicles" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-sans">All Vehicles</h2>
              <Button onClick={() => setActiveTab("register")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </div>
            <VehicleList />
          </div>
        )}
      </main>
    </div>
  )
}
