const csvtojson = require('csvtojson')
const TYPESENSE_API_KEY = 'vGPHLrIXYiHQ3Y9WZgrOaTcANO6HWGoP'; 
const API_URL = 'https://iengdc540q3ufa7vp-1.a1.typesense.net/collections';


// Define a fetcher function to make the API request
export async function collectionUpdate(collection, id = 'export', method = 'GET', body) {
    if (!['GET', 'POST', 'PATCH'].includes(method.toUpperCase())) {
        throw new Error('Invalid HTTP method');
    }
    
    const response = await fetch(`${API_URL}/${collection}/documents/${id}`, {
        method: method,
        headers: {
        'X-TYPESENSE-API-KEY': TYPESENSE_API_KEY,
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    const res = await response.json();
    return res;
};

export async function collectionChecker(url, apiKey) {
    const response = await fetch(`${url}/collections`, {
    method: 'GET',
    headers: {
        'X-TYPESENSE-API-KEY': apiKey,
    },
    });

    return response
}