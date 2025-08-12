import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Send, Mail, Linkedin, Github, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useContact } from '@/stores/useContact';
import { personalInfo } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from '@/components/ui/sonner';

export const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { form, isSubmitting, setForm, setSubmitting, setSuccess, setError, resetForm } = useContact();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      sonnerToast.error('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          ownerEmail: personalInfo.email,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const code = (data && data.code) || 'UNKNOWN_ERROR';
        let description = 'Failed to send message. Please try again.';

        // Prefer server validation messages when available
        if (response.status === 400 && data && data.details && data.details.fieldErrors) {
          try {
            const fieldErrors = data.details.fieldErrors as Record<string, string[]>;
            const firstError = Object.values(fieldErrors).flat().find(Boolean);
            if (firstError) description = String(firstError);
          } catch {
            // ignore parse issues
          }
        } else if (code === 'SMTP_NOT_CONFIGURED') {
          description = 'Email service is not configured yet. Please try again later or use the direct email button below.';
        } else if (code === 'SEND_FAILED' || code === 'VERIFY_FAILED') {
          description = 'Email service is unavailable right now. Please use the direct email button below.';
        } else if (data && typeof data.error === 'string' && data.error.trim()) {
          description = data.error;
        }
 
        throw new Error(description);
      }

      setSuccess(true);
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
        variant: "default",
      });
      sonnerToast.success("Message sent! I'll get back to you soon.");
      resetForm();
    } catch (error) {
      setError("Failed to send message. Please try again.");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
      sonnerToast.error(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="container-max">
          <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Let's <span className="gradient-text inline-flex items-center">Connect <Sparkles className="ml-2 h-6 w-6 text-accent" /></span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ready to discuss your next project or just want to say hello? 
            I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="relative overflow-hidden glass-morphism">
              <motion.div
                aria-hidden
                initial={{ opacity: 0 }}
                animate={{ opacity: inView ? 0.15 : 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-accent blur-3xl"
              />
              <motion.div
                aria-hidden
                initial={{ opacity: 0 }}
                animate={{ opacity: inView ? 0.1 : 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="pointer-events-none absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-primary blur-2xl"
              />
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-primary" />
                  Send Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and I'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) => setForm({ name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={form.email}
                      onChange={(e) => setForm({ email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Textarea
                      placeholder="Your Message"
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ message: e.target.value })}
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full btn-hero"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Sending...
                      </div>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Direct Contact</CardTitle>
                <CardDescription>
                  Prefer direct communication? Reach out via email or social media.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a href={`mailto:${personalInfo.email}?subject=${encodeURIComponent('Contact from Portfolio')}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    {personalInfo.email}
                  </a>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a
                    href={personalInfo.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn Profile
                  </a>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a
                    href={personalInfo.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub Profile
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 glass-morphism">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="font-semibold">Response Time</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  I typically respond within 24 hours. Looking forward to connecting with you!
                </p>
                <div className="mt-4 flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>⚡ Fast</span>
                  <span>•</span>
                  <span>💬 Friendly</span>
                  <span>•</span>
                  <span>🎯 Professional</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};