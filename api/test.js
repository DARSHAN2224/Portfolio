export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Test API endpoint is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    vercel: !!process.env.VERCEL
  });
}
