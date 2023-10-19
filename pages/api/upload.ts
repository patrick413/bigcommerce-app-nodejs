import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import FormData from 'form-data';
import { WritableStreamBuffer } from 'stream-buffers';


const csvtojson = require('csvtojson')
const TYPESENSE_API_KEY = 'vGPHLrIXYiHQ3Y9WZgrOaTcANO6HWGoP'; 
const API_URL = 'https://iengdc540q3ufa7vp-1.a1.typesense.net/collections';
export const config = {
  api: {
    bodyParser: false,
  },
};
const upload = multer({ dest: 'uploads/' }); 

export default async (req: NextApiRequest & { file: any }, res: NextApiResponse) => {
  try {
    upload.single('csvFile')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(500).json({ error: 'File upload failed' });
      } else if (err) {
        console.error('Unknown error:', err);
        return res.status(500).json({ error: 'File upload failed' });
      }

      const upliadedFile = req.file.path; 
      const collectionName = req.body.collectionName;
      const url = req.body.url;
      const apiKey = req.body.apiKey
      if (!upliadedFile || !collectionName) {
        return res.status(400).json({ error: 'No file uploaded or collection name provided' });
      }
      try {
        const response = await collectionAdd(collectionName, upliadedFile, url, apiKey);
        console.log('File uploaded successfully:', response);
      } catch (error) {
        console.error('Error uploading file to Typesense:', error);
        return res.status(500).json({ error: 'Failed to upload data to Typesense' });
      }

      return res.status(200).json({ message: 'File uploaded successfully' });
    });
  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
async function convertCSVtoJSONL(csvData) {
  if (!csvData) {
    console.error('No CSV data provided');
    return;
  }

  const jsonArray = await csvtojson().fromFile(csvData);

  const jsonlData = jsonArray.map((item) => {
    const variants = item.variants? item.variants.split(',').map((v) => v.trim().replace(/"/g, '')) : [];
    const categories = item.categories ? item.categories.split(',').map((c) => c.trim().replace(/"/g, '')) : [];

    // Create a new object with arrays processed
    const newItem = {
      ...item,
      variants,
      categories,
    };

    return JSON.stringify(newItem);
  }).join('\n') + '\n'; // Add newline at the end

  return jsonlData;
}


export async function collectionAdd(collection, csvData, url, apiKey) {
  try {
    if (!csvData) {
      console.error('No CSV data provided');
      return;
    }
    // Convert CSV data to JSONL
    const jsonlData = await convertCSVtoJSONL(csvData);
    
    const bufferStream = new WritableStreamBuffer();
    
    bufferStream.write(jsonlData);
    bufferStream.end();
      
    const formData = new FormData();
    
    formData.append('file', bufferStream.getContents(), 'data.jsonl');
    const response = await fetch(`${url}/collections/${collection}/documents/import?action=create`, {
      method: 'POST',
      headers: {
        'X-TYPESENSE-API-KEY': apiKey,
        ...formData.getHeaders(),
      },
      body: formData.getBuffer(),
    });

    if (!response.ok) {
        throw new Error('Failed to upload data to Typesense');
    }
    const responseText = await response.text();
    return responseText;
  } catch (error) {
    throw error;
  }
}
