export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Use GET method' });
  }

  try {
    const { instanceId } = req.query;

    if (!instanceId) {
      return res.status(400).json({ 
        error: 'Missing instanceId parameter',
        example: '/api/get-email?instanceId=YOUR_ID'
      });
    }

    // Get OAuth token
    const tokenResponse = await fetch('https://www.wixapis.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: process.env.WIX_APP_ID,
        client_secret: process.env.WIX_APP_SECRET,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get instance data
    const instanceResponse = await fetch(
      'https://www.wixapis.com/apps/v1/instance',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!instanceResponse.ok) {
      throw new Error('Failed to get instance data');
    }

    const instanceData = await instanceResponse.json();

    return res.status(200).json({
      success: true,
      email: instanceData.site?.ownerInfo?.email,
      siteId: instanceData.site?.siteId,
      instanceId: instanceData.instance?.instanceId,
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}