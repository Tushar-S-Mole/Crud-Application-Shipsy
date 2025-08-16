"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Truck, Calculator, Save, X } from "lucide-react"

interface Vehicle {
  id: string
  vehicleName: string
  driverName: string
  conductorName: string
  vehicleType: string
  source: string
  destination: string
  capacity: number
  fuelEfficiency: number
  isActive: boolean
  status: string
  registrationDate: string
  estimatedFuelCost: number
}

interface VehicleEditDialogProps {
  vehicle: Vehicle | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedVehicle: Vehicle) => void
}

export function VehicleEditDialog({ vehicle, isOpen, onClose, onSave }: VehicleEditDialogProps) {
  const [formData, setFormData] = useState<Vehicle | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (vehicle) {
      setFormData({ ...vehicle })
    }
  }, [vehicle])

  const calculateEstimatedFuelCost = (): number => {
    if (!formData) return 0

    const routeDistances: { [key: string]: number } = {
      "Mumbai-Delhi": 1400,
      "Delhi-Kolkata": 1500,
      "Chennai-Bangalore": 350,
      "Pune-Mumbai": 150,
      "Hyderabad-Chennai": 630,
    }

    const route = `${formData.source}-${formData.destination}`
    const reverseRoute = `${formData.destination}-${formData.source}`
    const distance = routeDistances[route] || routeDistances[reverseRoute] || 500

    if (formData.fuelEfficiency > 0) {
      const fuelNeeded = distance / formData.fuelEfficiency
      const fuelCostPerLiter = 100
      return Math.round(fuelNeeded * fuelCostPerLiter)
    }
    return 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setIsLoading(true)
    setError("")

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
      const updatedVehicle = {
        ...formData,
        estimatedFuelCost: calculateEstimatedFuelCost(),
      }

      onSave(updatedVehicle)
      onClose()
    } catch (err) {
      setError("Failed to update vehicle. Please try again.")
    }

    setIsLoading(false)
  }

  if (!formData) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-sans flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            Edit Vehicle: {formData.vehicleName}
          </DialogTitle>
          <DialogDescription className="font-serif">Update vehicle information and route details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-vehicleName" className="font-serif">
                Vehicle Name *
              </Label>
              <Input
                id="edit-vehicleName"
                value={formData.vehicleName}
                onChange={(e) => setFormData({ ...formData, vehicleName: e.target.value })}
                placeholder="e.g., TN-01-AB-1234"
                className="font-serif"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-vehicleType" className="font-serif">
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
                  <SelectItem value="mini-truck">Mini Truck</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="trailer">Trailer</SelectItem>
                  <SelectItem value="container">Container</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Driver Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-driverName" className="font-serif">
                Driver Name *
              </Label>
              <Input
                id="edit-driverName"
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                placeholder="Enter driver's full name"
                className="font-serif"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-conductorName" className="font-serif">
                Conductor Name
              </Label>
              <Input
                id="edit-conductorName"
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
              <Label htmlFor="edit-source" className="font-serif">
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
              <Label htmlFor="edit-destination" className="font-serif">
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
              <Label htmlFor="edit-capacity" className="font-serif">
                Capacity (tons)
              </Label>
              <Input
                id="edit-capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                placeholder="Enter vehicle capacity"
                className="font-serif"
                min="0"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-fuelEfficiency" className="font-serif">
                Fuel Efficiency (km/l)
              </Label>
              <Input
                id="edit-fuelEfficiency"
                type="number"
                value={formData.fuelEfficiency}
                onChange={(e) => setFormData({ ...formData, fuelEfficiency: Number(e.target.value) })}
                placeholder="Enter fuel efficiency"
                className="font-serif"
                min="0"
                step="0.1"
              />
            </div>
          </div>

          {/* Status and Active State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-status" className="font-serif">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="font-serif">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="out-of-service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
              />
              <Label htmlFor="edit-isActive" className="font-serif">
                Vehicle is active
              </Label>
            </div>
          </div>

          {/* Calculated Field Display */}
          {formData.source && formData.destination && formData.fuelEfficiency > 0 && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-serif flex items-center">
                  <Calculator className="h-4 w-4 mr-2" />
                  Updated Calculated Information
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

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
