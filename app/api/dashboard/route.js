import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // Get total restaurants
    const totalRestaurants = db.prepare('SELECT COUNT(*) as count FROM restaurants').get().count;
    
    // Get active licenses
    const activeLicenses = db.prepare(`
      SELECT COUNT(*) as count FROM licenses 
      WHERE status = 'active' AND date(expiry_date) >= date('now')
    `).get().count;
    
    // Get expiring soon (within 7 days)
    const expiringSoon = db.prepare(`
      SELECT COUNT(*) as count FROM licenses 
      WHERE status = 'active' 
      AND date(expiry_date) BETWEEN date('now') AND date('now', '+7 days')
    `).get().count;
    
    // Get expired licenses
    const expired = db.prepare(`
      SELECT COUNT(*) as count FROM licenses 
      WHERE date(expiry_date) < date('now')
    `).get().count;
    
    // Get monthly revenue (last 30 days)
    const monthlyRevenue = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM payments 
      WHERE payment_status = 'completed'
      AND date(payment_date) >= date('now', '-30 days')
    `).get().total;
    
    // Get recent restaurants
    const recentRestaurants = db.prepare(`
      SELECT r.*, l.license_key, l.expiry_date, l.status as license_status
      FROM restaurants r
      LEFT JOIN licenses l ON r.id = l.restaurant_id AND l.status = 'active'
      ORDER BY r.created_at DESC
      LIMIT 5
    `).all();
    
    // Get revenue by month (last 6 months)
    const revenueByMonth = db.prepare(`
      SELECT 
        strftime('%Y-%m', payment_date) as month,
        SUM(amount) as revenue
      FROM payments
      WHERE payment_status = 'completed'
      AND date(payment_date) >= date('now', '-6 months')
      GROUP BY month
      ORDER BY month
    `).all();

    return NextResponse.json({
      stats: {
        totalRestaurants,
        activeLicenses,
        expiringSoon,
        expired,
        monthlyRevenue
      },
      recentRestaurants,
      revenueByMonth
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
