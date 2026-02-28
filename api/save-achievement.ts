import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './db.js';

export default async function handler(
    request: VercelRequest,
    res: VercelResponse,
) {
    if (request.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId, title } = request.body;

    if (!userId || !title) {
        return res.status(400).json({ error: 'Missing userId or title' });
    }

    try {
        // Ensure user exists first
        await sql`
      INSERT INTO users (id) 
      VALUES (${userId}) 
      ON CONFLICT (id) DO NOTHING
    `;

        // Save achievement
        await sql`
      INSERT INTO achievements (user_id, title) 
      VALUES (${userId}, ${title})
    `;

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error saving achievement:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
