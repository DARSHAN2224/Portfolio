import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/darshan-os',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key-change-in-production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // LLAMA AI Configuration
  llama: {
    apiUrl: process.env.LLAMA_API_URL || 'http://localhost:11434/api/generate',
    model: process.env.LLAMA_MODEL || 'llama2',
    apiKey: process.env.LLAMA_API_KEY || null, // Some providers require API keys
  },

  // API Timeouts
  requestTimeout: 30000, // 30 seconds
};

export default config;
