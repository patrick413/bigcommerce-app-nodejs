import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch'; // Use node-fetch for server-side fetch

export default async function list(req: NextApiRequest, res: NextApiResponse) {
  try {
    const TYPESENSE_API_KEY = 'vGPHLrIXYiHQ3Y9WZgrOaTcANO6HWGoP'; 
    const API_URL = 'https://iengdc540q3ufa7vp-1.a1.typesense.net/collections/ss_dev_products/documents/export';
    
    // Set the request headers
    const headers = {
      'X-TYPESENSE-API-KEY': TYPESENSE_API_KEY,
    };

    // Make the GET request to Typesense
    const response = await fetch(API_URL, {
      method: 'GET',
      headers,
    });

    // If the status code is not in the range 200-299, throw an error
    res.status(200).json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
