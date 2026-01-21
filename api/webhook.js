module.exports = async (req, res) => {
  console.log('=== WEBHOOK CALLED ===');
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body type:', typeof req.body);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  // ALWAYS return 200 immediately
  res.status(200).json({ 
    received: true,
    message: 'Webhook received successfully' 
  });
  
  console.log('✅ Response sent to Wix');
};