import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Settings, Database, FileText, Award, Lock, Eye, EyeOff, Shield, Upload, Image as ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Project, Achievement, Experience, achievementsData, experienceData } from '@/lib/data';
import { ADMIN_CONFIG } from '@/config/admin';

interface AdminState {
  projects: Project[];
  achievements: Achievement[];
  experiences: Experience[];
}

export const Admin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [lastActivity, setLastActivity] = useState(0);
  const [activeTab, setActiveTab] = useState<'projects' | 'achievements' | 'experiences'>('projects');
  const [data, setData] = useState<AdminState>({
    projects: [],
    achievements: achievementsData,
    experiences: experienceData,
  });
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { toast } = useToast();

  // Load projects from server on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const result = await response.json();
      
      if (result.ok) {
        setData(prev => ({
          ...prev,
          projects: result.projects || []
        }));
      } else {
        console.error('Failed to load projects:', result.error);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    }
  };

  // Check session timeout on mount and activity
  useEffect(() => {
    const checkSession = () => {
      const now = Date.now();
      if (isAuthenticated && (now - lastActivity) > ADMIN_CONFIG.SESSION_TIMEOUT) {
        handleLogout('Session expired due to inactivity');
      }
    };

    const interval = setInterval(checkSession, ADMIN_CONFIG.ACTIVITY_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [isAuthenticated, lastActivity]);

  // Update last activity on user interaction
  useEffect(() => {
    if (isAuthenticated) {
      setLastActivity(Date.now());
    }
  }, [isAuthenticated, data, editingItem, activeTab]);

  // Check lockout status
  useEffect(() => {
    if (isLocked) {
      const now = Date.now();
      if (now > lockoutTime) {
        setIsLocked(false);
        setLoginAttempts(0);
      }
    }
  }, [isLocked, lockoutTime]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleLogin = () => {
    if (isLocked) {
      toast({
        title: "Account Locked",
        description: "Too many failed attempts. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    if (password === ADMIN_CONFIG.PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
      setLoginAttempts(0);
      setLastActivity(Date.now());
      toast({
        title: "Access Granted",
        description: "Welcome to the admin panel!",
      });
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= ADMIN_CONFIG.MAX_LOGIN_ATTEMPTS) {
        setIsLocked(true);
        setLockoutTime(Date.now() + ADMIN_CONFIG.LOCKOUT_DURATION);
        toast({
          title: "Account Locked",
          description: `Too many failed attempts. Account locked for ${ADMIN_CONFIG.LOCKOUT_DURATION / 60000} minutes.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Access Denied",
          description: `Invalid password. ${ADMIN_CONFIG.MAX_LOGIN_ATTEMPTS - newAttempts} attempts remaining.`,
          variant: "destructive",
        });
      }
    }
  };

  const handleLogout = (reason?: string) => {
    setIsAuthenticated(false);
    setPassword('');
    setEditingItem(null);
    setIsAdding(false);
    setSelectedImage(null);
    toast({
      title: "Logged Out",
      description: reason || "You have been logged out.",
    });
  };

  const handleAdd = (type: keyof AdminState) => {
    if (!isAuthenticated) return;
    setIsAdding(true);
    setEditingItem({
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0],
      ...(type === 'projects' && { 
        images: [],
        showDemoButton: true,
        showGithubButton: true
      }),
    });
  };

  const handleEdit = (item: any) => {
    if (!isAuthenticated) return;
    setEditingItem({ ...item });
    setIsAdding(false);
  };

  const handleDelete = async (type: keyof AdminState, id: string) => {
    if (!isAuthenticated) return;
    
    if (type === 'projects') {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        
        if (result.ok) {
          await loadProjects(); // Reload projects from server
          toast({
            title: "Project Deleted",
            description: "Project and its folder have been removed successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete project",
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete project",
          variant: "destructive",
        });
      }
    } else {
      // Handle other types locally for now
      setData(prev => ({
        ...prev,
        [type]: prev[type].filter(item => item.id !== id)
      }));
      toast({
        title: "Item Deleted",
        description: "Item has been removed successfully.",
      });
    }
  };

  const handleSave = async (type: keyof AdminState) => {
    if (!isAuthenticated || !editingItem) return;

    setIsLoading(true);

    try {
      if (type === 'projects') {
        // Save project to server
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingItem),
        });

        const result = await response.json();
        
        if (result.ok) {
          await loadProjects(); // Reload projects from server
          toast({
            title: isAdding ? "Project Added" : "Project Updated",
            description: `Project has been ${isAdding ? 'added' : 'updated'} successfully. Folder created: ${result.projectFolder}`,
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to save project",
            variant: "destructive",
          });
          return;
        }
      } else {
        // Handle other types locally for now
        if (isAdding) {
          setData(prev => ({
            ...prev,
            [type]: [...prev[type], editingItem]
          }));
          toast({
            title: "Item Added",
            description: "New item has been added successfully.",
          });
        } else {
          setData(prev => ({
            ...prev,
            [type]: prev[type].map(item => 
              item.id === editingItem.id ? editingItem : item
            )
          }));
          toast({
            title: "Item Updated",
            description: "Item has been updated successfully.",
          });
        }
      }
      
      setEditingItem(null);
      setIsAdding(false);
      setSelectedImage(null);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAdding(false);
    setSelectedImage(null);
  };

  const handleImageUpload = async () => {
    if (!selectedImage || !editingItem?.id) return;

    try {
      setIsLoading(true);
      
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target?.result as string;
        const filename = selectedImage.name;
        
        const response = await fetch(`/api/projects/${editingItem.id}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.NODE_ENV === 'production' || true
              ? { Authorization: `Bearer ${import.meta.env.VITE_ADMIN_API_TOKEN || ''}` }
              : {}),
          },
          body: JSON.stringify({ imageData, filename }),
        });

        const result = await response.json();
        
        if (result.ok) {
          // Add the new image URL to the project
          const newImg = { url: result.imageUrl as string, alt: '' };
          const updatedImages = [
            ...((editingItem.images as Array<{ url: string; alt?: string }>) || []),
            newImg,
          ];
          setEditingItem({ ...editingItem, images: updatedImages });
          
          toast({
            title: "Image Uploaded",
            description: "Image has been uploaded successfully.",
          });
          
          setSelectedImage(null);
        } else {
          toast({
            title: "Upload Failed",
            description: result.error || "Failed to upload image",
            variant: "destructive",
          });
        }
      };
      
      reader.readAsDataURL(selectedImage);
    } catch (err) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageDelete = async (imageUrl: string) => {
    if (!editingItem?.id) return;

    try {
      const filename = imageUrl.split('/').pop();
      const response = await fetch(`/api/projects/${editingItem.id}/images/${filename}`, {
        method: 'DELETE',
        headers: {
          ...(process.env.NODE_ENV === 'production' || true
            ? { Authorization: `Bearer ${import.meta.env.VITE_ADMIN_API_TOKEN || ''}` }
            : {}),
        },
      });

      const result = await response.json();
      
      if (result.ok) {
        const updatedImages = (editingItem.images as Array<{ url: string }>).filter((img) => img.url !== imageUrl);
        setEditingItem({ ...editingItem, images: updatedImages });
        
        toast({
          title: "Image Deleted",
          description: "Image has been removed successfully.",
        });
      } else {
        toast({
          title: "Delete Failed",
          description: result.error || "Failed to delete image",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  // Login Screen
  if (isOpen && !isAuthenticated) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-background rounded-lg shadow-xl w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-blue-600" />
                Admin Authentication
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Enter your admin password to access the portfolio management panel
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Admin Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  disabled={isLocked}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              {isLocked && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  <Lock className="inline h-4 w-4 mr-1" />
                  Account locked. Please try again in {Math.ceil((lockoutTime - Date.now()) / 60000)} minutes.
                </div>
              )}

              <div className="flex space-x-2">
                <Button 
                  onClick={handleLogin} 
                  className="flex-1"
                  disabled={isLocked || !password.trim()}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Login
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
              </div>

                             <div className="text-xs text-muted-foreground text-center">
                 {loginAttempts > 0 && !isLocked && (
                   <p>Failed attempts: {loginAttempts}/{ADMIN_CONFIG.MAX_LOGIN_ATTEMPTS}</p>
                 )}
                 <p>Session timeout: {ADMIN_CONFIG.SESSION_TIMEOUT / 60000} minutes</p>
               </div>
            </div>
          </CardContent>
        </motion.div>
      </motion.div>
    );
  }

  // Admin Panel Content
  if (isOpen && isAuthenticated) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-green-600" />
                Portfolio Admin
                <Badge variant="secondary" className="ml-2">
                  Secure Session
                </Badge>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLogout()}
                  className="text-red-600 hover:text-red-700"
                >
                  <Lock className="mr-1 h-4 w-4" />
                  Logout
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>
              Session active • Last activity: {new Date(lastActivity).toLocaleTimeString()}
            </CardDescription>
          </CardHeader>

          <div className="p-6">
            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
              {[
                { key: 'projects', label: 'Projects', icon: Database },
                { key: 'achievements', label: 'Achievements', icon: Award },
                { key: 'experiences', label: 'Experiences', icon: FileText },
              ].map((tab) => (
                <Button
                  key={tab.key}
                  variant={activeTab === tab.key ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(tab.key as any)}
                  className="flex items-center space-x-2"
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </Button>
              ))}
            </div>

            {/* Add Button */}
            <div className="mb-6">
              <Button
                onClick={() => handleAdd(activeTab)}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New {activeTab.slice(0, -1)}
              </Button>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {editingItem && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'projects' && renderProjectForm()}
                    {activeTab === 'achievements' && renderAchievementForm()}
                    {activeTab === 'experiences' && renderExperienceForm()}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {activeTab === 'projects' && renderProjectsList()}
                {activeTab === 'achievements' && renderAchievementsList()}
                {activeTab === 'experiences' && renderExperiencesList()}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Floating Admin Button
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Button
        onClick={() => setIsOpen(true)}
        className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Shield className="h-6 w-6" />
      </Button>
    </motion.div>
  );

  // Form rendering functions
  function renderProjectForm() {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            {isAdding ? 'Add New Project' : 'Edit Project'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Project Title"
            value={editingItem?.title || ''}
            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
          />
          <Textarea
            placeholder="Impact Statement"
            value={editingItem?.impactStatement || ''}
            onChange={(e) => setEditingItem({ ...editingItem, impactStatement: e.target.value })}
          />
          <Input
            placeholder="Tags (comma separated)"
            value={editingItem?.tags?.join(', ') || ''}
            onChange={(e) => setEditingItem({ 
              ...editingItem, 
              tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
            })}
          />
          <Input
            placeholder="GitHub URL"
            value={editingItem?.githubUrl || ''}
            onChange={(e) => setEditingItem({ ...editingItem, githubUrl: e.target.value })}
          />
          <Input
            placeholder="Demo URL (optional)"
            value={editingItem?.demoUrl || ''}
            onChange={(e) => setEditingItem({ ...editingItem, demoUrl: e.target.value || null })}
          />
          
          {/* Button Visibility Controls */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="font-medium">Button Visibility</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showGithubButton"
                  checked={editingItem?.showGithubButton !== false}
                  onChange={(e) => setEditingItem({ 
                    ...editingItem, 
                    showGithubButton: e.target.checked 
                  })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="showGithubButton" className="text-sm font-medium">
                  Show GitHub Button
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showDemoButton"
                  checked={editingItem?.showDemoButton !== false}
                  onChange={(e) => setEditingItem({ 
                    ...editingItem, 
                    showDemoButton: e.target.checked 
                  })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="showDemoButton" className="text-sm font-medium">
                  Show Live Demo Button
                </label>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>• GitHub button will only show if GitHub URL is provided</p>
              <p>• Live Demo button will only show if Demo URL is provided</p>
            </div>
          </div>
          
          {/* Image Upload Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-4 w-4" />
              <span className="font-medium">Project Images</span>
            </div>
            
            {/* File Upload */}
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                className="flex-1"
              />
              <Button
                onClick={handleImageUpload}
                disabled={!selectedImage || isLoading}
                size="sm"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>
            
            {/* Current Images */}
            {editingItem?.images && editingItem.images.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Current Images:</p>
                <div className="grid grid-cols-2 gap-2">
                  {(editingItem.images as Array<{ url: string; alt?: string }>).map((img, index: number) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.url}
                        alt={img.alt || `Project image ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div className="absolute left-1 top-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            const imgs = [...(editingItem.images as Array<{ url: string; alt?: string }>)];
                            if (index > 0) {
                              [imgs[index - 1], imgs[index]] = [imgs[index], imgs[index - 1]];
                              setEditingItem({ ...editingItem, images: imgs });
                            }
                          }}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            const imgs = [...(editingItem.images as Array<{ url: string; alt?: string }>)];
                            if (index < imgs.length - 1) {
                              [imgs[index + 1], imgs[index]] = [imgs[index], imgs[index + 1]];
                              setEditingItem({ ...editingItem, images: imgs });
                            }
                          }}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleImageDelete(img.url)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Manual URL Input */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Or add image URLs manually:</p>
              <Textarea
                placeholder="Image URLs (one per line)"
                value={(editingItem?.images || []).map((i: any) => (typeof i === 'string' ? i : i.url)).join('\n')}
                onChange={(e) => setEditingItem({ 
                  ...editingItem, 
                  images: e.target.value
                    .split('\n')
                    .map((url) => url.trim())
                    .filter(Boolean)
                    .map((url) => ({ url }))
                })}
                className="min-h-[80px]"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={() => handleSave('projects')} 
              className="flex-1"
              disabled={isLoading}
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  function renderAchievementForm() {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5" />
            {isAdding ? 'Add New Achievement' : 'Edit Achievement'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Achievement Title"
            value={editingItem?.title || ''}
            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={editingItem?.description || ''}
            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
          />
          <Input
            placeholder="Icon (emoji)"
            value={editingItem?.icon || ''}
            onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
          />
          <div className="flex space-x-2">
            <Button onClick={() => handleSave('achievements')} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  function renderExperienceForm() {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            {isAdding ? 'Add New Experience' : 'Edit Experience'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Year"
            value={editingItem?.year || ''}
            onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
          />
          <Input
            placeholder="Title"
            value={editingItem?.title || ''}
            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
          />
          <Input
            placeholder="Subtitle"
            value={editingItem?.subtitle || ''}
            onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={editingItem?.description || ''}
            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
          />
          <div className="flex space-x-2">
            <Button onClick={() => handleSave('experiences')} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  function renderProjectsList() {
    return (
      <div className="space-y-4">
        {data.projects.map((project) => (
          <Card key={project.id} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{project.impactStatement}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                  
                  {/* Button Status Indicators */}
                  <div className="flex gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${project.showGithubButton !== false ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="text-xs text-muted-foreground">GitHub</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${project.demoUrl && project.showDemoButton !== false ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="text-xs text-muted-foreground">Demo</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(project)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete('projects', project.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  function renderAchievementsList() {
    return (
      <div className="space-y-4">
        {data.achievements.map((achievement) => (
          <Card key={achievement.id} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{achievement.icon}</span>
                    <h3 className="font-semibold text-lg">{achievement.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">{achievement.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Created: {new Date(achievement.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(achievement)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete('achievements', achievement.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  function renderExperiencesList() {
    return (
      <div className="space-y-4">
        {data.experiences.map((experience) => (
          <Card key={experience.id} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{experience.year}</Badge>
                    <h3 className="font-semibold text-lg">{experience.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-1">{experience.subtitle}</p>
                  <p className="text-muted-foreground text-sm mb-2">{experience.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Created: {new Date(experience.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(experience)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete('experiences', experience.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
};
