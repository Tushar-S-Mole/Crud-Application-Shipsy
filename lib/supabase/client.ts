import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Vehicle = {
  id: string
  vehicle_name: string
  vehicle_type: "truck" | "van" | "pickup" | "trailer"
  driver_name: string
  conductor_name?: string
  source: string
  destination: string
  status: "active" | "maintenance" | "inactive" | "in_transit"
  is_active: boolean
  fuel_efficiency: number
  route_distance: number
  estimated_fuel_cost: number
  created_at: string
  updated_at: string
}
