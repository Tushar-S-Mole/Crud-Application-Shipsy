"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VehicleEditDialog } from "@/components/vehicle-edit-dialog"
import { Truck, Edit, Trash2, Search, Filter } from "lucide-react"

interface Vehicle {
  _id: string
  vehicleName: string
  driverName: string
  conductorName: string
  vehicleType: string
  source: string
  destination: string
  fuelEfficiency: number
  isActive: boolean
  status: string
  createdAt: string
  estimatedFuelCost: number
}

export function VehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalVehicles, setTotalVehicles] = useState(0)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const itemsPerPage = 6

  const fetchVehicles = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
        status: statusFilter === "all" ? "" : statusFilter,
        sortBy: "createdAt",
        sortOrder: "desc",
      })

      const response = await fetch(`/api/vehicles?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles")
      }

      const data = await response.json()
      setVehicles(data.vehicles)
      setTotalPages(data.totalPages)
      setTotalVehicles(data.total)
    } catch (error) {
      console.error("Error fetching vehicles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [currentPage, searchTerm, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "in-transit":
        return "bg-blue-100 text-blue-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete vehicle")
      }

      // Refresh the vehicle list
      fetchVehicles()
    } catch (error) {
      console.error("Error deleting vehicle:", error)
    }
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async (updatedVehicle: Vehicle) => {
    try {
      const response = await fetch(`/api/vehicles/${updatedVehicle._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedVehicle),
      })

      if (!response.ok) {
        throw new Error("Failed to update vehicle")
      }

      // Refresh the vehicle list
      fetchVehicles()
      setEditingVehicle(null)
    } catch (error) {
      console.error("Error updating vehicle:", error)
    }
  }

  const handleCloseEdit = () => {
    setIsEditDialogOpen(false)
    setEditingVehicle(null)
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search vehicles, drivers, or routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 font-serif"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 font-serif">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="in-transit">In Transit</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
           
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="text-muted-foreground font-serif">Loading vehicles...</div>
        </div>
      )}

      {/* Vehicle Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-sans flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-primary" />
                    {vehicle.vehicleName}
                  </CardTitle>
                  <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
                </div>
                <CardDescription className="font-serif">{vehicle.vehicleType}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="text-sm font-serif space-y-1">
                  <p>
                    <strong>Driver:</strong> {vehicle.driverName}
                  </p>
                  {vehicle.conductorName && (
                    <p>
                      <strong>Conductor:</strong> {vehicle.conductorName}
                    </p>
                  )}
                  <p>
                    <strong>Route:</strong> {vehicle.source} → {vehicle.destination}
                  </p>
                  <p>
                    <strong>Fuel Efficiency:</strong> {vehicle.fuelEfficiency} km/l
                  </p>
                  <p>
                    <strong>Est. Fuel Cost:</strong> ₹{vehicle.estimatedFuelCost?.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${vehicle.isActive ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-xs text-muted-foreground font-serif">
                      {vehicle.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(vehicle)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(vehicle._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>

          <span className="text-sm text-muted-foreground font-serif">
            Page {currentPage} of {totalPages} ({totalVehicles} vehicles)
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      )}

      {!isLoading && vehicles.length === 0 && (
        <div className="text-center py-12">
          <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground font-sans mb-2">No vehicles found</h3>
          <p className="text-muted-foreground font-serif">
            {totalVehicles === 0
              ? "Start by registering your first vehicle."
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <VehicleEditDialog
        vehicle={editingVehicle}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />
    </div>
  )
}
