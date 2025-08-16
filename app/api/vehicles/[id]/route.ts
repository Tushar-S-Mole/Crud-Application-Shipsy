import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Vehicle from "@/models/Vehicle"

// GET - Fetch single vehicle
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const vehicle = await Vehicle.findById(params.id).lean()

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error("GET /api/vehicles/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update vehicle
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const body = await request.json()

    // Recalculate estimated fuel cost if distance or efficiency changed
    const routeDistance = Math.floor(Math.random() * 500) + 100 // Mock distance calculation
    const estimatedFuelCost = (routeDistance / body.fuelEfficiency) * 5.5

    const vehicleData = {
      ...body,
      estimatedFuelCost,
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(params.id, vehicleData, {
      new: true,
      runValidators: true,
    }).lean()

    if (!updatedVehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    return NextResponse.json(updatedVehicle)
  } catch (error) {
    console.error("PUT /api/vehicles/[id] error:", error)
    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete vehicle
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const deletedVehicle = await Vehicle.findByIdAndDelete(params.id)

    if (!deletedVehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Vehicle deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/vehicles/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
