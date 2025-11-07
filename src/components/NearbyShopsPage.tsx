import { useState, useEffect } from "react";
import { MapPin, Navigation, Store, Star, Phone, Clock, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import LocationDeniedScreen from "./LocationDeniedScreen";

interface Shop {
  id: number;
  name: string;
  lat: number;
  lon: number;
  type: string;
  address?: string;
  phone?: string;
  opening_hours?: string;
  distance?: number;
}

type PageState = "initial" | "loading" | "success" | "error" | "denied";

export default function NearbyShopsPage() {
  const [pageState, setPageState] = useState<PageState>("initial");
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const getShopCategory = (shopType: string): string => {
    const categoryMap: Record<string, string> = {
      supermarket: "Supermarket",
      convenience: "Convenience Store",
      greengrocer: "Fruits & Vegetables",
      bakery: "Bakery",
      butcher: "Butcher",
      grocery: "Grocery",
      general: "General Store",
    };
    return categoryMap[shopType] || "Shop";
  };

  const getShopEmoji = (shopType: string): string => {
    const emojiMap: Record<string, string> = {
      supermarket: "🏪",
      convenience: "🏬",
      greengrocer: "🥬",
      bakery: "🥖",
      butcher: "🥩",
      grocery: "🛒",
      general: "🏪",
    };
    return emojiMap[shopType] || "🏪";
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchNearbyShops = async (lat: number, lon: number) => {
    try {
      const radius = 5000; // 5km radius
      const query = `
        [out:json][timeout:25];
        (
          node["shop"](around:${radius},${lat},${lon});
          way["shop"](around:${radius},${lat},${lon});
        );
        out center;
      `;

      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch shop data");
      }

      const data = await response.json();
      
      const shopData: Shop[] = data.elements
        .filter((element: any) => element.tags?.name) // Only shops with names
        .map((element: any) => {
          const shopLat = element.lat || element.center?.lat;
          const shopLon = element.lon || element.center?.lon;
          const distance = calculateDistance(lat, lon, shopLat, shopLon);

          return {
            id: element.id,
            name: element.tags.name || "Unnamed Shop",
            lat: shopLat,
            lon: shopLon,
            type: element.tags.shop || "general",
            address: element.tags["addr:street"] 
              ? `${element.tags["addr:street"]}${element.tags["addr:housenumber"] ? " " + element.tags["addr:housenumber"] : ""}`
              : undefined,
            phone: element.tags.phone,
            opening_hours: element.tags.opening_hours,
            distance: distance,
          };
        })
        .filter((shop: Shop) => shop.distance && shop.distance <= 5) // Within 5km
        .sort((a: Shop, b: Shop) => (a.distance || 0) - (b.distance || 0))
        .slice(0, 50); // Limit to 50 shops

      setShops(shopData);
      setPageState("success");
    } catch (error) {
      console.error("Error fetching shops:", error);
      setErrorMessage("Failed to load nearby shops. Please try again.");
      setPageState("error");
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser");
      setPageState("error");
      return;
    }

    setPageState("loading");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lon: longitude });
        fetchNearbyShops(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error code:", error.code);
        console.error("Geolocation error message:", error.message);
        
        if (error.code === 1) { // PERMISSION_DENIED
          setErrorMessage("Location access denied. Please enable location permissions in your browser settings.");
          setPageState("denied");
        } else if (error.code === 2) { // POSITION_UNAVAILABLE
          setErrorMessage("Location information is unavailable. Please check your device's location settings.");
          setPageState("error");
        } else if (error.code === 3) { // TIMEOUT
          setErrorMessage("Location request timed out. Please try again.");
          setPageState("error");
        } else {
          setErrorMessage("Unable to retrieve your location. Please ensure location services are enabled and try again.");
          setPageState("error");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Initial State - Hero Section
  if (pageState === "initial") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Hero Content */}
            <div className="mb-12 animate-fade-in">
              <div className="inline-block mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-full">
                    <MapPin className="h-16 w-16 text-white" />
                  </div>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-gray-900">
                Find Shops Near You
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Allow location access to discover local grocery and vegetable vendors around you.
              </p>

              <Button
                size="lg"
                onClick={handleUseLocation}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <Navigation className="h-6 w-6 mr-3" />
                Use My Current Location
              </Button>

              <p className="text-sm text-gray-500 mt-4">
                We'll use your location to find the closest shops
              </p>
            </div>

            {/* Illustration */}
            <div className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto opacity-50">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gradient-to-br from-green-100 to-orange-100 rounded-lg"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animation: "float 3s ease-in-out infinite",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
        `}</style>
      </div>
    );
  }

  // Loading State
  if (pageState === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 border-8 border-green-100 rounded-full"></div>
            <div className="absolute inset-0 w-32 h-32 border-8 border-green-600 rounded-full border-t-transparent animate-spin"></div>
            <MapPin className="absolute inset-0 m-auto h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl md:text-3xl mb-3 text-gray-900">
            Detecting your location…
          </h2>
          <p className="text-gray-600 mb-2">Please allow access to your device's location.</p>
          <p className="text-sm text-gray-500">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  // Location Denied State - Use Beautiful Custom Screen
  if (pageState === "denied") {
    return (
      <LocationDeniedScreen 
        onRetry={handleUseLocation}
        onContinueWithout={() => setPageState("initial")}
      />
    );
  }

  // Error State (non-permission errors)
  if (pageState === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-block p-6 bg-red-100 rounded-full mb-4">
                <AlertCircle className="h-16 w-16 text-red-600" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
              Oops! Something went wrong
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {errorMessage}
            </p>
            <Button
              size="lg"
              onClick={handleUseLocation}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full"
            >
              <Navigation className="h-5 w-5 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success State - Show Shops
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl mb-2">Shops Near You</h1>
              <p className="text-green-100">
                Found {shops.length} shops within 5 km
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleUseLocation}
              className="bg-white text-green-600 hover:bg-green-50 border-none"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Update Location
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {shops.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl mb-2">No shops found nearby</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your location or check back later
              </p>
              <Button onClick={handleUseLocation} variant="outline">
                Try Different Location
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map Section */}
            <div className="order-2 lg:order-1">
              <Card className="sticky top-4 overflow-hidden">
                <div className="h-[600px] bg-gradient-to-br from-green-100 to-blue-100 relative">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                      userLocation!.lon - 0.05
                    }%2C${userLocation!.lat - 0.05}%2C${
                      userLocation!.lon + 0.05
                    }%2C${userLocation!.lat + 0.05}&layer=mapnik&marker=${
                      userLocation!.lat
                    }%2C${userLocation!.lon}`}
                    style={{ border: 0 }}
                  ></iframe>
                  <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md text-sm">
                    <MapPin className="inline h-4 w-4 text-green-600 mr-1" />
                    Your Location
                  </div>
                </div>
              </Card>
            </div>

            {/* Shop List Section */}
            <div className="order-1 lg:order-2 space-y-4 max-h-[600px] overflow-y-auto">
              {shops.map((shop) => (
                <Card
                  key={shop.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedShop?.id === shop.id
                      ? "border-2 border-green-600 shadow-xl"
                      : "border-2 border-transparent"
                  }`}
                  onClick={() => setSelectedShop(shop)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-2xl">
                          {getShopEmoji(shop.type)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                            {shop.name}
                          </h3>
                          <Badge className="bg-orange-100 text-orange-700 border-orange-200 flex-shrink-0">
                            {shop.distance?.toFixed(1)} km
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Store className="h-4 w-4 flex-shrink-0" />
                            <span>{getShopCategory(shop.type)}</span>
                          </div>

                          {shop.address && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              <span className="line-clamp-1">{shop.address}</span>
                            </div>
                          )}

                          {shop.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-4 w-4 flex-shrink-0" />
                              <span>{shop.phone}</span>
                            </div>
                          )}

                          {shop.opening_hours && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4 flex-shrink-0" />
                              <span className="line-clamp-1">{shop.opening_hours}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-gray-600">
                              {(4.0 + Math.random()).toFixed(1)}/5
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(
                                `https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lon}`,
                                "_blank"
                              );
                            }}
                          >
                            Get Directions
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Navigate to vendor detail page
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-green-500" />
            <p className="text-lg">From your local market… to your doorstep — GharTak.</p>
          </div>
          <p className="text-gray-400 text-sm">
            Powered by OpenStreetMap • Real-time location data
          </p>
        </div>
      </footer>
    </div>
  );
}
