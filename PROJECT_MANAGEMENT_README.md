# Project Management System

This document explains the enhanced project management functionality that allows you to create, edit, and manage projects with automatic folder creation and image uploads.

## 🚀 Features

### ✨ Automatic Folder Creation
- When you create a new project, the system automatically creates a dedicated folder for that project
- Each project gets its own folder: `public/images/projects/{project-id}/`
- Project folders are automatically deleted when projects are removed

### 📸 Image Management
- **File Upload**: Upload images directly from your computer
- **Multiple Images**: Support for multiple images per project
- **Image Carousel**: Images are displayed in an interactive carousel on the frontend
- **Image Deletion**: Remove individual images from projects
- **Manual URLs**: Option to add image URLs manually

### 🔐 Secure Admin Panel
- Password-protected admin access
- Session management with automatic timeout
- Brute-force protection with account lockout
- Real-time activity tracking

### 💾 Data Persistence
- Projects are saved to `data/projects.json`
- Images are stored in project-specific folders
- Data persists between server restarts

## 🛠️ How to Use

### 1. Accessing the Admin Panel
1. Click the floating admin button (shield icon) in the bottom-right corner
2. Enter the admin password (default: `darshan2024`)
3. Navigate to the "Projects" tab

### 2. Creating a New Project
1. Click "Add New Project"
2. Fill in the project details:
   - **Title**: Project name
   - **Impact Statement**: Brief description of the project's impact
   - **Tags**: Comma-separated technology tags
   - **GitHub URL**: Link to the project repository
   - **Demo URL**: Optional link to live demo
3. **Add Images**:
   - **Option A**: Upload files directly using the file input
   - **Option B**: Add image URLs manually (one per line)
4. Click "Save" to create the project and its folder

### 3. Managing Project Images
- **Upload**: Select an image file and click "Upload"
- **View**: Current images are displayed in a grid
- **Delete**: Hover over an image and click the red X button
- **Manual URLs**: Add external image URLs in the textarea

### 4. Editing Projects
1. Click the edit button (pencil icon) next to any project
2. Modify the project details
3. Add or remove images as needed
4. Click "Save" to update the project

### 5. Deleting Projects
1. Click the delete button (trash icon) next to any project
2. Confirm the deletion
3. The project folder and all images will be automatically removed

## 📁 Folder Structure

```
public/
├── images/
│   └── projects/
│       ├── project-1/
│       │   ├── screenshot1.jpg
│       │   └── screenshot2.jpg
│       ├── project-2/
│       │   ├── dashboard.jpg
│       │   └── hardware.jpg
│       └── project-3/
│           ├── homepage.jpg
│           ├── product-page.jpg
│           └── admin-dashboard.jpg
data/
└── projects.json
```

## 🔧 Technical Details

### Backend API Endpoints

#### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create/update a project
- `DELETE /api/projects/:id` - Delete a project and its folder

#### Images
- `POST /api/projects/:id/images` - Upload an image for a project
- `GET /api/projects/:id/images` - Get all images for a project
- `DELETE /api/projects/:id/images/:filename` - Delete a specific image

### Frontend Integration
- Projects are loaded from the server on page load
- Real-time updates when projects are modified
- Image carousel with navigation arrows and dots
- Loading states and error handling

### Security Features
- **Password Protection**: Admin panel requires authentication
- **Session Management**: Automatic logout after inactivity
- **Brute Force Protection**: Account lockout after failed attempts
- **Input Validation**: Server-side validation of all data
- **File Type Validation**: Only image files can be uploaded

## 🎨 Frontend Display

### Project Cards
- **Image Carousel**: Multiple images with navigation
- **Tech Stack**: Tags displayed as badges
- **Links**: GitHub and demo URLs
- **Responsive**: Works on all screen sizes

### Image Carousel Features
- **Navigation Arrows**: Previous/next buttons
- **Dot Indicators**: Click to jump to specific image
- **Image Counter**: Shows current position
- **Hover Effects**: Smooth transitions and overlays
- **Fallback**: Placeholder for missing images

## 🔒 Security Configuration

The admin panel security settings are configured in `src/config/admin.ts`:

```typescript
export const ADMIN_CONFIG = {
  PASSWORD: 'darshan2024',           // Change this!
  SESSION_TIMEOUT: 30 * 60 * 1000,   // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,             // Max failed attempts
  LOCKOUT_DURATION: 15 * 60 * 1000,  // 15 minutes lockout
  ACTIVITY_CHECK_INTERVAL: 60 * 1000, // 1 minute checks
};
```

## 🚀 Getting Started

1. **Start the server**:
   ```bash
   npm run dev:all
   ```

2. **Access the admin panel**:
   - Click the floating admin button
   - Enter password: `darshan2024`

3. **Create your first project**:
   - Go to Projects tab
   - Click "Add New Project"
   - Fill in details and upload images
   - Click Save

4. **View your projects**:
   - Projects will appear on the main portfolio page
   - Images will display in the carousel

## 📝 Best Practices

### Image Management
- **File Formats**: Use JPG, PNG, GIF, or WebP
- **File Sizes**: Keep images under 5MB for fast loading
- **Dimensions**: Use consistent aspect ratios (16:9 recommended)
- **Naming**: Use descriptive filenames

### Project Organization
- **Clear Titles**: Use descriptive project names
- **Impact Statements**: Focus on measurable outcomes
- **Relevant Tags**: Include key technologies used
- **Quality Images**: Use high-quality screenshots

### Security
- **Change Password**: Update the default admin password
- **Regular Backups**: Backup the `data/projects.json` file
- **Monitor Activity**: Check admin panel logs regularly

## 🔧 Troubleshooting

### Common Issues

**Images not loading**:
- Check file paths in `data/projects.json`
- Ensure images exist in the correct project folders
- Verify file permissions

**Admin panel not working**:
- Check if the server is running (`npm run dev:all`)
- Verify the password in `src/config/admin.ts`
- Clear browser cache and try again

**Upload failures**:
- Check file size (max 10MB)
- Ensure file is an image format
- Verify server has write permissions

### Error Messages

- **"SMTP_NOT_CONFIGURED"**: Email service not set up (not related to projects)
- **"Failed to save project"**: Check server logs for details
- **"Image upload failed"**: Verify file format and size

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify the server is running properly
3. Check file permissions and folder structure
4. Review the troubleshooting section above

---

**Note**: This system replaces the previous static project data with a dynamic, server-backed solution that provides full CRUD operations for projects with automatic folder management and image handling.
