import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, setCors } from '../_db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }

    try {
        const sql = await getDb();

        const user = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (user.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Exclude password from the user object in the response
        const { password: _, ...userWithoutPassword } = user[0];

        const token = jwt.sign(
            { userId: user[0].id, email: user[0].email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            message: 'Logged in successfully',
            token,
            user: userWithoutPassword
        });
    } catch (err: any) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}
