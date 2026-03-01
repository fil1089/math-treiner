import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, setCors } from '../_db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Auth token missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
        const sql = await getDb();

        const { avatar_id, username, total_score } = req.body;

        if (avatar_id !== undefined) {
            await sql`UPDATE users SET avatar_id = ${avatar_id} WHERE id = ${decoded.userId}`;
        }
        if (username !== undefined) {
            await sql`UPDATE users SET username = ${username} WHERE id = ${decoded.userId}`;
        }
        if (total_score !== undefined) {
            await sql`UPDATE users SET total_score = ${total_score} WHERE id = ${decoded.userId}`;
        }

        const user = await sql`SELECT id, email, username, total_score, level, avatar_id FROM users WHERE id = ${decoded.userId}`;

        return res.status(200).json({
            user: user[0]
        });
    } catch (err: any) {
        console.error('Update error:', err);
        return res.status(400).json({ message: 'Update failed', error: err.message });
    }
}
