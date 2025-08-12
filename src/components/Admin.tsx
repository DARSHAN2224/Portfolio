import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Settings, Database, FileText, Award, Lock, Eye, EyeOff, Shield, Upload, Image as ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Project, Achievement, Experience, achievementsData, experienceData, skillsData } from '@/lib/data';
import { ADMIN_CONFIG } from '@/config/admin';

interface AdminState {
  projects: Project[];
  achievements: Achievement[];
  experiences: Experience[];
  skills: Record<string, string[]>;
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
  const [activeTab, setActiveTab] = useState<'projects' | 'achievements' | 'experiences' | 'skills'>('projects');
  const [data, setData] = useState<AdminState>({
    projects: [],
    achievements: achievementsData,
    experiences: experienceData,
    skills: skillsData,
  });
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [tagsInputValue, setTagsInputValue] = useState('');
  const [skillsInputValue, setSkillsInputValue] = useState('');
  const { toast } = useToast();

  // Extracts a meaningful error message from server responses
  function pickValidationError(result: any, fallback: string, status?: number) {
    try {
      if (status === 400 && result && result.details && result.details.fieldErrors) {
        const fieldErrors = result.details.fieldErrors as Record<string, string[]>;
        const firstError = Object.values(fieldErrors).flat().find(Boolean);
        if (firstError) return String(firstError);
      }
      if (result && typeof result.error === 'string' && result.error.trim()) {
        return result.error;
      }
    } catch {
      // ignore
    }
    return fallback;
  }

  // Load data from server on mount
  useEffect(() => {
    // Load all data with better error handling
    const loadAllData = async () => {
      try {
        await loadExperiences();
        await loadAchievements();
        await loadSkills();
        await loadProjects();
      } catch (error) {
        console.error('Error in data load sequence:', error);
        // Ensure we have at least static data
        setData(prev => ({
          ...prev,
          experiences: experienceData,
          achievements: achievementsData,
          skills: skillsData,
        }));
      }
    };
    
    loadAllData();
    
    // Add a retry mechanism for failed loads
    const retryTimer = setTimeout(() => {
      if (data.experiences.length === 0) {
        loadExperiences();
      }
      if (data.achievements.length === 0) {
        loadAchievements();
      }
      if (Object.keys(data.skills).length === 0) {
        loadSkills();
      }
    }, 2000); // Retry after 2 seconds
    
    return () => clearTimeout(retryTimer);
  }, []);

  // Prevent body scroll when admin panel is open
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      
      return () => {
        // Restore body scroll when admin panel closes
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
      };
    }
  }, [isOpen]);

  const loadProjects = async () => {
    try {
      // Try API first
      const response = await fetch('/api/projects');
      if (response.ok) {
      const result = await response.json();
        if (result.ok && Array.isArray(result.projects)) {
        setData(prev => ({
          ...prev,
          projects: result.projects || []
        }));
          return;
        }
      }

      // Fallback to static JSON for static hosting (read-only)
      const staticRes = await fetch('/data/projects.json');
      if (staticRes.ok) {
        const json = await staticRes.json();
        const normalized = (Array.isArray(json) ? json : []).map((p: any) => ({
          ...p,
          images: Array.isArray(p.images)
            ? p.images.map((img: any) => (typeof img === 'string' ? { url: img } : img))
            : [],
        }));
        setData(prev => ({ ...prev, projects: normalized }));
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    }
  };

  const loadAchievements = async () => {
    try {
      const response = await fetch('/api/achievements');
      if (response.ok) {
        const result = await response.json();
        if (result.ok && Array.isArray(result.achievements)) {
          setData(prev => ({
            ...prev,
            achievements: result.achievements || []
          }));
          return;
        }
      }
      
      // If API fails or returns invalid data, use fallback
      setData(prev => ({ ...prev, achievements: achievementsData }));
      
    } catch (err) {
      console.error('Error loading achievements:', err);
      // Always ensure we have fallback data
      setData(prev => ({ ...prev, achievements: achievementsData }));
    }
  };

  const loadExperiences = async () => {
    try {
      // Try API first with a shorter timeout for faster loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000); // 1 second timeout for faster loading
      
      const response = await fetch('/api/experiences', { 
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const result = await response.json();
        if (result.ok && Array.isArray(result.experiences)) {
          setData(prev => ({
            ...prev,
            experiences: result.experiences || []
          }));
          return;
        }
      }
      
      // If API fails or returns invalid data, use fallback
      setData(prev => ({ ...prev, experiences: experienceData }));
      
    } catch (err) {
      if (err.name === 'AbortError') {
        // API timeout, using fallback data
      } else {
        console.error('Error loading experiences:', err);
      }
      // Always ensure we have fallback data
      setData(prev => ({ ...prev, experiences: experienceData }));
    }
  };

  const loadSkills = async () => {
    try {
      const response = await fetch('/api/skills');
      if (response.ok) {
        const result = await response.json();
        if (result.ok && result.skills) {
          setData(prev => ({
            ...prev,
            skills: result.skills || {}
          }));
          return;
        }
      }
      
      // If API fails or returns invalid data, use fallback
      setData(prev => ({ ...prev, skills: skillsData }));
      
    } catch (err) {
      console.error('Error loading skills:', err);
      // Always ensure we have fallback data
      setData(prev => ({ ...prev, skills: skillsData }));
    }
  };



  // Real-time content update listener for admin panel
  useEffect(() => {
    const handleContentUpdate = (event: CustomEvent) => {
      const { type, action, timestamp } = event.detail;
      
      // Automatically reload data when content is updated
      if (type === 'projects') {
        loadProjects();
      } else if (type === 'achievements') {
        loadAchievements();
      } else if (type === 'experiences') {
        loadExperiences();
      } else if (type === 'skills') {
        loadSkills();
      }
    };

    // Listen for content updates
    window.addEventListener('portfolioContentUpdate', handleContentUpdate as EventListener);
    
    return () => {
      window.removeEventListener('portfolioContentUpdate', handleContentUpdate as EventListener);
    };
  }, [loadProjects, loadAchievements, loadExperiences, loadSkills]);

  // Check authentication status on mount
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
          description: `Too many failed attempts. Account locked for ${ADMIN_CONFIG.LOCKOUT_DURATION ? ADMIN_CONFIG.LOCKOUT_DURATION / 60000 : 15} minutes.`,
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
    
    if (type === 'projects') {
      setEditingItem({
        id: generateId(),
        title: '',
        impactStatement: '',
        tags: [],
        githubUrl: '',
        demoUrl: '',
        images: [],
        showDemoButton: true,
        showGithubButton: true,
        createdAt: new Date().toISOString().split('T')[0],
      });
      setTagsInputValue(''); // Clear tags input
    } else if (type === 'achievements') {
      setEditingItem({
        id: generateId(),
        title: '',
        description: '',
        icon: '🏆',
        createdAt: new Date().toISOString().split('T')[0],
      });
    } else if (type === 'experiences') {
      setEditingItem({
        id: generateId(),
        year: '',
        title: '',
        subtitle: '',
        description: '',
        createdAt: new Date().toISOString().split('T')[0],
      });
    } else if (type === 'skills') {
      setEditingItem({
        category: '',
        skills: [],
      });
      setSkillsInputValue(''); // Clear skills input
    } else {
      setEditingItem({
        id: generateId(),
        createdAt: new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleEdit = (item: any) => {
    if (!isAuthenticated) return;
    setEditingItem({ ...item });
    
    // Initialize input values for comma-separated fields
    if (item.tags && Array.isArray(item.tags)) {
      setTagsInputValue(item.tags.join(', '));
    } else {
      setTagsInputValue('');
    }
    
    if (item.skills && Array.isArray(item.skills)) {
      setSkillsInputValue(item.skills.join(', '));
    } else {
      setSkillsInputValue('');
    }
    
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
          
          // Notify main portfolio of content update
          notifyContentUpdate('projects', 'delete');
        } else {
          const message = pickValidationError(result, "Failed to delete project", response.status);
          toast({ title: "Error", description: message, variant: "destructive" });
        }
      } catch (err) {
          toast({
            title: "Error",
          description: err instanceof Error ? err.message : "Failed to delete project",
            variant: "destructive",
          });
      }
    } else if (type === 'achievements') {
      try {
        const response = await fetch(`/api/achievements/${id}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        
        if (result.ok) {
          await loadAchievements(); // Reload achievements from server
          toast({
            title: "Achievement Deleted",
            description: "Achievement has been removed successfully.",
          });
          
          // Notify main portfolio of content update
          notifyContentUpdate('achievements', 'delete');
        } else {
          const message = pickValidationError(result, "Failed to delete achievement", response.status);
          toast({ title: "Error", description: message, variant: "destructive" });
        }
      } catch (err) {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to delete achievement",
          variant: "destructive",
        });
      }
    } else if (type === 'experiences') {
      try {
        const response = await fetch(`/api/experiences/${id}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        
        if (result.ok) {
          await loadExperiences(); // Reload experiences from server
          toast({
            title: "Experience Deleted",
            description: "Experience has been removed successfully.",
          });
          
          // Notify main portfolio of content update
          notifyContentUpdate('experiences', 'delete');
        } else {
          const message = pickValidationError(result, "Failed to delete experience", response.status);
          toast({ title: "Error", description: message, variant: "destructive" });
        }
      } catch (err) {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to delete experience",
          variant: "destructive",
        });
      }
    } else if (type === 'skills') {
      // Handle skills deletion via API
      try {
        const response = await fetch(`/api/skills/${id}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        
        if (result.ok) {
          await loadSkills(); // Reload skills from server
          toast({
            title: "Skill Category Deleted",
            description: `Skill category "${id}" has been removed successfully.`,
          });
          
          // Notify main portfolio of content update
          notifyContentUpdate('skills', 'delete');
        } else {
          const message = pickValidationError(result, "Failed to delete skill category", response.status);
          toast({ title: "Error", description: message, variant: "destructive" });
        }
      } catch (err) {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to delete skill category",
          variant: "destructive",
        });
      }
    } else {
      // Handle other types locally for now
      setData(prev => ({
        ...prev,
        [type]: (prev[type] as any[]).filter(item => item.id !== id)
      }));
      toast({
        title: "Item Deleted",
        description: "Item has been removed successfully.",
      });
    }
  };

  // Function to notify main portfolio of content updates
  const notifyContentUpdate = (type: string, action: 'create' | 'update' | 'delete') => {

    
    // Dispatch a custom event that the main portfolio can listen to
    const event = new CustomEvent('portfolioContentUpdate', {
      detail: { type, action, timestamp: Date.now() }
    });
    window.dispatchEvent(event);
    
    // Also update localStorage as a fallback
    localStorage.setItem('portfolioLastUpdate', Date.now().toString());
    localStorage.setItem('portfolioUpdateType', `${type}:${action}`);
    
    
  };

  const handleSave = async (type: keyof AdminState) => {
    if (!isAuthenticated || !editingItem) return;

    // Client-side validation
    if (type === 'projects') {

      
      if (!editingItem.title?.trim()) {
        toast({ title: "Validation Error", description: "Project title is required", variant: "destructive" });
        return;
      }
      if (!editingItem.impactStatement?.trim()) {
        toast({ title: "Validation Error", description: "Impact statement is required", variant: "destructive" });
        return;
      }
      if (!Array.isArray(editingItem.tags) || editingItem.tags.length === 0) {

        toast({ title: "Validation Error", description: "At least one tag is required", variant: "destructive" });
        return;
      }
      
      // Check GitHub URL only if GitHub button is enabled
      if (editingItem.showGithubButton !== false && (!editingItem.githubUrl || !editingItem.githubUrl.trim())) {
        toast({ title: "Validation Error", description: "GitHub URL is required when GitHub button is enabled", variant: "destructive" });
        return;
      }
      
      // Check Demo URL only if Demo button is enabled
      if (editingItem.showDemoButton !== false && editingItem.demoUrl && !editingItem.demoUrl.trim()) {
        toast({ title: "Validation Error", description: "Demo URL cannot be empty when Demo button is enabled", variant: "destructive" });
        return;
      }
      
      // Validate URL format if provided
      if (editingItem.githubUrl && editingItem.githubUrl.trim()) {
        try {
          new URL(editingItem.githubUrl);
        } catch {
          toast({ title: "Validation Error", description: "Invalid GitHub URL format", variant: "destructive" });
          return;
        }
      }
      
      if (editingItem.demoUrl && editingItem.demoUrl.trim()) {
        try {
          new URL(editingItem.demoUrl);
        } catch {
          toast({ title: "Validation Error", description: "Invalid Demo URL format", variant: "destructive" });
          return;
        }
      }
    } else if (type === 'achievements') {
      if (!editingItem.title?.trim()) {
        toast({ title: "Validation Error", description: "Achievement title is required", variant: "destructive" });
        return;
      }
      if (!editingItem.description?.trim()) {
        toast({ title: "Validation Error", description: "Achievement description is required", variant: "destructive" });
        return;
      }
      if (!editingItem.icon?.trim()) {
        toast({ title: "Validation Error", description: "Achievement icon is required", variant: "destructive" });
        return;
      }
    } else if (type === 'experiences') {
      if (!editingItem.year?.trim()) {
        toast({ title: "Validation Error", description: "Experience year is required", variant: "destructive" });
        return;
      }
      if (!editingItem.title?.trim()) {
        toast({ title: "Validation Error", description: "Experience title is required", variant: "destructive" });
        return;
      }
      if (!editingItem.subtitle?.trim()) {
        toast({ title: "Validation Error", description: "Experience subtitle is required", variant: "destructive" });
        return;
      }
      if (!editingItem.description?.trim()) {
        toast({ title: "Validation Error", description: "Experience description is required", variant: "destructive" });
        return;
      }
    }

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
          toast({
            title: "Success!",
            description: `Project ${isAdding ? 'added' : 'updated'} successfully!`,
          });
          
          // Notify main portfolio of content update
          notifyContentUpdate('projects', isAdding ? 'create' : 'update');
          
          // Reload the data
          await loadProjects();
          
          // Reset form
          setEditingItem(null);
          setIsAdding(false);
        } else {
          const message = pickValidationError(result, "Failed to save project", response.status);
          toast({ title: "Error", description: message, variant: "destructive" });
          return;
        }
      } else if (type === 'achievements') {
        // Save achievement to server

        const response = await fetch('/api/achievements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingItem),
        });

        const result = await response.json();

        
        if (result.ok) {
          toast({
            title: "Success!",
            description: `Achievement ${isAdding ? 'added' : 'updated'} successfully!`,
          });
          
          // Notify main portfolio of content update
          notifyContentUpdate('achievements', isAdding ? 'create' : 'update');
          
          // Reload the data

          await loadAchievements();
          
          // Reset form
          setEditingItem(null);
          setIsAdding(false);
        } else {
          const message = pickValidationError(result, "Failed to save achievement", response.status);
          toast({ title: "Error", description: message, variant: "destructive" });
          return;
        }
      } else if (type === 'experiences') {
        // Save experience to server

        const response = await fetch('/api/experiences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingItem),
        });

        const result = await response.json();

        
        if (result.ok) {
          toast({
            title: "Success!",
            description: `Experience ${isAdding ? 'added' : 'updated'} successfully!`,
          });
          
          // Notify main portfolio of content update
          notifyContentUpdate('experiences', isAdding ? 'create' : 'update');
          
          // Reload the data

          await loadExperiences();
          
          // Reset form
          setEditingItem(null);
          setIsAdding(false);
        } else {
          const message = pickValidationError(result, "Failed to save experience", response.status);
          toast({ title: "Error", description: message, variant: "destructive" });
          return;
        }
      } else if (type === 'skills') {
        // Save skills to server

        const response = await fetch('/api/skills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingItem),
        });

        const result = await response.json();

        
        if (result.ok) {
          toast({
            title: "Success!",
            description: `Skill category "${editingItem.category}" ${isAdding ? 'added' : 'updated'} successfully!`,
          });
          
          // Notify main portfolio of content update
          notifyContentUpdate('skills', isAdding ? 'create' : 'update');
          
          // Reload the data

          await loadSkills();
          
          // Reset form
          setEditingItem(null);
          setIsAdding(false);
        } else {
          const message = pickValidationError(result, "Failed to save skills", response.status);
          toast({ title: "Error", description: message, variant: "destructive" });
          return;
        }
      } else {
        // Handle other types locally for now
        if (isAdding) {
          setData(prev => ({
            ...prev,
            [type]: [...(prev[type] as any[]), editingItem]
          }));
          toast({
            title: "Item Added",
            description: "New item has been added successfully.",
          });
        } else {
          setData(prev => ({
            ...prev,
            [type]: (prev[type] as any[]).map(item => 
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
        description: err instanceof Error ? err.message : "Failed to save item",
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
    setTagsInputValue(''); // Clear tags input
    setSkillsInputValue(''); // Clear skills input
  };

  const handleImageUpload = async () => {
    if (!selectedImage || !editingItem?.id) return;

    // Check if the project has been saved (has a proper ID that exists in the data)
    const existingProject = data.projects.find(p => p.id === editingItem.id);
    if (!existingProject) {
      toast({
        title: "Upload Failed",
        description: "Please save the project first before uploading images",
        variant: "destructive",
      });
      return;
    }

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
            ...(import.meta.env.VITE_ADMIN_API_TOKEN
              ? { Authorization: `Bearer ${import.meta.env.VITE_ADMIN_API_TOKEN}` }
              : {}),
          },
          body: JSON.stringify({ imageData, filename }),
        });

        const result = await response.json();

        
        if (result.ok && result.imageUrl) {
          // Add the new image to the current editingItem
          const newImage = { url: result.imageUrl, alt: filename };
          const updatedImages = [...(editingItem.images || []), newImage];
          
          setEditingItem({
            ...editingItem,
            images: updatedImages
          });
          
          // Clear the selected image
          setSelectedImage(null);
          
          toast({
            title: "Success!",
            description: `Image uploaded successfully! URL: ${result.imageUrl}`,
          });
          
          // Notify main portfolio of content update
          notifyContentUpdate('projects', 'update');
          

        } else {
  
          const message = pickValidationError(result, "Failed to upload image - no URL returned", response.status);
          toast({ title: "Upload Failed", description: message, variant: "destructive" });
        }
      };
      
      reader.readAsDataURL(selectedImage);
    } catch (err) {

      toast({
        title: "Upload Failed",
        description: err instanceof Error ? err.message : "Failed to upload image",
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
          ...(import.meta.env.VITE_ADMIN_API_TOKEN
            ? { Authorization: `Bearer ${import.meta.env.VITE_ADMIN_API_TOKEN}` }
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
        
        // Notify main portfolio of content update
        notifyContentUpdate('projects', 'update');
      } else {
        const message = pickValidationError(result, "Failed to delete image", response.status);
        toast({ title: "Delete Failed", description: message, variant: "destructive" });
      }
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: err instanceof Error ? err.message : "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  // Login Screen
  if (isOpen && !isAuthenticated) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 admin-panel-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onScroll={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        style={{ overscrollBehavior: 'contain' }}
      >
        <motion.div
          className="bg-background rounded-lg shadow-xl w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ 
            overscrollBehavior: 'contain',
            isolation: 'isolate'
          }}
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
                title="Close Login"
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
                  Account locked. Please try again in {lockoutTime ? Math.ceil((lockoutTime - Date.now()) / 60000) : 0} minutes.
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
                   <p>Failed attempts: {loginAttempts}/{ADMIN_CONFIG.MAX_LOGIN_ATTEMPTS || 5}</p>
                 )}
                 <p>Session timeout: {ADMIN_CONFIG.SESSION_TIMEOUT ? ADMIN_CONFIG.SESSION_TIMEOUT / 60000 : 0} minutes</p>
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
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 admin-panel-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onScroll={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        style={{ overscrollBehavior: 'contain' }}
      >
        <motion.div
          className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ 
            overscrollBehavior: 'contain',
            isolation: 'isolate'
          }}
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
                  onClick={() => handleLogout("You have been logged out.")}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Logout from Admin Panel"
                >
                  <Lock className="mr-1 h-4 w-4" />
                  Logout
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  title="Close Admin Panel"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>
              Session active • Last activity: {lastActivity ? new Date(lastActivity).toLocaleTimeString() : 'Unknown'}
            </CardDescription>
            

          </CardHeader>

          <div className="p-6">
            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
              {[
                { key: 'projects', label: 'Projects', icon: Database },
                { key: 'achievements', label: 'Achievements', icon: Award },
                { key: 'experiences', label: 'Experiences', icon: FileText },
                { key: 'skills', label: 'Skills', icon: Settings },
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
            <div 
              className="max-h-[60vh] overflow-y-auto overscroll-contain"
              style={{ 
                overscrollBehavior: 'contain',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
              }}
              onScroll={(e) => {
                // Prevent scroll events from bubbling to the main page
                e.stopPropagation();
              }}
              onWheel={(e) => {
                // Prevent wheel events from bubbling to the main page
                e.stopPropagation();
              }}
            >
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
                    {activeTab === 'skills' && renderSkillsForm()}
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
                {activeTab === 'skills' && renderSkillsList()}
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
        className={`rounded-full w-14 h-14 shadow-lg transition-all duration-200 ${
          isAuthenticated 
            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
        }`}
        title={isAuthenticated ? "Admin Panel (Click to open)" : "Admin Login (Click to open)"}
      >
        <Shield className="h-6 w-6" />
        {isAuthenticated && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          />
        )}
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
          <div>
            <label className="text-sm font-medium">
              Project Title <span className="text-red-500">*</span>
            </label>
          <Input
            placeholder="Project Title"
            value={editingItem?.title || ''}
            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
              className={!editingItem?.title?.trim() ? 'border-red-300' : ''}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">
              Impact Statement <span className="text-red-500">*</span>
            </label>
          <Textarea
            placeholder="Impact Statement"
            value={editingItem?.impactStatement || ''}
            onChange={(e) => setEditingItem({ ...editingItem, impactStatement: e.target.value })}
              className={!editingItem?.impactStatement?.trim() ? 'border-red-300' : ''}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">
              Tags <span className="text-red-500">*</span> <span className="text-xs text-muted-foreground">(comma-separated)</span>
            </label>
            <Textarea
              placeholder="React, Node.js, MongoDB, AI"
              value={tagsInputValue}
              onChange={(e) => setTagsInputValue(e.target.value)}
              onBlur={() => {
                const tagsArray = tagsInputValue
                  .split(',')
                  .map(tag => tag.trim())
                  .filter(tag => tag.length > 0);
                setEditingItem({ ...editingItem, tags: tagsArray });
                setTagsInputValue(''); // Clear input after processing
              }}
              className={!Array.isArray(editingItem?.tags) || editingItem?.tags.length === 0 ? 'border-red-300' : ''}
            />
            <div className="text-xs text-muted-foreground mt-1">
              Enter tags separated by commas (e.g., React, Node.js, MongoDB)
            </div>
            {/* Debug display */}
            {editingItem?.tags && (
              <div className="text-xs text-blue-600 mt-1">
                Current tags: [{editingItem.tags.join(', ')}]
              </div>
            )}
            {/* Real-time preview */}
            <div className="text-xs text-green-600 mt-1 bg-green-50 p-2 rounded">
              <strong>Real-time Preview:</strong>
              <br />
              Raw input: "{tagsInputValue}"
              <br />
              Processed array: [{editingItem?.tags?.map(tag => `"${tag}"`)?.join(', ') || ''}]
              <br />
              Array length: {editingItem?.tags?.length || 0}
            </div>
            {/* Test button for debugging */}
            <button
              type="button"
                             onClick={() => {
                 const testTags = "React, Node.js, MongoDB";
                 const tagsArray = testTags
                   .split(',')
                   .map(tag => tag.trim())
                   .filter(tag => tag.length > 0);
                 setEditingItem({ ...editingItem, tags: tagsArray });
               }}
              className="text-xs text-blue-600 underline mt-1"
            >
              Test Tags Processing
            </button>
            
            {/* Simple input test */}
            <button
              type="button"
                             onClick={() => {
                 setEditingItem({ ...editingItem, tags: ['Test Tag 1', 'Test Tag 2'] });
               }}
              className="text-xs text-green-600 underline mt-1 ml-2"
            >
              Test Simple Update
            </button>
            
            {/* Comma Test Input */}
            <div className="mt-2 p-2 bg-yellow-50 rounded border">
              <label className="text-xs font-medium text-yellow-800">Test Comma Input:</label>
              <input
                type="text"
                placeholder="Type: React, Node.js, MongoDB"
                className="w-full mt-1 p-1 text-xs border rounded"
                                 onChange={(e) => {
                   // Test input for debugging
                 }}
              />
              <p className="text-xs text-yellow-700 mt-1">
                Type commas here to test if they work: React, Node.js, MongoDB
              </p>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">
              GitHub URL <span className="text-red-500">*</span> <span className="text-xs text-muted-foreground">(required if GitHub button enabled)</span>
            </label>
          <Input
            placeholder="GitHub URL"
            value={editingItem?.githubUrl || ''}
            onChange={(e) => setEditingItem({ ...editingItem, githubUrl: e.target.value })}
              className={editingItem?.showGithubButton !== false && !editingItem?.githubUrl?.trim() ? 'border-red-300' : ''}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">
              Demo URL <span className="text-xs text-muted-foreground">(required if Demo button enabled)</span>
            </label>
          <Input
            placeholder="Demo URL (optional)"
            value={editingItem?.demoUrl || ''}
            onChange={(e) => setEditingItem({ ...editingItem, demoUrl: e.target.value || null })}
              className={editingItem?.showDemoButton !== false && editingItem?.demoUrl && !editingItem?.demoUrl?.trim() ? 'border-red-300' : ''}
          />
          </div>
          
          {/* Button Visibility Controls */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="font-medium">Button Visibility & URL Requirements</span>
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
                <span className="text-xs text-muted-foreground">(requires GitHub URL)</span>
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
                <span className="text-xs text-muted-foreground">(requires Demo URL)</span>
              </div>
            </div>
          </div>
          
          {/* Image Upload Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-4 w-4" />
              <span className="font-medium">Project Images</span>
            </div>
            
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
              <p>• Upload images using the file input below</p>
              <p>• Use the arrow buttons to reorder images (order matters for carousel)</p>
              <p>• First image will be the main display image</p>
              <p>• Images are displayed in the order shown below</p>
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
                <div className="text-xs text-blue-600 mb-2">
                  Debug: {editingItem.images.length} images loaded
                </div>
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
                          console.error(`❌ Image failed to load: ${img.url}`); // Debug log
                        }}
                                                 onLoad={() => {
                           // Image loaded successfully
                         }}
                      />
                      {/* Image order indicator */}
                      <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
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
                          disabled={index === 0}
                          className={index === 0 ? 'opacity-50 cursor-not-allowed' : ''}
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
                          disabled={index === (editingItem.images as Array<any>)?.length - 1}
                          className={index === (editingItem.images as Array<any>)?.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}
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
          <div>
            <label className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </label>
          <Input
            placeholder="Achievement Title"
            value={editingItem?.title || ''}
            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
              className={!editingItem?.title?.trim() ? 'border-red-300' : ''}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </label>
          <Textarea
              placeholder="Achievement Description"
            value={editingItem?.description || ''}
            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              className={!editingItem?.description?.trim() ? 'border-red-300' : ''}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">
              Icon <span className="text-red-500">*</span>
            </label>
          <Input
              placeholder="Icon (emoji or symbol)"
            value={editingItem?.icon || ''}
            onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
              className={!editingItem?.icon?.trim() ? 'border-red-300' : ''}
          />
          </div>
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
          <div>
            <label className="text-sm font-medium">
              Year <span className="text-red-500">*</span>
            </label>
          <Input
            placeholder="Year"
            value={editingItem?.year || ''}
            onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
              className={!editingItem?.year?.trim() ? 'border-red-300' : ''}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </label>
          <Input
              placeholder="Experience Title"
            value={editingItem?.title || ''}
            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
              className={!editingItem?.title?.trim() ? 'border-red-300' : ''}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">
              Subtitle <span className="text-red-500">*</span>
            </label>
          <Input
              placeholder="Experience Subtitle"
            value={editingItem?.subtitle || ''}
            onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
              className={!editingItem?.subtitle?.trim() ? 'border-red-300' : ''}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </label>
          <Textarea
              placeholder="Experience Description"
            value={editingItem?.description || ''}
            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              className={!editingItem?.description?.trim() ? 'border-red-300' : ''}
          />
          </div>
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

  function renderSkillsForm() {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            {isAdding ? 'Add New Skill Category' : 'Edit Skill Category'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              Category Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Category Name (e.g., Languages, Backend, Frontend)"
              value={editingItem?.category || ''}
              onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
              className={!editingItem?.category?.trim() ? 'border-red-300' : ''}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">
              Skills <span className="text-red-500">*</span> <span className="text-xs text-muted-foreground">(comma-separated)</span>
            </label>
            <Textarea
              placeholder="React, Node.js, MongoDB, AI"
              value={skillsInputValue}
              onChange={(e) => setSkillsInputValue(e.target.value)}
              onBlur={() => {
                const skillsArray = skillsInputValue
                  .split(',')
                  .map(skill => skill.trim())
                  .filter(skill => skill.length > 0);
                setEditingItem({ ...editingItem, skills: skillsArray });
                setSkillsInputValue(''); // Clear input after processing
              }}
              className={!Array.isArray(editingItem?.skills) || editingItem?.skills.length === 0 ? 'border-red-300' : ''}
            />
            <div className="text-xs text-muted-foreground mt-1">
              Enter skills separated by commas (e.g., React, Node.js, MongoDB)
            </div>
            {editingItem?.skills && (
              <div className="text-xs text-blue-600 mt-1">
                Current skills: [{editingItem.skills.join(', ')}]
              </div>
            )}
            {/* Real-time preview */}
            <div className="text-xs text-green-600 mt-1 bg-green-50 p-2 rounded">
              <strong>Real-time Preview:</strong>
              <br />
              Raw input: "{skillsInputValue}"
              <br />
              Processed array: [{editingItem?.skills?.map(skill => `"${skill}"`)?.join(', ') || ''}]
              <br />
              Array length: {editingItem?.skills?.length || 0}
            </div>
            
            {/* Test button for debugging */}
            <button
              type="button"
                             onClick={() => {
                 const testSkills = "React, Node.js, MongoDB";
                 const skillsArray = testSkills
                   .split(',')
                   .map(skill => skill.trim())
                   .filter(skill => skill.length > 0);
                 setEditingItem({ ...editingItem, skills: skillsArray });
               }}
              className="text-xs text-blue-600 underline mt-1"
            >
              Test Skills Processing
            </button>
            
            {/* Simple input test */}
            <button
              type="button"
                             onClick={() => {
                 setEditingItem({ ...editingItem, skills: ['Test Skill 1', 'Test Skill 2'] });
               }}
              className="text-xs text-green-600 underline mt-1 ml-2"
            >
              Test Simple Skills Update
            </button>
            
            {/* Comma Test Input for Skills */}
            <div className="mt-2 p-2 bg-yellow-50 rounded border">
              <label className="text-xs font-medium text-yellow-800">Test Comma Input for Skills:</label>
              <input
                type="text"
                placeholder="Type: JavaScript, Python, C++"
                className="w-full mt-1 p-1 text-xs border rounded"
                                 onChange={(e) => {
                   // Skills test input for debugging
                 }}
              />
              <p className="text-xs text-yellow-700 mt-1">
                Type commas here to test if they work: JavaScript, Python, C++
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={() => handleSave('skills')} className="flex-1">
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
                    Created: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown'}
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
        {data.achievements.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No achievements found. Add your first achievement!</p>
          </div>
        ) : (
          data.achievements.map((achievement) => (
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
                      Created: {achievement.createdAt ? new Date(achievement.createdAt).toLocaleDateString() : 'Unknown'}
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
          ))
        )}
      </div>
    );
  }

  function renderExperiencesList() {

    return (
      <div className="space-y-4">
        {data.experiences.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No experiences found. Add your first experience!</p>
          </div>
        ) : (
          data.experiences.map((experience) => (
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
                      Created: {experience.createdAt ? new Date(experience.createdAt).toLocaleDateString() : 'Unknown'}
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
          ))
        )}
      </div>
    );
  }

  function renderSkillsList() {
    return (
      <div className="space-y-4">
        {Object.entries(data.skills).length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No skills found. Add your first skill category!</p>
          </div>
        ) : (
          Object.entries(data.skills).map(([category, skills]) => (
            <Card key={category} className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  {category} Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit({ category, skills: [...skills] })}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Category
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete('skills', category)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Category
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        <Button
          onClick={() => handleAdd('skills')}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Skill Category
        </Button>
      </div>
    );
  }
};
