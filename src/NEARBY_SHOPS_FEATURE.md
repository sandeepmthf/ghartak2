# 📍 Nearby Shops Feature - Technical Documentation

## Overview
The **Nearby Shops** feature allows GharTak users to discover real, local grocery stores and vegetable vendors within a 5 km radius using live geolocation and OpenStreetMap data via the Overpass API.

---

## 🎯 Features

### 1. **Real-Time Location Detection**
- Uses browser's Geolocation API
- High-accuracy position detection
- Permission handling and error states

### 2. **Live Shop Data**
- Fetches actual shops from OpenStreetMap
- Searches within 5 km radius
- Filters for shops with names only
- Limits to top 50 closest shops

### 3. **Interactive UI States**
The page has 5 distinct states:

#### **Initial State**
- Hero section with location illustration
- "Use My Current Location" CTA button
- Animated background elements
- Brand-consistent green/orange gradient

#### **Loading State**
- Animated radar/GPS detection effect
- Pulsing location icon
- "Detecting your location..." message
- User guidance text

#### **Success State**
- Two-panel layout (map + shop list)
- Embedded OpenStreetMap view
- Scrollable shop cards with details
- Real-time distance calculations

#### **Error State**
- Friendly error message
- Retry button
- Troubleshooting tips
- Orange/red gradient background

#### **Denied State**
- Special handling for permission denial
- Browser settings guidance
- Prominent retry option
- Help alert with tips

---

## 🛠️ Technical Implementation

### API Integration

**Overpass API Query:**
```javascript
const query = `
  [out:json][timeout:25];
  (
    node["shop"](around:5000,${lat},${lon});
    way["shop"](around:5000,${lat},${lon});
  );
  out center;
`;
```

**Endpoint:**
```
https://overpass-api.de/api/interpreter?data=[query]
```

### Shop Data Structure
```typescript
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
```

### Shop Categories
The system categorizes shops from OpenStreetMap tags:
- **Supermarket** 🏪
- **Convenience Store** 🏬
- **Fruits & Vegetables** 🥬
- **Bakery** 🥖
- **Butcher** 🥩
- **Grocery** 🛒
- **General Store** 🏪

---

## 🎨 Design System

### Colors
- **Primary:** Green (#00A86B / `green-600`)
- **Accent:** Orange (#FF8C42 / `orange-600`)
- **Background:** Off-white (#F9F9F9 / `gray-50`)
- **Error:** Red (`red-600`)

### Typography
- Headlines: 4xl - 6xl
- Body: lg - xl
- Helper text: sm - base
- Font: System default (Poppins/Inter-like)

### Components Used
- **shadcn/ui**: Button, Card, Badge, Alert
- **lucide-react**: Navigation, MapPin, Store, Phone, Clock, etc.

### Responsive Behavior
- **Mobile**: Map below shop list, single column
- **Desktop**: Side-by-side layout, sticky map
- **Tablet**: Optimized two-column grid

---

## 📊 Distance Calculation

Uses the **Haversine formula** for accurate Earth-surface distance:

```javascript
const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
```

---

## 🗺️ Map Integration

### OpenStreetMap Embed
```html
<iframe
  src="https://www.openstreetmap.org/export/embed.html?
    bbox={lon-0.05},{lat-0.05},{lon+0.05},{lat+0.05}
    &layer=mapnik
    &marker={lat},{lon}"
/>
```

### Features:
- Auto-centers on user location
- Shows user position marker
- Interactive pan/zoom
- 0.1° bounding box (approx 11km × 11km)

---

## 🔄 User Flow

```
1. User lands on page
   ↓
2. Clicks "Use My Current Location"
   ↓
3. Browser requests permission
   ↓
4a. Permission GRANTED          4b. Permission DENIED
   ↓                                ↓
5. Loading state shown           Error state shown
   ↓                                ↓
6. Fetch location coords         Retry button
   ↓
7. Call Overpass API
   ↓
8. Calculate distances
   ↓
9. Sort & filter shops
   ↓
10. Display map + shop list
```

---

## 📱 Shop Card Features

Each shop card displays:
- **Shop emoji** (category-based)
- **Shop name** (from OSM data)
- **Distance badge** (calculated in km)
- **Category** (e.g., "Grocery", "Bakery")
- **Address** (if available)
- **Phone number** (if available)
- **Opening hours** (if available)
- **Rating** (mock 4.0-5.0, placeholder for future)
- **Get Directions** button (opens Google Maps)
- **View Details** button (future integration)

### Interactive States:
- **Hover**: Shadow elevation
- **Selected**: Green border highlight
- **Click**: Selects on map

---

## 🚀 Performance Optimizations

1. **Limit Results**: Max 50 shops
2. **Distance Filter**: Only shops within 5 km
3. **Named Shops Only**: Filters out unnamed entries
4. **Lazy Loading**: Map iframe loads on demand
5. **Sticky Map**: Reduces scroll jumps on desktop

---

## 🔐 Privacy & Permissions

### Geolocation API Settings:
```javascript
{
  enableHighAccuracy: true,  // Use GPS if available
  timeout: 10000,            // 10 second timeout
  maximumAge: 0              // No cached positions
}
```

### Error Handling:
- `PERMISSION_DENIED` → Special denied state
- `POSITION_UNAVAILABLE` → Generic error state
- `TIMEOUT` → Generic error state

### User Data:
- Location never stored
- No tracking or analytics
- Real-time API calls only
- No server-side persistence

---

## 🌐 Navigation Integration

### Access Points:
1. **Navbar**: "Nearby Shops" link
2. **Homepage Hero**: "Find Shops Near Me" button
3. **Homepage Banner**: Orange feature spotlight section

### Route:
```
currentPage === 'nearby-shops'
```

---

## 🧪 Testing Scenarios

### ✅ Success Cases:
- User grants location permission
- Multiple shops found nearby
- Shop has complete data (name, address, phone)
- Distance calculation accurate

### ⚠️ Edge Cases:
- No shops found in area
- User denies permission
- Location timeout
- Network error during API call
- Incomplete shop data (missing address/phone)

### 🌍 Test Locations:
**Urban Areas (many results):**
- Delhi: 28.6139, 77.2090
- Mumbai: 19.0760, 72.8777
- Ghaziabad: 28.6692, 77.4538

**Rural Areas (fewer results):**
- Smaller towns/villages
- Remote locations

---

## 🔮 Future Enhancements

### Planned Features:
1. **Advanced Filtering**
   - Filter by shop type
   - Filter by rating
   - Filter by open now

2. **Map Markers**
   - Custom shop pins on map
   - Click marker to view shop details
   - Cluster markers when zoomed out

3. **Real Integration**
   - Link to existing vendor profiles
   - Show actual product availability
   - Enable direct ordering

4. **Saved Locations**
   - Remember favorite locations
   - Quick access to home/work
   - Location history

5. **Reviews & Ratings**
   - User-submitted reviews
   - Photos of shops
   - Verified badges

6. **Advanced Map**
   - Full Leaflet.js implementation
   - Custom markers and popups
   - Directions overlay
   - Street view integration

---

## 🐛 Known Limitations

1. **Data Quality**: Depends on OpenStreetMap completeness
2. **Map Markers**: Currently shows only user location
3. **Offline**: Requires internet connection
4. **Browser Support**: Requires geolocation API support
5. **Mobile Data**: Map embedding may use data

---

## 📚 Dependencies

### External APIs:
- **Overpass API**: OpenStreetMap data queries
- **OpenStreetMap**: Map embedding
- **Geolocation API**: Browser location access

### Libraries:
- React (state management)
- lucide-react (icons)
- shadcn/ui (components)
- Tailwind CSS (styling)

### No Installation Required:
All APIs are public and free to use.

---

## 🆘 Troubleshooting

### Issue: "Permission Denied"
**Solution**: 
- Check browser location settings
- Ensure HTTPS connection
- Try different browser

### Issue: "No Shops Found"
**Solution**:
- Verify location is accurate
- Try rural vs urban area
- Check Overpass API status

### Issue: "Map Not Loading"
**Solution**:
- Check internet connection
- Disable ad blockers
- Try different network

### Issue: "Timeout Error"
**Solution**:
- Ensure GPS is enabled
- Move to open area (better GPS signal)
- Check device location settings

---

## 📖 User Guide

### For Customers:

1. **Navigate** to "Nearby Shops" from main menu
2. **Click** "Use My Current Location"
3. **Allow** location access when prompted
4. **Browse** list of nearby shops
5. **Click** shop card for more details
6. **Get Directions** opens in Google Maps
7. **Update Location** to search different area

### For Developers:

1. Component: `/components/NearbyShopsPage.tsx`
2. States: initial → loading → success/error/denied
3. API: Overpass API with 5km radius query
4. No backend needed - purely client-side
5. Responsive design built-in

---

## 🎉 Benefits

### For Users:
- ✅ Discover real local shops
- ✅ See actual distances
- ✅ Get directions easily
- ✅ Find contact information
- ✅ Support local businesses

### For Business:
- ✅ Hyperlocal targeting
- ✅ Real-world data integration
- ✅ No manual vendor entry needed
- ✅ Always up-to-date shop listings
- ✅ Scalable to any location

---

## 📊 Metrics to Track (Future)

- Location permission grant rate
- Average shops found per search
- Shop detail click-through rate
- Directions requests
- Error rate by region
- Average search radius
- Popular shop types

---

**Last Updated:** November 6, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
