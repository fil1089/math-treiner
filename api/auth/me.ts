import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, setCors } from '../_db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Auth token missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
        const sql = await getDb();

        // Fetch the latest user info
        const user = await sql`SELECT id, email, username, total_score, level, avatar_id FROM users WHERE id = ${decoded.userId}`;
        if (user.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        return res.status(200).json({
            user: user[0]
        });
    } catch (err: any) {
        console.error('Auth verification error:', err);
        return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
    }
}
