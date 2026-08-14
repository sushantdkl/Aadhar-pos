import { NextResponse } from 'next/server';
import pool from '@/lib/postgres';

export async function POST(request) {
  try {
    const licenseKey = request.headers.get('X-License-Key');
    
    if (!licenseKey) {
      return NextResponse.json(
        { error: 'License key is required' },
        { status: 400 }
      );
    }

    const { products, sync_date } = await request.json();
    
    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Invalid products data' },
        { status: 400 }
      );
    }

    console.log(`📦 Receiving product sync from ${licenseKey}: ${products.length} products`);
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      let syncedCount = 0;
      let errors = [];
      
      for (const product of products) {
        try {
          // Upsert master product catalog
          await client.query(`
            INSERT INTO master_products (
              barcode, 
              product_name, 
              category, 
              avg_retail_price,
              min_price,
              max_price,
              last_updated_at
            )
            VALUES ($1, $2, $3, $4, $4, $4, CURRENT_TIMESTAMP)
            ON CONFLICT (barcode) DO UPDATE SET
              product_name = EXCLUDED.product_name,
              category = EXCLUDED.category,
              avg_retail_price = (master_products.avg_retail_price * master_products.total_shops_using + EXCLUDED.avg_retail_price) / (master_products.total_shops_using + 1),
              min_price = LEAST(master_products.min_price, EXCLUDED.min_price),
              max_price = GREATEST(master_products.max_price, EXCLUDED.max_price),
              last_updated_at = CURRENT_TIMESTAMP,
              total_shops_using = master_products.total_shops_using + 1
          `, [product.barcode, product.name, product.category, product.price]);
          
          // Record price history
          await client.query(`
            INSERT INTO product_price_history (barcode, shop_license_key, price)
            VALUES ($1, $2, $3)
          `, [product.barcode, licenseKey, product.price]);
          
          syncedCount++;
        } catch (err) {
          console.error(`Error syncing product ${product.barcode}:`, err);
          errors.push({ barcode: product.barcode, error: err.message });
        }
      }
      
      // Log sync operation
      await client.query(`
        INSERT INTO product_sync_log (license_key, products_synced, status, error_message)
        VALUES ($1, $2, $3, $4)
      `, [
        licenseKey,
        syncedCount,
        errors.length > 0 ? 'partial' : 'success',
        errors.length > 0 ? JSON.stringify(errors) : null
      ]);
      
      await client.query('COMMIT');
      
      console.log(`✅ Product sync completed: ${syncedCount}/${products.length} products synced`);
      
      return NextResponse.json({ 
        success: true,
        synced_products: syncedCount,
        total_products: products.length,
        errors: errors.length > 0 ? errors : undefined
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Product sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync products', details: error.message },
      { status: 500 }
    );
  }
}
