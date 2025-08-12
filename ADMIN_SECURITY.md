# 🔒 Admin Panel Security Guide

## Overview

Your portfolio admin panel now includes comprehensive security features to protect your content management system from unauthorized access.

## 🛡️ Security Features Implemented

### 1. **Password Authentication**
- **Default Password**: `darshan2024` (⚠️ **CHANGE THIS IMMEDIATELY**)
- **Password Field**: Hidden by default with show/hide toggle
- **Enter Key Support**: Press Enter to login

### 2. **Brute Force Protection**
- **Maximum Attempts**: 5 failed login attempts
- **Lockout Duration**: 15 minutes after max attempts
- **Attempt Counter**: Shows remaining attempts
- **Auto Reset**: Lockout automatically expires

### 3. **Session Management**
- **Session Timeout**: 30 minutes of inactivity
- **Activity Tracking**: Monitors user interactions
- **Auto Logout**: Automatic logout on timeout
- **Session Status**: Shows last activity time

### 4. **Visual Security Indicators**
- **Secure Session Badge**: Shows when authenticated
- **Lockout Warnings**: Clear lockout status display
- **Activity Timer**: Real-time session status
- **Security Icons**: Shield and lock indicators

## 🔧 Configuration

### Changing the Admin Password

1. **Open the config file**:
   ```bash
   src/config/admin.ts
   ```

2. **Update the password**:
   ```typescript
   export const ADMIN_CONFIG = {
     PASSWORD: 'your-new-secure-password', // Change this!
     // ... other settings
   };
   ```

3. **Security recommendations for passwords**:
   - Use at least 12 characters
   - Include uppercase, lowercase, numbers, and symbols
   - Avoid common words or patterns
   - Don't reuse passwords from other accounts

### Adjusting Security Settings

You can modify these settings in `src/config/admin.ts`:

```typescript
export const ADMIN_CONFIG = {
  PASSWORD: 'your-password',
  SESSION_TIMEOUT: 30 * 60 * 1000,        // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,                   // 5 attempts
  LOCKOUT_DURATION: 15 * 60 * 1000,       // 15 minutes
  ACTIVITY_CHECK_INTERVAL: 60 * 1000,     // 1 minute
};
```

## 🚨 Security Best Practices

### For Development
1. **Change Default Password**: Immediately change `darshan2024`
2. **Use Strong Passwords**: Follow password guidelines above
3. **Test Security Features**: Verify lockout and timeout work
4. **Keep Config Secure**: Don't commit passwords to version control

### For Production
1. **Environment Variables**: Move password to `.env` file
2. **HTTPS Only**: Ensure admin panel runs over HTTPS
3. **Rate Limiting**: Implement server-side rate limiting
4. **Audit Logging**: Log all admin activities
5. **2FA Consideration**: Add two-factor authentication
6. **Regular Updates**: Keep dependencies updated

## 🔐 Advanced Security Options

### Environment Variable Setup (Recommended)

1. **Create `.env` file**:
   ```env
   ADMIN_PASSWORD=your-super-secure-password
   ```

2. **Update config**:
   ```typescript
   export const ADMIN_CONFIG = {
     PASSWORD: process.env.ADMIN_PASSWORD || 'fallback-password',
     // ... other settings
   };
   ```

3. **Add to `.gitignore`**:
   ```gitignore
   .env
   .env.local
   ```

### Two-Factor Authentication (Future Enhancement)

Consider implementing 2FA using:
- TOTP (Time-based One-Time Password)
- SMS verification
- Email verification
- Hardware security keys

## 🚀 Usage Instructions

### Accessing the Admin Panel
1. Click the **Shield icon** in the bottom-right corner
2. Enter your admin password
3. Press Enter or click Login
4. Manage your portfolio content

### During Active Session
- **Session Status**: Shows "Secure Session" badge
- **Activity Timer**: Displays last activity time
- **Auto Logout**: Session expires after 30 minutes of inactivity
- **Manual Logout**: Click the logout button anytime

### Security Notifications
- **Login Success**: "Access Granted" toast
- **Login Failure**: Shows remaining attempts
- **Account Locked**: Clear lockout message with countdown
- **Session Expired**: Automatic logout notification

## 🔍 Troubleshooting

### Common Issues

**"Account Locked" Message**
- Wait for the lockout period to expire (15 minutes)
- The system will automatically unlock

**"Session Expired" Message**
- Simply log in again
- Sessions expire after 30 minutes of inactivity

**Forgot Password**
- Check your `src/config/admin.ts` file
- Reset the password in the configuration

### Security Concerns

**Password in Code**
- Move to environment variables for production
- Never commit passwords to version control

**Session Security**
- Sessions are client-side only
- Consider server-side sessions for production
- Implement proper CSRF protection

## 📋 Security Checklist

- [ ] Change default password (`darshan2024`)
- [ ] Use strong, unique password
- [ ] Test lockout functionality
- [ ] Verify session timeout
- [ ] Set up environment variables (production)
- [ ] Enable HTTPS (production)
- [ ] Review security logs (production)
- [ ] Regular security updates

## 🆘 Emergency Access

If you're locked out and need immediate access:

1. **Stop the development server**
2. **Edit the config file**:
   ```typescript
   // Temporarily reset password
   PASSWORD: 'emergency-access-2024',
   ```
3. **Restart the server**
4. **Login with emergency password**
5. **Change to a new secure password**
6. **Remove emergency password**

---

**⚠️ IMPORTANT**: This is a frontend-only security implementation. For production use, implement proper server-side authentication and authorization systems.

**🔒 Security is an ongoing process. Regularly review and update your security measures!**
