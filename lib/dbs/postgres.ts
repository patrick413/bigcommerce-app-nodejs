import { Pool, PoolConfig } from 'pg';
import { SessionProps } from '../../types';

let POSTGRES_URL;

if (process.env.POSTGRES_URL) {
    POSTGRES_URL = new URL(process.env.POSTGRES_URL);

    if (POSTGRES_URL.href.includes('vercel-storage.com')) {
        POSTGRES_URL.searchParams.set('sslmode', 'require');
        // POSTGRES_URL.searchParams.set('pgbouncer', 'true');
        // POSTGRES_URL.searchParams.set('connection_limit', '10');
        // POSTGRES_URL.searchParams.set('connect_timeout', '10');
    }

    POSTGRES_URL = POSTGRES_URL.href
}

const LOGGING_ENABLED = process.env.ENABLE_LOGGING === 'true';
const POSTGRES_CONFIG: PoolConfig = POSTGRES_URL ? {
    connectionString: POSTGRES_URL,
    // Vercel Postgres has max use of 1 per connection.
    ...(POSTGRES_URL.includes('vercel-storage.com') && { maxUses: 1 })
} : {
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    ...(process.env.POSTGRES_PORT && { port: +process.env.POSTGRES_PORT }),
};

const pool = new Pool(POSTGRES_CONFIG)

// Use setUser for storing global user data (persists between installs)
export async function setUser({ user }: SessionProps) {
    if (!user) return null;

    const { email, id, username } = user;

    await pool.query(`
        INSERT INTO users (user_id, email, username) 
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id) DO
        UPDATE SET email = $2, username = $3
    `, [id, email, username])
}

export async function setStore(session: SessionProps) {
    const { access_token: accessToken, context, scope } = session;
    // Only set on app install or update
    if (!accessToken || !scope) return null;

    const storeHash = context?.split('/')[1] || '';

    await pool.query(`
        INSERT INTO stores (store_hash, access_token, scope) 
        VALUES ($1, $2, $3)
        ON CONFLICT (store_hash) DO
        UPDATE SET access_token = $2, scope = $3
    `, [storeHash, accessToken, scope])
}

// Use setStoreUser for storing store specific variables
export async function setStoreUser(session: SessionProps) {
    const { access_token: accessToken, context, owner, sub, user: { id: userId } } = session;
    if (!userId) return null;

    const contextString = context ?? sub;
    const storeHash = contextString?.split('/')[1] || '';
    const sql = 'SELECT * FROM store_users WHERE user_id = $1 AND store_hash = $2';
    const values = [String(userId), storeHash];
    const storeUser = await pool.query(sql, values);
    // Set admin (store owner) if installing/ updating the app
    // https://developer.bigcommerce.com/api-docs/apps/guide/users
    if (accessToken) {
        // Create a new admin user if none exists
        if (!storeUser.rowCount) {
            await pool.query('INSERT INTO store_users (is_admin, store_hash, user_id) VALUES ($1, $2, $3)', [true, storeHash, userId]);
        } else if (!storeUser.rows[0]?.is_admin) {
            await pool.query('UPDATE store_users SET is_admin = true WHERE user_id = $1 AND store_hash = $2', [userId, storeHash]);
        }
    } else {
        // Create a new user if it doesn't exist (non-store owners added here for multi-user apps)
        if (!storeUser.rowCount) {
            await pool.query('INSERT INTO store_users (is_admin, store_hash, user_id) VALUES ($1, $2, $3)', [owner.id === userId, storeHash, userId]);
        }
    }
}

export async function deleteUser({ context, user, sub }: SessionProps) {
    const contextString = context ?? sub;
    const storeHash = contextString?.split('/')[1] || '';
    const values = [String(user?.id), storeHash];
    await pool.query('DELETE FROM store_users WHERE user_id = $1 AND store_hash = $2', values);
}

export async function hasStoreUser(storeHash: string, userId: string) {
    if (!storeHash || !userId) return false;

    const values = [userId, storeHash];
    const results = await pool.query('SELECT * FROM store_users WHERE user_id = $1 AND store_hash = $2 LIMIT 1', values);

    return results.rowCount > 0;
}

export async function getStoreToken(storeHash: string) {
    if (!storeHash) return null;

    const results = await pool.query('SELECT access_token FROM stores WHERE store_hash = $1', [storeHash]);

    return results.rowCount ? results.rows[0].access_token : null;
}

export async function deleteStore({ store_hash: storeHash }: SessionProps) {
    await pool.query('DELETE FROM stores WHERE store_hash = $1', [storeHash]);
}

// export async function log(message: string, data: any) {
//     if (LOGGING_ENABLED) {
//         await pool.query('INSERT INTO store_logs (message, data) VALUES ($1, $2)', [message, data]);
//     }
// }

// export async function getLogs(page = 1, pageSize = 50, showAll = false) {
//     const start = (page - 1) * pageSize
//     const [count, logs] = await Promise.all([
//         pool.query(`
//             SELECT count(*) FROM store_logs
//             ${ showAll ? "" : "WHERE message = 'Tax estimate failed'" }
//         `),
//         pool.query(`
//             SELECT id, message, data, created_at FROM store_logs
//             ${ showAll ? "" : "WHERE message = 'Tax estimate failed'" }
//             ORDER BY id DESC
//             LIMIT $1 OFFSET $2
//         `, [pageSize, start]),
//     ])

//     const total = count.rows[0]?.count

//     return {
//         data: logs.rows,
//         total: total ?? 0,
//         hasNextPage: (logs.rowCount + (pageSize * page)) < total,
//     }
// }