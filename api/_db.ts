import { neon } from '@neondatabase/serverless';
import { VercelResponse } from '@vercel/node';

export async function getDb() {
    // Priority: DATABASE_URL_NEW (New project), then DATABASE_URL (Old project)
    const url = process.env.DATABASE_URL_NEW || process.env.DATABASE_URL;
    if (!url) {
        throw new Error('Database connection URL not found (DATABASE_URL_NEW or DATABASE_URL)');
    }
    return neon(url);
}

// CORS Helper for Vercel
export function setCors(res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );
}
