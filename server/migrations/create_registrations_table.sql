-- Create registrations table for North Sehla customers
CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  mobile VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address_title VARCHAR(255) NOT NULL,
  address_city VARCHAR(255) NOT NULL,
  address_block VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  coupon_code VARCHAR(50) UNIQUE NOT NULL,
  coupon_type ENUM('FREE_MEAL', 'DISCOUNT_50') NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  used_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_coupon_code (coupon_code),
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
