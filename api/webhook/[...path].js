export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the path from the request
    const path = req.query.path || [];
    const webhookPath = Array.isArray(path) ? path.join('/') : path;
    
    // Construct the full URL to the n8n webhook
    const targetUrl = `https://fetii.app.n8n.cloud/webhook/${webhookPath}`;
    
    // Forward the request to n8n
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers['x-instance-id'] && { 'X-Instance-Id': req.headers['x-instance-id'] }),
      },
      body: JSON.stringify(req.body),
    });

    // Get the response data
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { output: text, message: text };
      }
    }
    
    // Return the response with the same status code
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Webhook proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

