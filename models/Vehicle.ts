import mongoose from "mongoose"

export interface IVehicle {
  _id?: string
  vehicleName: string
  driverName: string
  conductorName: string
  vehicleType: "truck" | "van" | "trailer" | "pickup"
  source: string
  destination: string
  status: "active" | "maintenance" | "inactive" | "in-transit"
  isActive: boolean
  fuelEfficiency: number
  estimatedFuelCost: number
  createdAt: Date
  updatedAt: Date
}

const VehicleSchema = new mongoose.Schema<IVehicle>(
  {
    vehicleName: {
      type: String,
      required: [true, "Vehicle name is required"],
      trim: true,
    },
    driverName: {
      type: String,
      required: [true, "Driver name is required"],
      trim: true,
    },
    conductorName: {
      type: String,
      required: [true, "Conductor name is required"],
      trim: true,
    },
    vehicleType: {
      type: String,
      required: [true, "Vehicle type is required"],
      enum: ["truck", "van", "trailer", "pickup"],
    },
    source: {
      type: String,
      required: [true, "Source is required"],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["active", "maintenance", "inactive", "in-transit"],
      default: "active",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    fuelEfficiency: {
      type: Number,
      required: [true, "Fuel efficiency is required"],
      min: [1, "Fuel efficiency must be at least 1 km/l"],
    },
    estimatedFuelCost: {
      type: Number,
      required: [true, "Estimated fuel cost is required"],
      min: [0, "Estimated fuel cost cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
)

// Create indexes for better query performance
VehicleSchema.index({ vehicleName: 1 })
VehicleSchema.index({ status: 1 })
VehicleSchema.index({ createdAt: -1 })

export default mongoose.models.Vehicle || mongoose.model<IVehicle>("Vehicle", VehicleSchema)
