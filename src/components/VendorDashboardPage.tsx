import { useState } from "react";
import { ArrowLeft, Store } from "lucide-react";
import { Button } from "./ui/button";
import { VendorInsights } from "./VendorInsights";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { mockVendors } from "../data/mockData";

interface VendorDashboardPageProps {
  onNavigate: (page: string) => void;
  initialVendorId?: string;
}

export default function VendorDashboardPage({ 
  onNavigate,
  initialVendorId
}: VendorDashboardPageProps) {
  const [selectedVendorId, setSelectedVendorId] = useState(
    initialVendorId || mockVendors[0].id
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("home")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-2 flex-1">
              <Store className="h-6 w-6 text-green-600" />
              <h1 className="text-2xl">Vendor Insights Dashboard</h1>
            </div>

            <Select value={selectedVendorId} onValueChange={setSelectedVendorId}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                {mockVendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <VendorInsights vendorId={selectedVendorId} />
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-2">
            📊 Understanding Your Dashboard
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Top Selling Products:</strong> Shows which products are most popular with customers
            </p>
            <p>
              <strong>Restock Suggestions:</strong> Products that haven't been ordered recently but were previously popular
            </p>
            <p>
              <strong>Demand Predictions:</strong> AI-powered forecast of expected sales for the next 7 days based on historical data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
