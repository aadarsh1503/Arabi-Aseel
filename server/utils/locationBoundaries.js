// Bahrain area boundaries for location verification
// These polygons define the exact boundaries of eligible areas
// Using point-in-polygon algorithm for accurate location checking

export const ELIGIBLE_AREAS = [
  {
    name: 'North Sehla',
    nameAr: 'شمال سهلة',
    // Approximate boundary polygon for North Sehla area
    polygon: [
      { lat: 26.1600, lng: 50.5020 },
      { lat: 26.1620, lng: 50.5080 },
      { lat: 26.1580, lng: 50.5140 },
      { lat: 26.1520, lng: 50.5120 },
      { lat: 26.1500, lng: 50.5060 },
      { lat: 26.1540, lng: 50.5020 }
    ]
  },
  {
    name: 'South Sehla',
    nameAr: 'جنوب سهلة',
    // Approximate boundary polygon for South Sehla area
    polygon: [
      { lat: 26.1480, lng: 50.5020 },
      { lat: 26.1500, lng: 50.5080 },
      { lat: 26.1460, lng: 50.5140 },
      { lat: 26.1400, lng: 50.5120 },
      { lat: 26.1380, lng: 50.5060 },
      { lat: 26.1420, lng: 50.5020 }
    ]
  },
  {
    name: 'Jidhafs',
    nameAr: 'جدحفص',
    // Approximate boundary polygon for Jidhafs (Jabalt Habshi area)
    polygon: [
      { lat: 26.1700, lng: 50.5200 },
      { lat: 26.1750, lng: 50.5280 },
      { lat: 26.1720, lng: 50.5360 },
      { lat: 26.1650, lng: 50.5340 },
      { lat: 26.1620, lng: 50.5260 },
      { lat: 26.1660, lng: 50.5200 }
    ]
  },
  {
    name: 'Buquwah',
    nameAr: 'البقوة',
    // Approximate boundary polygon for Buquwah area
    polygon: [
      { lat: 26.1320, lng: 50.5100 },
      { lat: 26.1360, lng: 50.5160 },
      { lat: 26.1330, lng: 50.5220 },
      { lat: 26.1270, lng: 50.5200 },
      { lat: 26.1250, lng: 50.5140 },
      { lat: 26.1290, lng: 50.5100 }
    ]
  },
  {
    name: 'Saraiya',
    nameAr: 'السرايا',
    // Approximate boundary polygon for Saraiya area
    polygon: [
      { lat: 26.1180, lng: 50.5300 },
      { lat: 26.1220, lng: 50.5360 },
      { lat: 26.1190, lng: 50.5420 },
      { lat: 26.1130, lng: 50.5400 },
      { lat: 26.1110, lng: 50.5340 },
      { lat: 26.1150, lng: 50.5300 }
    ]
  },
  // TESTING AREA - Remove before production
  {
    name: 'Test Area',
    nameAr: 'منطقة الاختبار',
    // Kashipur, Uttarakhand boundary (FOR TESTING ONLY)
    polygon: [
      { lat: 29.2300, lng: 78.9400 },
      { lat: 29.2350, lng: 78.9700 },
      { lat: 29.2100, lng: 78.9800 },
      { lat: 29.2000, lng: 78.9600 },
      { lat: 29.2050, lng: 78.9350 },
      { lat: 29.2200, lng: 78.9350 }
    ]
  }
];

/**
 * Point-in-Polygon Algorithm (Ray Casting)
 * Checks if a point (lat, lng) is inside a polygon
 * @param {number} lat - Latitude of the point
 * @param {number} lng - Longitude of the point
 * @param {Array} polygon - Array of {lat, lng} objects defining the polygon
 * @returns {boolean} - True if point is inside polygon
 */
export function isPointInPolygon(lat, lng, polygon) {
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;
    
    const intersect = ((yi > lat) !== (yj > lat)) &&
      (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
}

/**
 * Check if user's location is within any eligible area
 * @param {number} lat - User's latitude
 * @param {number} lng - User's longitude
 * @returns {Object} - { valid: boolean, areaName: string, areaNameAr: string }
 */
export function verifyLocationInEligibleAreas(lat, lng) {
  // Check each eligible area
  for (const area of ELIGIBLE_AREAS) {
    if (isPointInPolygon(lat, lng, area.polygon)) {
      return {
        valid: true,
        areaName: area.name,
        areaNameAr: area.nameAr,
        message: `Location verified in ${area.name}`
      };
    }
  }
  
  // Not in any eligible area
  return {
    valid: false,
    message: 'Sorry, this offer is only available for customers in North Sehla, South Sehla, Jidhafs, Buquwah, and Saraiya areas.'
  };
}

/**
 * Get the center point of all eligible areas (for map display)
 * @returns {Object} - { lat, lng }
 */
export function getEligibleAreasCenter() {
  // Calculate average center of all areas
  let totalLat = 0;
  let totalLng = 0;
  let pointCount = 0;
  
  ELIGIBLE_AREAS.forEach(area => {
    area.polygon.forEach(point => {
      totalLat += point.lat;
      totalLng += point.lng;
      pointCount++;
    });
  });
  
  return {
    lat: totalLat / pointCount,
    lng: totalLng / pointCount
  };
}
