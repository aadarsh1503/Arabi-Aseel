// Bahrain area boundaries for location verification
// These polygons define the exact boundaries of eligible areas
// Using point-in-polygon algorithm for accurate location checking

import logger from './logger.js';

export const ELIGIBLE_AREAS = [
  // CAPITAL GOVERNORATE
  {
    name: 'Manama',
    nameAr: 'المنامة',
    polygon: [
      { lat: 26.2400, lng: 50.5600 },
      { lat: 26.2450, lng: 50.5900 },
      { lat: 26.2200, lng: 50.6000 },
      { lat: 26.2100, lng: 50.5800 },
      { lat: 26.2150, lng: 50.5600 }
    ]
  },
  {
    name: 'Juffair',
    nameAr: 'الجفير',
    polygon: [
      { lat: 26.2150, lng: 50.6000 },
      { lat: 26.2200, lng: 50.6150 },
      { lat: 26.2050, lng: 50.6200 },
      { lat: 26.2000, lng: 50.6050 }
    ]
  },
  {
    name: 'Adliya',
    nameAr: 'العدلية',
    polygon: [
      { lat: 26.2100, lng: 50.5800 },
      { lat: 26.2150, lng: 50.5900 },
      { lat: 26.2050, lng: 50.5950 },
      { lat: 26.2000, lng: 50.5850 }
    ]
  },
  {
    name: 'Hoora',
    nameAr: 'الحورة',
    polygon: [
      { lat: 26.2200, lng: 50.5700 },
      { lat: 26.2250, lng: 50.5800 },
      { lat: 26.2150, lng: 50.5850 },
      { lat: 26.2100, lng: 50.5750 }
    ]
  },
  {
    name: 'Gudaibiya',
    nameAr: 'القضيبية',
    polygon: [
      { lat: 26.2050, lng: 50.5700 },
      { lat: 26.2100, lng: 50.5800 },
      { lat: 26.2000, lng: 50.5850 },
      { lat: 26.1950, lng: 50.5750 }
    ]
  },
  {
    name: 'Zinj',
    nameAr: 'الزنج',
    polygon: [
      { lat: 26.1950, lng: 50.5800 },
      { lat: 26.2000, lng: 50.5900 },
      { lat: 26.1900, lng: 50.5950 },
      { lat: 26.1850, lng: 50.5850 }
    ]
  },
  {
    name: 'Seef',
    nameAr: 'السيف',
    polygon: [
      { lat: 26.2350, lng: 50.5300 },
      { lat: 26.2450, lng: 50.5500 },
      { lat: 26.2350, lng: 50.5600 },
      { lat: 26.2250, lng: 50.5400 }
    ]
  },
  {
    name: 'Sanabis',
    nameAr: 'السنابس',
    polygon: [
      { lat: 26.2200, lng: 50.5500 },
      { lat: 26.2250, lng: 50.5600 },
      { lat: 26.2150, lng: 50.5650 },
      { lat: 26.2100, lng: 50.5550 }
    ]
  },
  
  // MUHARRAQ GOVERNORATE
  {
    name: 'Muharraq',
    nameAr: 'المحرق',
    polygon: [
      { lat: 26.2600, lng: 50.6100 },
      { lat: 26.2700, lng: 50.6300 },
      { lat: 26.2500, lng: 50.6400 },
      { lat: 26.2400, lng: 50.6200 }
    ]
  },
  {
    name: 'Hidd',
    nameAr: 'الحد',
    polygon: [
      { lat: 26.2400, lng: 50.6500 },
      { lat: 26.2500, lng: 50.6700 },
      { lat: 26.2300, lng: 50.6800 },
      { lat: 26.2200, lng: 50.6600 }
    ]
  },
  {
    name: 'Busaiteen',
    nameAr: 'البسيتين',
    polygon: [
      { lat: 26.2500, lng: 50.5900 },
      { lat: 26.2600, lng: 50.6100 },
      { lat: 26.2400, lng: 50.6150 },
      { lat: 26.2350, lng: 50.5950 }
    ]
  },
  {
    name: 'Arad',
    nameAr: 'عراد',
    polygon: [
      { lat: 26.2350, lng: 50.6300 },
      { lat: 26.2450, lng: 50.6450 },
      { lat: 26.2250, lng: 50.6500 },
      { lat: 26.2200, lng: 50.6350 }
    ]
  },
  {
    name: 'Dair',
    nameAr: 'الدير',
    polygon: [
      { lat: 26.2700, lng: 50.6400 },
      { lat: 26.2800, lng: 50.6600 },
      { lat: 26.2600, lng: 50.6700 },
      { lat: 26.2550, lng: 50.6500 }
    ]
  },
  
  // NORTHERN GOVERNORATE
  {
    name: 'Hamad Town',
    nameAr: 'مدينة حمد',
    polygon: [
      { lat: 26.1200, lng: 50.4800 },
      { lat: 26.1400, lng: 50.5200 },
      { lat: 26.1100, lng: 50.5300 },
      { lat: 26.0900, lng: 50.4900 }
    ]
  },
  {
    name: 'Budaiya',
    nameAr: 'البديع',
    polygon: [
      { lat: 26.1800, lng: 50.4500 },
      { lat: 26.2000, lng: 50.4800 },
      { lat: 26.1700, lng: 50.4900 },
      { lat: 26.1600, lng: 50.4600 }
    ]
  },
  {
    name: 'Saar',
    nameAr: 'سار',
    polygon: [
      { lat: 26.1900, lng: 50.4700 },
      { lat: 26.2000, lng: 50.4900 },
      { lat: 26.1850, lng: 50.5000 },
      { lat: 26.1800, lng: 50.4800 }
    ]
  },
  {
    name: 'Janabiyah',
    nameAr: 'الجنبية',
    polygon: [
      { lat: 26.1700, lng: 50.4600 },
      { lat: 26.1800, lng: 50.4800 },
      { lat: 26.1650, lng: 50.4900 },
      { lat: 26.1600, lng: 50.4700 }
    ]
  },
  {
    name: 'Barbar',
    nameAr: 'باربار',
    polygon: [
      { lat: 26.1950, lng: 50.4500 },
      { lat: 26.2050, lng: 50.4700 },
      { lat: 26.1900, lng: 50.4800 },
      { lat: 26.1850, lng: 50.4600 }
    ]
  },
  {
    name: 'Diraz',
    nameAr: 'الدراز',
    polygon: [
      { lat: 26.1600, lng: 50.4300 },
      { lat: 26.1700, lng: 50.4500 },
      { lat: 26.1550, lng: 50.4600 },
      { lat: 26.1500, lng: 50.4400 }
    ]
  },
  {
    name: 'Bani Jamra',
    nameAr: 'بني جمرة',
    polygon: [
      { lat: 26.1500, lng: 50.4500 },
      { lat: 26.1600, lng: 50.4700 },
      { lat: 26.1450, lng: 50.4800 },
      { lat: 26.1400, lng: 50.4600 }
    ]
  },
  {
    name: 'North Sehla',
    nameAr: 'شمال سهلة',
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
    name: 'Jeblat Habshi',
    nameAr: 'جبلة حبشي',
    polygon: [
      { lat: 26.2200, lng: 50.5200 },
      { lat: 26.2250, lng: 50.5280 },
      { lat: 26.2200, lng: 50.5360 },
      { lat: 26.2100, lng: 50.5340 },
      { lat: 26.2050, lng: 50.5260 },
      { lat: 26.2100, lng: 50.5200 }
    ]
  },
  {
    name: 'Buquwah',
    nameAr: 'البقوة',
    polygon: [
      { lat: 26.2020, lng: 50.5060 },
      { lat: 26.2050, lng: 50.5140 },
      { lat: 26.2000, lng: 50.5220 },
      { lat: 26.1900, lng: 50.5200 },
      { lat: 26.1870, lng: 50.5120 },
      { lat: 26.1920, lng: 50.5060 }
    ]
  },
  {
    name: 'Dumistan',
    nameAr: 'دمستان',
    polygon: [
      { lat: 26.1800, lng: 50.5100 },
      { lat: 26.1850, lng: 50.5200 },
      { lat: 26.1750, lng: 50.5250 },
      { lat: 26.1700, lng: 50.5150 }
    ]
  },
  {
    name: 'Karzakan',
    nameAr: 'كرزكان',
    polygon: [
      { lat: 26.0600, lng: 50.5200 },
      { lat: 26.0700, lng: 50.5400 },
      { lat: 26.0550, lng: 50.5450 },
      { lat: 26.0500, lng: 50.5250 }
    ]
  },
  
  // SOUTHERN GOVERNORATE
  {
    name: 'Isa Town',
    nameAr: 'مدينة عيسى',
    polygon: [
      { lat: 26.1700, lng: 50.5400 },
      { lat: 26.1900, lng: 50.5700 },
      { lat: 26.1600, lng: 50.5800 },
      { lat: 26.1500, lng: 50.5500 }
    ]
  },
  {
    name: 'Riffa',
    nameAr: 'الرفاع',
    polygon: [
      { lat: 26.1200, lng: 50.5400 },
      { lat: 26.1400, lng: 50.5700 },
      { lat: 26.1100, lng: 50.5800 },
      { lat: 26.1000, lng: 50.5500 }
    ]
  },
  {
    name: 'Saraiya',
    nameAr: 'السرايا',
    polygon: [
      { lat: 26.1180, lng: 50.5300 },
      { lat: 26.1220, lng: 50.5360 },
      { lat: 26.1190, lng: 50.5420 },
      { lat: 26.1130, lng: 50.5400 },
      { lat: 26.1110, lng: 50.5340 },
      { lat: 26.1150, lng: 50.5300 }
    ]
  },
  {
    name: 'Zallaq',
    nameAr: 'الزلاق',
    polygon: [
      { lat: 25.9800, lng: 50.4500 },
      { lat: 26.0000, lng: 50.4800 },
      { lat: 25.9700, lng: 50.4900 },
      { lat: 25.9600, lng: 50.4600 }
    ]
  },
  {
    name: 'Awali',
    nameAr: 'العوالي',
    polygon: [
      { lat: 26.0600, lng: 50.5600 },
      { lat: 26.0750, lng: 50.5850 },
      { lat: 26.0500, lng: 50.5900 },
      { lat: 26.0400, lng: 50.5650 }
    ]
  },
  {
    name: 'Sitra',
    nameAr: 'سترة',
    polygon: [
      { lat: 26.1500, lng: 50.6100 },
      { lat: 26.1700, lng: 50.6400 },
      { lat: 26.1400, lng: 50.6500 },
      { lat: 26.1300, lng: 50.6200 }
    ]
  },
  {
    name: 'Tubli',
    nameAr: 'توبلي',
    polygon: [
      { lat: 26.1900, lng: 50.6000 },
      { lat: 26.2000, lng: 50.6200 },
      { lat: 26.1850, lng: 50.6250 },
      { lat: 26.1800, lng: 50.6050 }
    ]
  },
  {
    name: 'Eker',
    nameAr: 'عكر',
    polygon: [
      { lat: 26.0900, lng: 50.5100 },
      { lat: 26.1000, lng: 50.5300 },
      { lat: 26.0850, lng: 50.5350 },
      { lat: 26.0800, lng: 50.5150 }
    ]
  },
  {
    name: 'Askar',
    nameAr: 'عسكر',
    polygon: [
      { lat: 26.1000, lng: 50.5700 },
      { lat: 26.1100, lng: 50.5900 },
      { lat: 26.0950, lng: 50.5950 },
      { lat: 26.0900, lng: 50.5750 }
    ]
  },
  {
    name: 'Jurdab',
    nameAr: 'جرداب',
    polygon: [
      { lat: 26.0400, lng: 50.5400 },
      { lat: 26.0500, lng: 50.5600 },
      { lat: 26.0350, lng: 50.5650 },
      { lat: 26.0300, lng: 50.5450 }
    ]
  },
  
  // TESTING AREA - Remove before production
  {
    name: 'Test Area',
    nameAr: 'منطقة الاختبار',
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
  logger.debug('POLYGON_CHECK', 'Checking if point is inside polygon', {
    point: { lat, lng },
    polygonPoints: polygon.length
  });
  
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
  
  logger.debug('POLYGON_CHECK', `Point is ${inside ? 'INSIDE' : 'OUTSIDE'} polygon`);
  
  return inside;
}

/**
 * Check if user's location is within any eligible area
 * @param {number} lat - User's latitude
 * @param {number} lng - User's longitude
 * @returns {Object} - { valid: boolean, areaName: string, areaNameAr: string }
 */
export function verifyLocationInEligibleAreas(lat, lng) {
  logger.info('AREA_CHECK', '🔍 Starting area verification', {
    coordinates: { lat, lng },
    totalAreas: ELIGIBLE_AREAS.length
  });
  
  // Check each eligible area
  for (const area of ELIGIBLE_AREAS) {
    logger.debug('AREA_CHECK', `Checking area: ${area.name}`, {
      areaName: area.name,
      areaNameAr: area.nameAr,
      polygonPoints: area.polygon.length
    });
    
    if (isPointInPolygon(lat, lng, area.polygon)) {
      logger.success('AREA_CHECK', `✅ Match found in ${area.name}`, {
        areaName: area.name,
        areaNameAr: area.nameAr,
        coordinates: { lat, lng }
      });
      
      return {
        valid: true,
        areaName: area.name,
        areaNameAr: area.nameAr,
        message: `Location verified in ${area.name}`
      };
    }
  }
  
  // Not in any eligible area
  logger.warn('AREA_CHECK', '❌ No matching area found', {
    coordinates: { lat, lng },
    checkedAreas: ELIGIBLE_AREAS.map(a => a.name)
  });
  
  return {
    valid: false,
    message: 'LOCATION_NOT_ELIGIBLE'
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
