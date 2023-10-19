import { NextApiRequest, NextApiResponse } from 'next';
import { bigcommerceClient, getSession } from '../../../lib/auth';

export default async function channels(req: NextApiRequest, res: NextApiResponse) {
    const {
        body,
        query: {cid},
        method,
    } = req;

    switch (method) {
        case 'PUT':
            try {
                const { accessToken, storeHash } = await getSession(req);
                const response = await fetch(`https://api.bigcommerce.com/stores/${storeHash}/v3/channels/1/metafields/${cid}`, {
                    method: 'PUT',
                    headers: {
                        'X-Auth-Token': accessToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json(); 
                res.status(200).json(data);
            } catch (error) {
                const { message, response } = error;
                res.status(response?.status || 500).json({ message });
            }
            break;
        
        case 'POST':
            try {
                const { accessToken, storeHash } = await getSession(req);
                const bigcommerce = bigcommerceClient(accessToken, storeHash);

                const { data } = await bigcommerce.put(`/catalog/products/${pid}`, body);
                res.status(200).json(data);
            } catch (error) {
                const { message, response } = error;
                res.status(response?.status || 500).json({ message });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }


}
