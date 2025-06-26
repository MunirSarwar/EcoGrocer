'use client';

import { useState, useEffect }from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, updateProfile, type ConfirmationResult } from 'firebase/auth';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { app } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

const registrationSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    address: z.string().min(10, { message: "Address must be at least 10 characters." }),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Please enter a valid phone number with country code." }),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits." }),
});

export default function CustomerLoginPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [userData, setUserData] = useState<{name: string} | null>(null);
  const auth = getAuth(app);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response: any) => {
              // reCAPTCHA solved.
            }
        });
    }
  }, [auth]);

  const registerForm = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { name: "", address: "", phone: "" },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const handleRegister = async (values: z.infer<typeof registrationSchema>) => {
    setLoading(true);
    try {
      const verifier = (window as any).recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, values.phone, verifier);
      setConfirmationResult(result);
      setUserData({ name: values.name });
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: `An OTP has been sent to ${values.phone}.`,
      });
    } catch (error: any) {
       console.error("OTP Send Error:", error);
       let errorMessage = "Could not send OTP. Please check the phone number and try again.";
       if (error.code === 'auth/invalid-phone-number') {
           errorMessage = "The phone number format is invalid. Please include the country code (e.g., +91).";
       } else if (error.code === 'auth/too-many-requests') {
           errorMessage = "You've tried to send too many OTPs. Please wait a while before trying again.";
       } else if (error.code === 'auth/network-request-failed') {
          errorMessage = "Network error. Please check your internet connection and try again."
       } else if (error.message && error.message.includes('reCAPTCHA')) {
           errorMessage = "reCAPTCHA verification failed. This can happen due to network issues or browser extensions. Please refresh and try again.";
       }
       toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (values: z.infer<typeof otpSchema>) => {
    if (!confirmationResult) return;
    setLoading(true);
    try {
      const userCredential = await confirmationResult.confirm(values.otp);
      const user = userCredential.user;
      
      if (user && userData?.name) {
        await updateProfile(user, { displayName: userData.name });
      }

      toast({
        title: "Registration Successful!",
        description: `Welcome, ${userData?.name}! Your account is ready.`,
      });
      registerForm.reset();
      otpForm.reset();
      setOtpSent(false);
    } catch (error: any) {
      console.error("OTP Verify Error:", error);
      toast({
        title: "Verification Failed",
        description: "The OTP you entered is incorrect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }


  return (
    <>
      <div id="recaptcha-container"></div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Customer Registration</CardTitle>
          <CardDescription>
            {otpSent ? "Enter the OTP sent to your mobile." : "Create your account with your phone number."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!otpSent ? (
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl><Input type="tel" placeholder="+91 98765 43210" {...field} /></FormControl>
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
                     {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending OTP...</> : 'Send OTP'}
                  </Button>
                </form>
              </Form>
          ) : (
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-4 pt-4">
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>One-Time Password (OTP)</FormLabel>
                        <FormControl><Input type="text" inputMode="numeric" pattern="\d{6}" placeholder="Enter 6-digit OTP" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
                     {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : 'Verify & Register'}
                  </Button>
                </form>
              </Form>
          )}
        </CardContent>
      </Card>
    </>
  );
}
