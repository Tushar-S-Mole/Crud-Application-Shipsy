"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Calculator } from "lucide-react"

interface VehicleData {
  vehicleName: string
  driverName: string
  conductorName: string
  vehicleType: string
  source: string
  destination: string
  fuelEfficiency: number
  isActive: boolean
  status: string
}

export function VehicleRegistrationForm() {
  const [formData, setFormData] = useState<VehicleData>({
    vehicleName: "",
    driverName: "",
    conductorName: "",
    vehicleType: "",
    source: "",
    destination: "",
    fuelEfficiency: 0,
    isActive: true,
    status: "active",
  })

  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const calculateEstimatedFuelCost = (): number => {
    // Simple distance calculation based on route (mock data for demo)
    const routeDistances: { [key: string]: number } = {
      "Mumbai-Delhi": 1400,
      "Delhi-Kolkata": 1500,
      "Chennai-Bangalore": 350,
      "Pune-Mumbai": 150,
      "Hyderabad-Chennai": 630,
    }

    const route = `${formData.source}-${formData.destination}`
    const reverseRoute = `${formData.destination}-${formData.source}`
    const distance = routeDistances[route] || routeDistances[reverseRoute] || 500 // default 500km

    if (formData.fuelEfficiency > 0) {
      const fuelNeeded = distance / formData.fuelEfficiency
      const fuelCostPerLiter = 100 // ₹100 per liter (mock price)
      return Math.round(fuelNeeded * fuelCostPerLiter)
    }
    return 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (
      !formData.vehicleName ||
      !formData.driverName ||
      !formData.vehicleType ||
      !formData.source ||
      !formData.destination
    ) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to register vehicle")
      }

      const newVehicle = await response.json()
      setSuccess("Vehicle registered successfully!")

      // Reset form
      setFormData({
        vehicleName: "",
        driverName: "",
        conductorName: "",
        vehicleType: "",
        source: "",
        destination: "",
        fuelEfficiency: 0,
        isActive: true,
        status: "active",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register vehicle. Please try again.")
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Vehicle Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleName" className="font-serif">
            Vehicle Name *
          </Label>
          <Input
            id="vehicleName"
            value={formData.vehicleName}
            onChange={(e) => setFormData({ ...formData, vehicleName: e.target.value })}
            placeholder="e.g., TN-01-AB-1234"
            className="font-serif"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleType" className="font-serif">
            Vehicle Type *
          </Label>
          <Select
            value={formData.vehicleType}
            onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
          >
            <SelectTrigger className="font-serif">
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="truck">Truck</SelectItem>
              <SelectItem value="van">Van</SelectItem>
              <SelectItem value="trailer">Trailer</SelectItem>
              <SelectItem value="pickup">Pickup</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Driver Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="driverName" className="font-serif">
            Driver Name *
          </Label>
          <Input
            id="driverName"
            value={formData.driverName}
            onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
            placeholder="Enter driver's full name"
            className="font-serif"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="conductorName" className="font-serif">
            Conductor Name
          </Label>
          <Input
            id="conductorName"
            value={formData.conductorName}
            onChange={(e) => setFormData({ ...formData, conductorName: e.target.value })}
            placeholder="Enter conductor's name (optional)"
            className="font-serif"
          />
        </div>
      </div>

      {/* Route Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="source" className="font-serif">
            Source *
          </Label>
          <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
            <SelectTrigger className="font-serif">
              <SelectValue placeholder="Select source city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mumbai">Mumbai</SelectItem>
              <SelectItem value="Delhi">Delhi</SelectItem>
              <SelectItem value="Bangalore">Bangalore</SelectItem>
              <SelectItem value="Chennai">Chennai</SelectItem>
              <SelectItem value="Kolkata">Kolkata</SelectItem>
              <SelectItem value="Pune">Pune</SelectItem>
              <SelectItem value="Hyderabad">Hyderabad</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination" className="font-serif">
            Destination *
          </Label>
          <Select
            value={formData.destination}
            onValueChange={(value) => setFormData({ ...formData, destination: value })}
          >
            <SelectTrigger className="font-serif">
              <SelectValue placeholder="Select destination city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mumbai">Mumbai</SelectItem>
              <SelectItem value="Delhi">Delhi</SelectItem>
              <SelectItem value="Bangalore">Bangalore</SelectItem>
              <SelectItem value="Chennai">Chennai</SelectItem>
              <SelectItem value="Kolkata">Kolkata</SelectItem>
              <SelectItem value="Pune">Pune</SelectItem>
              <SelectItem value="Hyderabad">Hyderabad</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Vehicle Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fuelEfficiency" className="font-serif">
            Fuel Efficiency (km/l) *
          </Label>
          <Input
            id="fuelEfficiency"
            type="number"
            value={formData.fuelEfficiency}
            onChange={(e) => setFormData({ ...formData, fuelEfficiency: Number(e.target.value) })}
            placeholder="Enter fuel efficiency"
            className="font-serif"
            min="1"
            step="0.1"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="font-serif">
            Status
          </Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger className="font-serif">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active State */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
        />
        <Label htmlFor="isActive" className="font-serif">
          Vehicle is active
        </Label>
      </div>

      {/* Calculated Field Display */}
      {formData.source && formData.destination && formData.fuelEfficiency > 0 && (
        <Card className="bg-muted/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-serif flex items-center">
              <Calculator className="h-4 w-4 mr-2" />
              Calculated Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm font-serif">
              <p>
                <strong>Route:</strong> {formData.source} → {formData.destination}
              </p>
              <p>
                <strong>Estimated Fuel Cost:</strong> ₹{calculateEstimatedFuelCost().toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="font-serif">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertDescription className="font-serif">{success}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full font-sans" disabled={isLoading}>
        <Truck className="w-4 h-4 mr-2" />
        {isLoading ? "Registering..." : "Register Vehicle"}
      </Button>
    </form>
  )
}
