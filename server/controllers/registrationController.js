import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import sendEmail from '../utils/sendEmail.js';
import geoip from 'geoip-lite';
import { verifyLocationInEligibleAreas, ELIGIBLE_AREAS } from '../utils/locationBoundaries.js';
import logger from '../utils/logger.js';

// Bahrain boundaries (to verify user is in Bahrain)
const BAHRAIN_BOUNDS = {
  minLat: 25.5,
  maxLat: 26.5,
  minLng: 50.3,
  maxLng: 50.8
};

// Radius in meters (approximately 5km for IP-based location - less precise than GPS)
const ALLOWED_RADIUS = 5000;

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Get client IP address from request
function getClientIP(req) {
  // Check various headers for the real IP (in case of proxies/load balancers)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIP = req.headers['x-real-ip'];
  if (realIP) {
    return realIP;
  }
  
  return req.connection.remoteAddress || req.socket.remoteAddress;
}

// Verify location is in North Sehla using IP geolocation
function verifyNorthSehlaLocationByIP(ip) {
  try {
    // For local testing, allow localhost
    if (ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1') {
      console.log('⚠️  Localhost detected - allowing for testing purposes');
      return {
        valid: true,
        latitude: NORTH_SEHLA_CENTER.lat,
        longitude: NORTH_SEHLA_CENTER.lng,
        distance: 0,
        message: 'Testing mode (localhost)'
      };
    }

    // Get geolocation from IP
    const geo = geoip.lookup(ip);
    
    if (!geo) {
      return {
        valid: false,
        message: 'Unable to determine your location. Please ensure you are in Bahrain and try again.'
      };
    }

    const [latitude, longitude] = geo.ll; // [lat, lng]
    
    // First check: Verify user is in Bahrain
    if (latitude < BAHRAIN_BOUNDS.minLat || latitude > BAHRAIN_BOUNDS.maxLat ||
        longitude < BAHRAIN_BOUNDS.minLng || longitude > BAHRAIN_BOUNDS.maxLng) {
      return {
        valid: false,
        message: 'Sorry, this promotion is only available for customers in Bahrain.',
        country: geo.country
      };
    }

    // Second check: Calculate distance from North Sehla center
    const distance = calculateDistance(
      NORTH_SEHLA_CENTER.lat,
      NORTH_SEHLA_CENTER.lng,
      latitude,
      longitude
    );

    if (distance > ALLOWED_RADIUS) {
      return {
        valid: false,
        message: 'Sorry, this promotion is only available for customers in the North Sehla area.',
        distance: Math.round(distance)
      };
    }

    return {
      valid: true,
      latitude: latitude,
      longitude: longitude,
      distance: Math.round(distance),
      city: geo.city,
      region: geo.region
    };
  } catch (error) {
    console.error('IP Geolocation Error:', error);
    return {
      valid: false,
      message: 'Unable to verify your location. Please try again.'
    };
  }
}

// Generate unique coupon code
function generateCouponCode() {
  const prefix = 'AA';
  const randomPart = uuidv4().split('-')[0].toUpperCase();
  return `${prefix}-${randomPart}`;
}

// Generate coupon email template (no CSS for Outlook compatibility)
function generateCouponEmail(name, couponCode, couponType) {
  const companyLogo = process.env.COMPANY_LOGO;
  const companyName = process.env.COMPANY_NAME;
  const discount = couponType === 'BUY_1_GET_1' ? 'BUY 1 GET 1 FREE' : '50% FLAT DISCOUNT';

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f4f4">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
            <!-- Header with Logo -->
            <tr>
              <td align="center" bgcolor="#724F38" style="padding: 30px 20px;">
                <img src="${companyLogo}" alt="${companyName}" width="150" height="auto" style="display: block;">
              </td>
            </tr>
            
            <!-- Welcome Message -->
            <tr>
              <td style="padding: 40px 30px 20px 30px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family: Arial, sans-serif; font-size: 24px; color: #333333; font-weight: bold; text-align: center;">
                      Welcome, ${name}!
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: Arial, sans-serif; font-size: 16px; color: #666666; text-align: center; padding-top: 15px; line-height: 24px;">
                      Thank you for registering with ${companyName}. We're excited to have you as part of our community!
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Coupon Section -->
            <tr>
              <td style="padding: 20px 30px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFF8E7">
                  <tr>
                    <td style="padding: 30px; text-align: center; border: 3px dashed #724F38;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="font-family: Arial, sans-serif; font-size: 18px; color: #724F38; font-weight: bold; padding-bottom: 15px;">
                            YOUR EXCLUSIVE COUPON
                          </td>
                        </tr>
                        <tr>
                          <td style="font-family: 'Courier New', monospace; font-size: 32px; color: #333333; font-weight: bold; letter-spacing: 2px; padding: 15px 0;">
                            ${couponCode}
                          </td>
                        </tr>
                        <tr>
                          <td style="font-family: Arial, sans-serif; font-size: 20px; color: #D4AF37; font-weight: bold; padding-top: 10px;">
                            ${discount}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Instructions -->
            <tr>
              <td style="padding: 20px 30px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family: Arial, sans-serif; font-size: 16px; color: #333333; font-weight: bold; padding-bottom: 15px;">
                      How to Use Your Coupon:
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; line-height: 22px;">
                      1. Visit ${companyName} at your convenience<br>
                      2. Show this coupon code to our staff<br>
                      3. Enjoy your ${discount}!<br>
                      <br>
                      <strong>Note:</strong> This coupon is valid for one-time use only.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td bgcolor="#724F38" style="padding: 30px 20px; text-align: center;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family: Arial, sans-serif; font-size: 14px; color: #ffffff; line-height: 20px;">
                      ${companyName}<br>
                      North Sehla, Bahrain<br>
                      <br>
                      Questions? Contact us at ${process.env.EMAIL_FROM}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

// Register customer
export const registerCustomer = async (req, res) => {
  try {
    const { name, mobile, email, address_title, building_number, address_city, address_block, latitude, longitude } = req.body;

    // Validation
    if (!name || !mobile || !email || !address_title || !building_number || !address_city || !address_block) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate coordinates
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Location coordinates are required' });
    }

    // Check registration limit (100 customers)
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM registrations');
    if (countResult[0].total >= 100) {
      return res.status(400).json({ error: 'Registration limit reached. Thank you for your interest!' });
    }

    // Check if email already registered
    const [existingUser] = await db.query('SELECT id FROM registrations WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'This email is already registered' });
    }

    // Verify location using polygon-based boundary checking
    const locationCheck = verifyLocationInEligibleAreas(latitude, longitude);
    
    if (!locationCheck.valid) {
      console.log(`❌ Location verification failed: User at (${latitude}, ${longitude}) is outside eligible areas`);
      return res.status(400).json({ 
        error: locationCheck.message
      });
    }

    console.log(`✅ Location verified: User is in ${locationCheck.areaName} (${locationCheck.areaNameAr})`);

    // Generate coupon with proper 50/50 distribution
    const couponCode = generateCouponCode();
    
    // Count existing coupons to maintain balance
    const [typeCount] = await db.query(`
      SELECT 
        SUM(CASE WHEN coupon_type = 'BUY_1_GET_1' THEN 1 ELSE 0 END) as buy1get1_count,
        SUM(CASE WHEN coupon_type = 'DISCOUNT_50' THEN 1 ELSE 0 END) as discount_count
      FROM registrations
    `);
    
    const buy1get1Count = typeCount[0].buy1get1_count || 0;
    const discountCount = typeCount[0].discount_count || 0;
    
    // Assign coupon type to maintain 50/50 balance
    let couponType;
    if (buy1get1Count < discountCount) {
      couponType = 'BUY_1_GET_1';
    } else if (discountCount < buy1get1Count) {
      couponType = 'DISCOUNT_50';
    } else {
      // If equal, randomly assign
      couponType = Math.random() < 0.5 ? 'BUY_1_GET_1' : 'DISCOUNT_50';
    }
    
    console.log(`📊 Current distribution - B1G1: ${buy1get1Count}, 50%: ${discountCount} → Assigning: ${couponType}`);

    // Insert into database
    const [result] = await db.query(
      `INSERT INTO registrations 
       (name, mobile, email, address_title, building_number, address_city, address_block, latitude, longitude, coupon_code, coupon_type) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, mobile, email, address_title, building_number, address_city, address_block, 
       latitude, longitude, couponCode, couponType]
    );

    // Send email with coupon
    const emailHtml = generateCouponEmail(name, couponCode, couponType);
    await sendEmail({
      email: email,
      subject: `Your Exclusive Coupon from ${process.env.COMPANY_NAME}`,
      html: emailHtml
    });

    console.log(`✅ Registration successful: ${email} - Coupon: ${couponCode}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Check your email for your coupon.',
      data: {
        coupon_code: couponCode,
        coupon_type: couponType
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ 
      error: 'Registration failed. Please try again.',
      details: error.message 
    });
  }
};

// Get country code from IP (for phone input)
export const getCountryFromIP = async (req, res) => {
  try {
    const clientIP = getClientIP(req);
    
    // Clean up IPv6 localhost format
    let ip = clientIP;
    if (ip === '::1' || ip === '::ffff:127.0.0.1') {
      ip = '127.0.0.1';
    }

    // For localhost/private IPs, default to Bahrain
    if (ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return res.json({
        success: true,
        countryCode: 'bh', // Bahrain
        dialCode: '+973'
      });
    }

    const geo = geoip.lookup(ip);
    
    if (!geo) {
      // Default to Bahrain if can't detect
      return res.json({
        success: true,
        countryCode: 'bh',
        dialCode: '+973'
      });
    }

    res.json({
      success: true,
      countryCode: geo.country.toLowerCase(),
      country: geo.country
    });

  } catch (error) {
    console.error('Error getting country from IP:', error);
    // Default to Bahrain on error
    res.json({
      success: true,
      countryCode: 'bh',
      dialCode: '+973'
    });
  }
};

// Get all registrations (Admin only)
export const getAllRegistrations = async (req, res) => {
  try {
    const [registrations] = await db.query(`
      SELECT id, name, mobile, email, address_title, building_number, address_city, address_block,
             latitude, longitude, coupon_code, coupon_type, is_used, used_at, created_at
      FROM registrations
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      total: registrations.length,
      data: registrations
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
};

// Mark coupon as used (Admin only)
export const markCouponUsed = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'UPDATE registrations SET is_used = TRUE, used_at = NOW() WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.json({ success: true, message: 'Coupon marked as used' });
  } catch (error) {
    console.error('Error marking coupon as used:', error);
    res.status(500).json({ error: 'Failed to update coupon status' });
  }
};

// Export registrations as CSV
export const exportRegistrationsCSV = async (req, res) => {
  try {
    const [registrations] = await db.query(`
      SELECT name, mobile, email, address_title, building_number, address_city, address_block,
             latitude, longitude, coupon_code, coupon_type, is_used, used_at, created_at
      FROM registrations
      ORDER BY created_at DESC
    `);

    if (registrations.length === 0) {
      return res.status(404).json({ error: 'No registrations found' });
    }

    // Convert to CSV format
    const headers = ['Name', 'Mobile', 'Email', 'Address Title', 'Building Number', 'City', 'Postal Code', 
                     'Latitude', 'Longitude', 'Google Maps Link',
                     'Coupon Code', 'Coupon Type', 'Used', 'Used At', 'Registered At'];
    
    const csvRows = [headers.join(',')];
    
    registrations.forEach(reg => {
      const mapsLink = `https://www.google.com/maps?q=${reg.latitude},${reg.longitude}`;
      const row = [
        `"${reg.name}"`,
        `"${reg.mobile}"`,
        `"${reg.email}"`,
        `"${reg.address_title}"`,
        `"${reg.building_number || ''}"`,
        `"${reg.address_city}"`,
        `"${reg.address_block}"`,
        `"${reg.latitude}"`,
        `"${reg.longitude}"`,
        `"${mapsLink}"`,
        `"${reg.coupon_code}"`,
        `"${reg.coupon_type}"`,
        reg.is_used ? 'Yes' : 'No',
        reg.used_at ? `"${new Date(reg.used_at).toLocaleString()}"` : '',
        `"${new Date(reg.created_at).toLocaleString()}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=registrations_${Date.now()}.csv`);
    res.send(csvContent);

  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
};

// Export registrations as Excel
export const exportRegistrationsExcel = async (req, res) => {
  try {
    const [registrations] = await db.query(`
      SELECT name, mobile, email, address_title, building_number, address_city, address_block,
             latitude, longitude, coupon_code, coupon_type, is_used, used_at, created_at
      FROM registrations
      ORDER BY created_at DESC
    `);

    if (registrations.length === 0) {
      return res.status(404).json({ error: 'No registrations found' });
    }

    res.json({
      success: true,
      data: registrations.map(reg => {
        const mapsLink = `https://www.google.com/maps?q=${reg.latitude},${reg.longitude}`;
        return {
          Name: reg.name,
          Mobile: reg.mobile,
          Email: reg.email,
          'Address Title': reg.address_title,
          'Building Number': reg.building_number || '',
          City: reg.address_city,
          'Postal Code': reg.address_block,
          Latitude: reg.latitude,
          Longitude: reg.longitude,
          'Google Maps Link': mapsLink,
          'Coupon Code': reg.coupon_code,
          'Coupon Type': reg.coupon_type,
          Used: reg.is_used ? 'Yes' : 'No',
          'Used At': reg.used_at ? new Date(reg.used_at).toLocaleString() : '',
          'Registered At': new Date(reg.created_at).toLocaleString()
        };
      })
    });

  } catch (error) {
    console.error('Error exporting Excel:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
};


// Delete registration (Admin only)
export const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if registration exists
    const [existing] = await db.query('SELECT * FROM registrations WHERE id = ?', [id]);
    
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    // Delete the registration
    await db.query('DELETE FROM registrations WHERE id = ?', [id]);

    console.log(`✅ Registration deleted: ID ${id}`);

    res.json({
      success: true,
      message: 'Registration deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({ error: 'Failed to delete registration' });
  }
};

// Verify location is in eligible areas (Public endpoint for frontend)
export const verifyLocation = async (req, res) => {
  logger.info('LOCATION_VERIFY', '🌍 Location verification request received');
  
  try {
    const { latitude, longitude } = req.body;
    
    logger.debug('LOCATION_VERIFY', 'Request body received', { latitude, longitude });

    if (!latitude || !longitude) {
      logger.warn('LOCATION_VERIFY', 'Missing coordinates in request');
      return res.status(400).json({ 
        valid: false,
        message: 'Latitude and longitude are required' 
      });
    }

    logger.debug('LOCATION_VERIFY', 'Starting polygon-based verification', {
      coordinates: { latitude, longitude },
      totalEligibleAreas: ELIGIBLE_AREAS.length
    });

    // Use polygon-based verification
    const locationCheck = verifyLocationInEligibleAreas(latitude, longitude);
    
    logger.debug('LOCATION_VERIFY', 'Verification result received', locationCheck);
    
    if (locationCheck.valid) {
      logger.success('LOCATION_VERIFY', `✅ Location verified in ${locationCheck.areaName}`, {
        coordinates: { latitude, longitude },
        areaName: locationCheck.areaName,
        areaNameAr: locationCheck.areaNameAr
      });
      
      return res.json({
        valid: true,
        areaName: locationCheck.areaName,
        areaNameAr: locationCheck.areaNameAr,
        message: locationCheck.message
      });
    } else {
      logger.warn('LOCATION_VERIFY', '❌ Location outside all eligible areas', {
        coordinates: { latitude, longitude },
        message: locationCheck.message
      });
      
      return res.json({
        valid: false,
        message: locationCheck.message
      });
    }

  } catch (error) {
    logger.error('LOCATION_VERIFY', 'Error during location verification', {
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ 
      valid: false,
      message: 'Failed to verify location. Please try again.' 
    });
  }
};
