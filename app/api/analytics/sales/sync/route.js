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

    const analyticsData = await request.json();
    
    if (!analyticsData.date) {
      return NextResponse.json(
        { error: 'Analytics date is required' },
        { status: 400 }
      );
    }

    console.log(`📊 Receiving analytics from ${licenseKey} for ${analyticsData.date}`);
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert or update sales analytics
      await client.query(`
        INSERT INTO sales_analytics (
          license_key,
          date,
          total_transactions,
          total_revenue,
          avg_transaction_value,
          top_selling_products,
          payment_method_breakdown,
          recorded_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
        ON CONFLICT (license_key, date) DO UPDATE SET
          total_transactions = EXCLUDED.total_transactions,
          total_revenue = EXCLUDED.total_revenue,
          avg_transaction_value = EXCLUDED.avg_transaction_value,
          top_selling_products = EXCLUDED.top_selling_products,
          payment_method_breakdown = EXCLUDED.payment_method_breakdown,
          recorded_at = CURRENT_TIMESTAMP
      `, [
        licenseKey,
        analyticsData.date,
        analyticsData.total_transactions || 0,
        analyticsData.total_revenue || 0,
        analyticsData.avg_transaction_value || 0,
        JSON.stringify(analyticsData.top_selling_products || []),
        JSON.stringify(analyticsData.payment_method_breakdown || {})
      ]);
      
      // Update trending products (weekly aggregation)
      if (analyticsData.top_selling_products && analyticsData.top_selling_products.length > 0) {
        const weekStart = getWeekStart(new Date(analyticsData.date));
        
        for (const product of analyticsData.top_selling_products) {
          if (product.barcode) {
            await client.query(`
              INSERT INTO trending_products (
                barcode,
                product_name,
                week_start,
                total_quantity_sold,
                total_revenue,
                shops_selling_count,
                avg_price,
                last_updated_at
              )
              VALUES ($1, $2, $3, $4, $5, 1, $6, CURRENT_TIMESTAMP)
              ON CONFLICT (barcode, week_start) DO UPDATE SET
                product_name = EXCLUDED.product_name,
                total_quantity_sold = trending_products.total_quantity_sold + EXCLUDED.total_quantity_sold,
                total_revenue = trending_products.total_revenue + EXCLUDED.total_revenue,
                shops_selling_count = trending_products.shops_selling_count + 1,
                avg_price = (trending_products.total_revenue + EXCLUDED.total_revenue) / 
                           (trending_products.total_quantity_sold + EXCLUDED.total_quantity_sold),
                last_updated_at = CURRENT_TIMESTAMP
            `, [
              product.barcode,
              product.name,
              weekStart,
              product.quantity_sold || 0,
              product.revenue || 0,
              product.revenue && product.quantity_sold ? (product.revenue / product.quantity_sold) : 0
            ]);
          }
        }
      }
      
      // Update master products with sales data
      if (analyticsData.top_selling_products && analyticsData.top_selling_products.length > 0) {
        for (const product of analyticsData.top_selling_products) {
          if (product.barcode) {
            await client.query(`
              UPDATE master_products
              SET 
                total_quantity_sold = total_quantity_sold + $1,
                total_revenue = total_revenue + $2,
                last_updated_at = CURRENT_TIMESTAMP
              WHERE barcode = $3
            `, [
              product.quantity_sold || 0,
              product.revenue || 0,
              product.barcode
            ]);
          }
        }
      }
      
      await client.query('COMMIT');
      
      console.log(`✅ Analytics sync completed for ${licenseKey}`);
      
      return NextResponse.json({ 
        success: true,
        message: 'Analytics synced successfully',
        date: analyticsData.date
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Analytics sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync analytics', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to get week start date (Monday)
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  const weekStart = new Date(d.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart.toISOString().split('T')[0];
}
