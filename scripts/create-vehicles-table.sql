-- Create vehicles table for the vehicle management system
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_name VARCHAR(255) NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL CHECK (vehicle_type IN ('truck', 'van', 'pickup', 'trailer')),
  driver_name VARCHAR(255) NOT NULL,
  conductor_name VARCHAR(255),
  source VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive', 'in_transit')),
  is_active BOOLEAN DEFAULT true,
  fuel_efficiency DECIMAL(5,2) DEFAULT 10.0,
  route_distance DECIMAL(8,2) DEFAULT 0.0,
  estimated_fuel_cost DECIMAL(10,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on vehicle_name for faster searches
CREATE INDEX IF NOT EXISTS idx_vehicles_name ON vehicles(vehicle_name);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);

-- Create an index on created_at for date-based queries
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON vehicles(created_at);
