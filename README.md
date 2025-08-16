### Tushar S. Mole 2022BCS0097
# Vehicle Management System

A comprehensive web application for managing vehicles at logistics companies.

| <img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/25167572-d1ab-4bb0-a1eb-87eb6778064f" />| <img width="1918" height="915" alt="image" src="https://github.com/user-attachments/assets/22a4d5ce-8dbc-4cb0-b006-2d22fd25b855" />|
|-------------------------|-------------------------|
| <img width="1890" height="761" alt="image" src="https://github.com/user-attachments/assets/9ea933af-e0ef-42d4-8f72-c4fbb531e53c" />| <img width="1910" height="900" alt="image" src="https://github.com/user-attachments/assets/99dc145e-5d84-4f81-8ac3-9ffde803749e" />



## Login Password

```
Username: admin
```
```
Password : admin123
```

## 🚛 Project Overview

This Vehicle Management System allows logistics managers to efficiently track and manage their fleet of trucks. The application provides a complete dashboard for vehicle registration, monitoring, and management with real-time statistics and comprehensive CRUD operations.

## ✨ Features

### Core Functionality
- **Admin Authentication**: Secure login system for fleet managers
- **Vehicle Registration**: Complete vehicle onboarding with driver and conductor details
- **Fleet Dashboard**: Real-time overview of all vehicles with key metrics
- **CRUD Operations**: Full Create, Read, Update, Delete functionality for vehicles
- **Advanced Filtering**: Search, filter, and paginate through vehicle records

## AI Tools Used

Chat GPT , Gemini CLI
<img width="1668" height="537" alt="image" src="https://github.com/user-attachments/assets/ad1736e4-69b3-4c4e-a23d-2d87262a1f1d" />
<img width="1599" height="500" alt="image" src="https://github.com/user-attachments/assets/328dd12d-0090-4bc9-bdcd-1b25667f64e9" />


### Assignment Requirements Fulfilled
- ✅ **Authentication System**: Username/password login with session management
- ✅ **CRUD Operations**: Complete vehicle management with all required field types:
  - **Text Fields**: Vehicle name, driver name, conductor name, source, destination
  - **Enum Fields**: Vehicle type (Truck, Van, Bus, etc.) and status (Active, Maintenance, etc.)
  - **Boolean Field**: Active/inactive status toggle
  - **Calculated Field**: Estimated fuel cost based on route distance and fuel efficiency
- ✅ **Listing & Data Management**: 
  - Pagination (10 vehicles per page)
  - Search functionality across all vehicle fields
  - Filter by vehicle type and status
  - Sorting capabilities
- ✅ **Professional UI**: Clean, responsive design with modern aesthetics

## 🛠 Technology Stack

### Frontend
- **React Js**: React framework with App Router
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Modern component library
- **Lucide React**: Icon library

### Backend

- **MongoDB**: NoSQL database for vehicle data
- **Mongoose**: MongoDB object modeling

### Deployment
- **Vercel**: Hosting and deployment platform
- **MongoDB Atlas**: Cloud database service

## 🚀 Getting Started



### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd vehicle-management-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`


4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`


## 📊 Database Schema

### Vehicle Collection

```javascript
{
  _id: ObjectId,
  vehicleName: String (required),
  vehicleType: String (enum: ['Truck', 'Van', 'Bus', 'Trailer']),
  driverName: String (required),
  conductorName: String (required),
  source: String (required),
  destination: String (required),
  status: String (enum: ['Active', 'Maintenance', 'Out of Service']),
  isActive: Boolean (default: true),
  routeDistance: Number (calculated),
  fuelEfficiency: Number,
  estimatedFuelCost: Number (calculated field),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

## 🔌 API Endpoints

### Vehicles
- `GET /api/vehicles` - Get all vehicles with pagination and filtering
- `POST /api/vehicles` - Create a new vehicle
- `GET /api/vehicles/[id]` - Get specific vehicle details
- `PUT /api/vehicles/[id]` - Update vehicle information
- `DELETE /api/vehicles/[id]` - Delete a vehicle

### Statistics
- `GET /api/vehicles/stats` - Get fleet statistics and metrics

### Query Parameters
- `page`: Page number for pagination
- `limit`: Items per page (default: 10)
- `search`: Search across vehicle fields
- `type`: Filter by vehicle type
- `status`: Filter by vehicle status







### Deployment Steps
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with automatic builds on push

## 👨‍💻 Developer

Built by Tushar 


---
