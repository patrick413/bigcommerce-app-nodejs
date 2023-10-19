import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../lib/auth';

export default async function channel(req: NextApiRequest, res: NextApiResponse) {
    
    try {
        const value = {
            key: 'Search Configuration',
            namespace: 'Four13',
            permission_set: 'write_and_sf_access',
            value: JSON.stringify(
                {
                    position: { value: "right", content: "Right" },
                    view: { value: "full", content: "Full" },
                    placeholder: "Search",
                    bgColor: "#B8ACF2",
                    borderColor: "#B8ACF2",
                    filter: true,
                    categories: true,
                    prodDescription: true,
                    displayPrice: true
                })
        }
        const { accessToken, storeHash } = await getSession(req);
        const response = await fetch(`https://api.bigcommerce.com/stores/${storeHash}/v3/channels/1/metafields`, {
            method: 'POST',
            headers: {
                'X-Auth-Token': accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(value)
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json(); 
        res.status(200).json(data);
    } catch (error) {
        const errorMessage = error.message || 'Internal Server Error';
        const status = error.response?.status || 500;

        console.error(errorMessage); // Log the error message for debugging
        res.status(status).json({ error: errorMessage });
    }
}
