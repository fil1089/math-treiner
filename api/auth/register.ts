import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, setCors } from '../_db.js';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password, username } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }

    try {
        const sql = await getDb();

        // Check if user already exists
        const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await sql`
      INSERT INTO users (email, password, username)
      VALUES (${email}, ${hashedPassword}, ${username || email.split('@')[0]})
      RETURNING id, email, username
    `;

        return res.status(201).json({
            message: 'User registered successfully',
            user: result[0]
        });
    } catch (err: any) {
        console.error('Register error:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}
