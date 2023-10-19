import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../lib/auth';

export default async function channel(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { accessToken, storeHash } = await getSession(req);
        const response = await fetch(`https://tranzetta-v2-backend-dev.four13.co/api/tranzetta/${storeHash}/getTypesenseAccount`, {
            method: 'POST',
            headers: {
                'Authorization': "Bearer tranzettaTypeSenseAccount",
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        res.json(await response.json());
    } catch (error) {
        const errorMessage = error.message || 'Internal Server Error';
        const status = error.response?.status || 500;

        console.error(errorMessage); // Log the error message for debugging
        res.status(status).json({ error: errorMessage });
    }
}
