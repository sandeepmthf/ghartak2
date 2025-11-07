import { useState } from 'react';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockVendors } from '../data/mockData';

interface VendorsPageProps {
  onNavigate: (page: string) => void;
}

export default function VendorsPage({ onNavigate }: VendorsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Vegetables', 'Grocery', 'Fruits', 'Dairy'];

  const filteredVendors = mockVendors.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vendor.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2 text-gray-900">Nearby Vendors</h1>
          <p className="text-gray-600">Discover local shops in your area</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="Search by vendor or product" 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Vendor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <Card 
              key={vendor.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onNavigate(`vendor-${vendor.id}`)}
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={vendor.image} 
                  alt={vendor.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-gray-900 mb-1">{vendor.name}</h3>
                    <p className="text-sm text-gray-600">{vendor.category}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                    <Star className="w-4 h-4 fill-green-600 text-green-600" />
                    <span className="text-sm">{vendor.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span>{vendor.distance}</span>
                  <span>•</span>
                  <span>{vendor.deliveryTime}</span>
                  <span>•</span>
                  <span>₹{vendor.minOrder} min</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {vendor.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button 
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 hover:shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(`vendor-${vendor.id}`);
                  }}
                >
                  View Shop
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredVendors.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl mb-2 text-gray-900">No vendors found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
