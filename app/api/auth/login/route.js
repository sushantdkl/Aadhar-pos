import { NextResponse } from 'next/server';
import db, { initializeDatabase } from '@/lib/db';
import { hashPassword, verifyPassword, generateToken } from '@/lib/auth';

// Initialize database and create default admin
initializeDatabase();

const createDefaultAdmin = () => {
  try {
    const existing = db.prepare('SELECT * FROM admin_users WHERE username = ?').get('admin');
    if (!existing) {
      const stmt = db.prepare(`
        INSERT INTO admin_users (username, password_hash, full_name, email, role)
        VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run('admin', hashPassword('admin123'), 'Super Admin', 'admin@pos.com', 'superadmin');
      console.log('✅ Default admin created: admin / admin123');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

createDefaultAdmin();

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);

    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken(user);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
