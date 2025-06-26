'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { app } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const registrationSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    address: z.string().min(10, { message: "Address must be at least 10 characters." }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function CustomerLoginPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  const auth = getAuth(app);
  const router = useRouter();

  const registerForm = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { name: "", email: "", password: "", address: "" },
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const handleRegister = async (values: z.infer<typeof registrationSchema>) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: values.name });
      await sendEmailVerification(user);

      toast({
        title: "Registration Successful!",
        description: "A verification email has been sent. Please check your inbox to complete registration.",
      });
      registerForm.reset();
      setView('login');

    } catch (error: any) {
      console.error("Registration Error:", error);
      let description = "An unexpected error occurred. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        description = "This email address is already in use by another account.";
      }
      toast({
        title: "Registration Failed",
        description: description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      if (user.emailVerified) {
        toast({
          title: "Login Successful!",
          description: `Welcome back, ${user.displayName || 'user'}! Redirecting...`,
        });
        loginForm.reset();
        router.push('/');
      } else {
         await sendEmailVerification(user);
         toast({
          title: "Email Not Verified",
          description: "Please check your inbox for the verification link. A new link has been sent.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
       console.error("Login Error:", error);
        let description = "An unexpected error occurred. Please try again.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            description = "Invalid email or password. Please check your credentials and try again.";
        }
       toast({
        title: "Login Failed",
        description: description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleForgotPassword = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setLoading(true);
    try {
        await sendPasswordResetEmail(auth, values.email);
        toast({
            title: "Password Reset Email Sent",
            description: "Please check your inbox for a link to reset your password.",
        });
        forgotPasswordForm.reset();
        setView('login');
    } catch (error: any) {
        console.error("Password Reset Error:", error);
        let description = "An unexpected error occurred. Please try again.";
        if (error.code === 'auth/user-not-found') {
            description = "No user found with this email address.";
        }
        toast({
            title: "Failed to Send Reset Email",
            description: description,
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
  };

  if (view === 'forgot') {
      return (
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline text-2xl">Reset Your Password</CardTitle>
                  <CardDescription>
                      Enter your email address and we'll send you a link to get back into your account.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <Form {...forgotPasswordForm}>
                      <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
                          <FormField
                              control={forgotPasswordForm.control}
                              name="email"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Email</FormLabel>
                                      <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
                              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Send Reset Link'}
                          </Button>
                      </form>
                  </Form>
              </CardContent>
              <CardFooter>
                  <Button variant="link" size="sm" className="w-full" onClick={() => setView('login')}>
                      Back to Login
                  </Button>
              </CardFooter>
          </Card>
      )
  }

  return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Customer Account</CardTitle>
          <CardDescription>
            Login or create a new account to start shopping.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs value={view} onValueChange={(value) => setView(value as 'login' | 'register')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4 pt-4">
                        <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <div className="text-right -mt-2">
                        <Button
                            type="button"
                            variant="link"
                            size="sm"
                            className="h-auto p-0 font-normal"
                            onClick={() => setView('forgot')}
                        >
                            Forgot password?
                        </Button>
                      </div>
                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</> : 'Login'}
                      </Button>
                    </form>
                </Form>
              </TabsContent>
              <TabsContent value="register">
                <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4 pt-4">
                       <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl><Input placeholder="e.g., Priya Sharma" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={registerForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Address</FormLabel>
                            <FormControl>
                              <Textarea placeholder="e.g., 123 Green Way, Eco City, 110011" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
                         {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</> : 'Register'}
                      </Button>
                    </form>
                  </Form>
              </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
  );
}
