import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Vehicle from "@/models/Vehicle"

// GET - Fetch all vehicles with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const skip = (page - 1) * limit

    const query: any = {}

    if (search) {
      query.$or = [
        { vehicleName: { $regex: search, $options: "i" } },
        { driverName: { $regex: search, $options: "i" } },
        { source: { $regex: search, $options: "i" } },
        { destination: { $regex: search, $options: "i" } },
      ]
    }

    if (status) {
      query.status = status
    }

    const [vehicles, total] = await Promise.all([
      Vehicle.find(query)
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Vehicle.countDocuments(query),
    ])

    return NextResponse.json({
      vehicles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("GET /api/vehicles error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create a new vehicle
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()

    const routeDistance = Math.floor(Math.random() * 500) + 100 // Mock distance calculation
    const estimatedFuelCost = (routeDistance / body.fuelEfficiency) * 5.5 // Assuming $5.5 per gallon

    const vehicleData = {
      ...body,
      estimatedFuelCost,
    }

    const vehicle = new Vehicle(vehicleData)
    const savedVehicle = await vehicle.save()

    return NextResponse.json(savedVehicle, { status: 201 })
  } catch (error) {
    console.error("POST /api/vehicles error:", error)
    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
