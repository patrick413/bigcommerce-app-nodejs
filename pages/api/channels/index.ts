import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../lib/auth';

export default async function channel(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { accessToken, storeHash } = await getSession(req);
        const response = await fetch(`https://api.bigcommerce.com/stores/${storeHash}/v3/channels/1/metafields`, {
            method: 'GET',
            headers: {
                'X-Auth-Token': accessToken,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json(); 
        const value = data?.data?.find((config) => {
            return(config.key == "Search Configuration" && config.namespace == "Four13" )
        })
        if (!value) {
            const defaultValue = {
                key: 'Search Configuration',
                namespace: 'Four13',
                permission_set: 'write_and_sf_access',
                value: JSON.stringify(
                    {
                        position: { value: "right", content: "Right" },
                        view: { value: "full", content: "Full" },
                        placeholder: "Search",
                        bgColor: "#3C64F4",
                        borderColor: "#3C64F4",
                        filter: true,
                        categories: true,
                        prodDescription: true,
                        displayPrice: true,
                        hitsPerPage: 20,
                        searchAttributes: {
                            sku: {isActive: false, sort: 'Ordered' },
                            parentSku: { isActive: false, sort: 'Ordered' },
                            name: {isActive: false, sort: 'Ordered' },
                            'options.value': {isActive: false, sort: 'Ordered' },
                            description: { isActive: false, sort: 'Ordered' },
                            categories: {isActive: false, sort: 'Ordered' },
                        }
                    })
            }
            const postResponse  = await fetch(`https://api.bigcommerce.com/stores/${storeHash}/v3/channels/1/metafields`, {
                method: 'POST',
                headers: {
                    'X-Auth-Token': accessToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(defaultValue)
            });

            if (!postResponse .ok) {
                throw new Error('Failed to fetch data');
            }

            return await postResponse.json(); 
        }
        res.status(200).json(value);
    } catch (error) {
        const errorMessage = error.message || 'Internal Server Error';
        const status = error.response?.status || 500;

        console.error(errorMessage); // Log the error message for debugging
        res.status(status).json({ error: errorMessage });
    }
}
