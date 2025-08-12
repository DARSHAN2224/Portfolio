// Admin Security Configuration
// ⚠️ IMPORTANT: Change these settings for production use!

export const ADMIN_CONFIG = {
  // Password for admin access (change this!)
  PASSWORD: 'darshan2024',
  
  // Session timeout in milliseconds (30 minutes)
  SESSION_TIMEOUT: 30 * 60 * 1000,
  
  // Maximum login attempts before lockout
  MAX_LOGIN_ATTEMPTS: 5,
  
  // Lockout duration in milliseconds (15 minutes)
  LOCKOUT_DURATION: 15 * 60 * 1000,
  
  // Activity check interval in milliseconds (1 minute)
  ACTIVITY_CHECK_INTERVAL: 60 * 1000,
};

// Security recommendations:
// 1. Use a strong, unique password
// 2. Consider implementing 2FA for production
// 3. Use environment variables for sensitive data
// 4. Implement rate limiting on the server side
// 5. Log all admin activities for audit purposes
