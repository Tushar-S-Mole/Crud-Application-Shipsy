import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Vehicle from "@/models/Vehicle"

// GET - Fetch vehicle statistics
export async function GET() {
  try {
    await dbConnect()

    // Get total vehicles count
    const totalVehicles = await Vehicle.countDocuments()

    // Get active vehicles count
    const activeVehicles = await Vehicle.countDocuments({ isActive: true })

    // Get vehicles in transit
    const inTransitVehicles = await Vehicle.countDocuments({ status: "in-transit" })

    // Get vehicles registered today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayRegistrations = await Vehicle.countDocuments({
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    })

    // Get vehicles by status
    const statusBreakdown = await Vehicle.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    const statusCounts = statusBreakdown.reduce((acc: any, item: any) => {
      acc[item._id] = item.count
      return acc
    }, {})

    return NextResponse.json({
      totalVehicles,
      activeVehicles,
      inTransitVehicles,
      todayRegistrations,
      statusBreakdown: statusCounts,
      currentDate: new Date().toLocaleDateString(),
    })
  } catch (error) {
    console.error("GET /api/vehicles/stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
