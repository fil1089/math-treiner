import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, setCors } from '../_db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { identifier } = req.body;

    if (!identifier) {
        return res.status(400).json({ message: 'Email, phone or nickname required' });
    }

    try {
        const sql = await getDb();

        // Diagnostic: Check if columns exist
        const columns = await sql`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'users'
        `;
        const colNames = columns.map((c: any) => c.column_name);
        console.log('Available columns in users table:', colNames);

        if (!colNames.includes('phone') || !colNames.includes('email') || !colNames.includes('username')) {
            return res.status(500).json({
                message: 'Database schema mismatch',
                error: `Missing columns. Found: ${colNames.join(', ')}`,
                hint: 'Please run update_db.sql in your Neon SQL Editor.'
            });
        }

        // Attempt to find user by email, phone, or username
        let user = await sql`
      SELECT * FROM users 
      WHERE email = ${identifier} 
         OR phone = ${identifier} 
         OR username = ${identifier}
    `;

        if (user.length === 0) {
            // Auto-register new user
            let email: string | null = null;
            let phone: string | null = null;
            let username: string | null = null;

            if (identifier.includes('@')) {
                email = identifier;
                username = identifier.split('@')[0];
            } else if (/^\+?[\d\s-]{7,}$/.test(identifier)) {
                phone = identifier.replace(/[^\d+]/g, '');
                username = `User_${phone.slice(-4)}`;
            } else {
                username = identifier;
            }

            // Check for username conflicts
            const existingName = await sql`SELECT id FROM users WHERE username = ${username}`;
            if (existingName.length > 0) {
                username = `${username}_${Math.floor(Math.random() * 1000)}`;
            }

            const newUser = await sql`
        INSERT INTO users (email, phone, username)
        VALUES (${email}, ${phone}, ${username})
        RETURNING *
      `;
            user = newUser;
        }

        // Exclude password if it exists
        const { password: _, ...userWithoutPassword } = user[0];

        const token = jwt.sign(
            { userId: user[0].id, username: user[0].username },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        return res.status(200).json({
            message: 'Logged in successfully',
            token,
            user: userWithoutPassword
        });
    } catch (err: any) {
        console.error('Flexible login error full detail:', err);
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message,
            detail: err.detail || err.hint || 'No extra detail'
        });
    }
}
