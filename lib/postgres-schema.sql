-- Master Product Catalog Database Schema
-- This database stores aggregated product data from all POS systems

-- Master Product Catalog
CREATE TABLE IF NOT EXISTS master_products (
    id SERIAL PRIMARY KEY,
    barcode VARCHAR(255) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    avg_retail_price DECIMAL(10, 2),
    min_price DECIMAL(10, 2),
    max_price DECIMAL(10, 2),
    first_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_shops_using INT DEFAULT 1,
    total_quantity_sold BIGINT DEFAULT 0,
    total_revenue DECIMAL(15, 2) DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_barcode ON master_products(barcode);
CREATE INDEX IF NOT EXISTS idx_product_name ON master_products(product_name);
CREATE INDEX IF NOT EXISTS idx_category ON master_products(category);

-- Product Price History (for market insights)
CREATE TABLE IF NOT EXISTS product_price_history (
    id SERIAL PRIMARY KEY,
    barcode VARCHAR(255) NOT NULL,
    shop_license_key VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_barcode_date ON product_price_history(barcode, recorded_at);
CREATE INDEX IF NOT EXISTS idx_license_key ON product_price_history(shop_license_key);

-- Sales Analytics (Aggregated - No customer data)
CREATE TABLE IF NOT EXISTS sales_analytics (
    id SERIAL PRIMARY KEY,
    license_key VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    total_transactions INT DEFAULT 0,
    total_revenue DECIMAL(12, 2) DEFAULT 0,
    avg_transaction_value DECIMAL(10, 2) DEFAULT 0,
    top_selling_products JSONB, -- [{barcode, name, quantity, revenue}]
    payment_method_breakdown JSONB, -- {cash: 0.6, card: 0.3, credit: 0.1}
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(license_key, date)
);

CREATE INDEX IF NOT EXISTS idx_license_date ON sales_analytics(license_key, date);
CREATE INDEX IF NOT EXISTS idx_date ON sales_analytics(date);

-- Trending Products (Weekly aggregation)
CREATE TABLE IF NOT EXISTS trending_products (
    id SERIAL PRIMARY KEY,
    barcode VARCHAR(255) NOT NULL,
    product_name VARCHAR(255),
    week_start DATE NOT NULL,
    total_quantity_sold INT DEFAULT 0,
    total_revenue DECIMAL(12, 2) DEFAULT 0,
    shops_selling_count INT DEFAULT 0,
    avg_price DECIMAL(10, 2),
    trend_score DECIMAL(5, 2), -- Calculated metric (0-100)
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(barcode, week_start)
);

CREATE INDEX IF NOT EXISTS idx_barcode_week ON trending_products(barcode, week_start);
CREATE INDEX IF NOT EXISTS idx_trend_score ON trending_products(trend_score DESC);
CREATE INDEX IF NOT EXISTS idx_week_start ON trending_products(week_start);

-- Product Sync Log (Track sync operations)
CREATE TABLE IF NOT EXISTS product_sync_log (
    id SERIAL PRIMARY KEY,
    license_key VARCHAR(100) NOT NULL,
    sync_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    products_synced INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'success',
    error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_sync_license ON product_sync_log(license_key);
CREATE INDEX IF NOT EXISTS idx_sync_date ON product_sync_log(sync_date);

-- Comments
COMMENT ON TABLE master_products IS 'Aggregated product catalog from all POS systems';
COMMENT ON TABLE product_price_history IS 'Historical price tracking for market analysis';
COMMENT ON TABLE sales_analytics IS 'Daily sales metrics per shop (no customer PII)';
COMMENT ON TABLE trending_products IS 'Weekly trending products across all shops';
COMMENT ON TABLE product_sync_log IS 'Audit log for product synchronization operations';
