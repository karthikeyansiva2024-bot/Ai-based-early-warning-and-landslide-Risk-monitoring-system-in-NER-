-- ====================================================================
-- SMART RETAIL STORE SYSTEM - DATABASE SCHEMA (MySQL 8.0+)
-- AI-Powered Edge Inventory & Queue Management System
-- ====================================================================

DROP DATABASE IF EXISTS smart_retail_db;
CREATE DATABASE smart_retail_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_retail_db;

-- 1. USERS & OPERATORS TABLE
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'STORE_MANAGER', 'INVENTORY_STAFF', 'CASHIER') NOT NULL DEFAULT 'STORE_MANAGER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. PRODUCT CATEGORIES TABLE
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. SHELVES (EDGE AI MONITORING NODES) TABLE
-- Note: Distance measurements have been completely removed in accordance with system specifications
CREATE TABLE shelves (
    id VARCHAR(36) PRIMARY KEY,
    shelf_number VARCHAR(20) NOT NULL UNIQUE,
    section_code VARCHAR(20) NOT NULL,
    description VARCHAR(255),
    max_capacity INT NOT NULL DEFAULT 60,
    current_stock INT NOT NULL DEFAULT 0,
    stock_status ENUM('STOCK_OK', 'MEDIUM_STOCK', 'LOW_STOCK', 'EMPTY') NOT NULL DEFAULT 'STOCK_OK',
    stock_percentage DECIMAL(5,2) GENERATED ALWAYS AS (ROUND((current_stock / max_capacity) * 100, 2)) STORED,
    edge_device_id VARCHAR(50),
    image_url VARCHAR(255),
    last_sensor_ping TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. PRODUCTS CATALOG TABLE
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    category_id VARCHAR(36) NOT NULL,
    shelf_id VARCHAR(36),
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    min_threshold INT NOT NULL DEFAULT 10,
    max_capacity INT NOT NULL DEFAULT 50,
    current_quantity INT NOT NULL DEFAULT 0,
    daily_consumption_rate DECIMAL(6,2) NOT NULL DEFAULT 3.50,
    barcode VARCHAR(64),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_prod_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    CONSTRAINT fk_prod_shelf FOREIGN KEY (shelf_id) REFERENCES shelves(id) ON DELETE SET NULL
);

-- 5. INVENTORY TRANSACTION LEDGER
CREATE TABLE inventory (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    shelf_id VARCHAR(36) NOT NULL,
    event_type ENUM('INITIAL_LOAD', 'SALE_DECREMENT', 'RESTOCK_INCREMENT', 'EDGE_CORRECTION', 'AUDIT') NOT NULL,
    quantity_changed INT NOT NULL,
    quantity_after INT NOT NULL,
    recorded_by VARCHAR(36),
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inv_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_inv_shelf FOREIGN KEY (shelf_id) REFERENCES shelves(id) ON DELETE CASCADE,
    CONSTRAINT fk_inv_user FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 6. CUSTOMERS (REGISTERED & ANONYMOUS QUEUE SESSIONS)
CREATE TABLE customers (
    id VARCHAR(36) PRIMARY KEY,
    customer_code VARCHAR(30) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    loyalty_level ENUM('STANDARD', 'SILVER', 'GOLD', 'PLATINUM') DEFAULT 'STANDARD',
    total_visits INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. REAL-TIME QUEUE ENTRIES (FIFO SYSTEM)
CREATE TABLE queue_entries (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36),
    customer_name VARCHAR(100) NOT NULL,
    queue_number INT NOT NULL,
    cart_items_count INT NOT NULL DEFAULT 3,
    status ENUM('WAITING', 'SERVING', 'SERVED', 'CANCELLED') NOT NULL DEFAULT 'WAITING',
    counter_assigned INT DEFAULT 1,
    waiting_seconds INT DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    served_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    CONSTRAINT fk_queue_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- 8. SYSTEM ALERTS
CREATE TABLE alerts (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    alert_type ENUM('LOW_STOCK', 'CRITICAL_STOCK', 'EMPTY_SHELF', 'LONG_QUEUE', 'SYSTEM_INFO') NOT NULL,
    severity ENUM('CRITICAL', 'WARNING', 'INFO') NOT NULL DEFAULT 'WARNING',
    description TEXT NOT NULL,
    entity_reference_id VARCHAR(50),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL
);

-- 9. INVENTORY HISTORICAL LOGS (FOR ML & EDA)
CREATE TABLE inventory_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    shelf_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    recorded_stock INT NOT NULL,
    recorded_percentage DECIMAL(5,2) NOT NULL,
    hourly_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_shelf_time (shelf_id, hourly_timestamp),
    INDEX idx_prod_time (product_id, hourly_timestamp)
);

-- 10. ANALYTICS & EDA SUMMARY RECORDS (CACHED PYTHON OUTPUTS)
CREATE TABLE analytics_records (
    id VARCHAR(36) PRIMARY KEY,
    report_date DATE NOT NULL,
    metric_category VARCHAR(50) NOT NULL,
    mean_stock DECIMAL(8,2) NOT NULL,
    median_stock DECIMAL(8,2) NOT NULL,
    mode_stock DECIMAL(8,2) NOT NULL,
    std_deviation DECIMAL(8,2) NOT NULL,
    variance DECIMAL(8,2) NOT NULL,
    min_stock INT NOT NULL,
    max_stock INT NOT NULL,
    low_stock_ratio DECIMAL(5,2) NOT NULL,
    predicted_stockouts_next_48h INT NOT NULL DEFAULT 0,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEED DATA FOR DEMO & TESTING
INSERT INTO categories (id, name, code, description) VALUES
('cat-1', 'Snacks & Confectionery', 'SNK', 'Packaged potato chips, cookies, wafers, and nuts'),
('cat-2', 'Beverages & Soft Drinks', 'BEV', 'Bottled juices, sparkling water, colas, iced teas'),
('cat-3', 'Bakery & Bread', 'BKY', 'Fresh loaf bread, buns, croissants, artisan rolls'),
('cat-4', 'Dairy & Refrigerated', 'DRY', 'Milk cartons, artisan cheeses, yogurts, butter'),
('cat-5', 'Household Essentials', 'HSD', 'Paper towels, cleaning wipes, detergents');

INSERT INTO shelves (id, shelf_number, section_code, description, max_capacity, current_stock, stock_status, edge_device_id, image_url) VALUES
('shelf-1', 'Shelf 1', 'SEC-A1', 'Aisle 1 - Premium Snacks & Chips', 60, 12, 'LOW_STOCK', 'EDGE-RPI4-01', 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300&q=80'),
('shelf-2', 'Shelf 2', 'SEC-B2', 'Aisle 2 - Carbonated & Mineral Beverages', 60, 48, 'STOCK_OK', 'EDGE-RPI4-02', 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=300&q=80'),
('shelf-3', 'Shelf 3', 'SEC-C1', 'Aisle 3 - Fresh Toast & Bakery Delights', 50, 32, 'STOCK_OK', 'EDGE-RPI4-03', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80'),
('shelf-4', 'Shelf 4', 'SEC-D2', 'Aisle 4 - Organic Milks & Greek Yogurts', 40, 9, 'LOW_STOCK', 'EDGE-RPI4-04', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80');

INSERT INTO products (id, sku, name, category_id, shelf_id, price, min_threshold, max_capacity, current_quantity, daily_consumption_rate) VALUES
('prod-1', 'SNK-101', 'Crispy Sea Salt Potato Chips', 'cat-1', 'shelf-1', 3.49, 15, 60, 12, 6.2),
('prod-2', 'BEV-201', 'Sparkling Lime Spring Water 500ml', 'cat-2', 'shelf-2', 1.99, 15, 60, 48, 4.8),
('prod-3', 'BKY-301', 'Artisan Whole Wheat Sourdough', 'cat-3', 'shelf-3', 4.50, 10, 50, 32, 5.1),
('prod-4', 'DRY-401', 'Pure Organic Whole Milk 1L', 'cat-4', 'shelf-4', 2.89, 12, 40, 9, 7.0);

INSERT INTO queue_entries (id, customer_name, queue_number, cart_items_count, status, waiting_seconds, joined_at) VALUES
('q-1', 'Customer 1', 1, 4, 'WAITING', 120, NOW() - INTERVAL 2 MINUTE),
('q-2', 'Customer 2', 2, 7, 'WAITING', 240, NOW() - INTERVAL 4 MINUTE),
('q-3', 'Customer 3', 3, 11, 'WAITING', 360, NOW() - INTERVAL 6 MINUTE);

INSERT INTO alerts (id, title, alert_type, severity, description, is_read, is_resolved) VALUES
('alt-1', 'Shelf 1 is running low on stock', 'LOW_STOCK', 'CRITICAL', 'Aisle 1 Potato Chips count dropped to 12 items (20% capacity, threshold: 15). Immediate replenishment advised.', FALSE, FALSE),
('alt-2', 'System initialized successfully', 'SYSTEM_INFO', 'INFO', 'Edge AI nodes and retail database services synchronized with zero packet loss.', TRUE, TRUE);
