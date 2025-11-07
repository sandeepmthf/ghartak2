import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Star, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface Vendor {
  id: string;
  name: string;
  image: string;
  rating: number;
  distance: string;
  category: string;
  tags: string[];
  description?: string;
}

interface VendorCardProps {
  vendor: Vendor;
  onViewShop: (vendorId: string) => void;
}

export default function VendorCard({ vendor, onViewShop }: VendorCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div onClick={() => onViewShop(vendor.id)}>
        <div className="relative h-48 overflow-hidden">
          <ImageWithFallback 
            src={vendor.image} 
            alt={vendor.name}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-gray-900 mb-1">{vendor.name}</h3>
              <p className="text-gray-500">{vendor.category}</p>
            </div>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
              <Star className="w-4 h-4 text-green-600 fill-green-600" />
              <span className="text-green-600">{vendor.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-gray-500 mb-3">
            <MapPin className="w-4 h-4" />
            <span>{vendor.distance}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {vendor.tags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">
                {tag}
              </Badge>
            ))}
          </div>

          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onViewShop(vendor.id);
            }}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            View Shop
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
