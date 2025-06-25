'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

// A fixed phone number for the admin. In a real app, this should be an environment variable.
const ADMIN_PHONE_NUMBER = "9876543210";

export default function AdminLoginPage() {
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const form = e.target as HTMLFormElement;
        const phoneInput = form.elements.namedItem('phone') as HTMLInputElement;
        const phone = phoneInput.value;

        if (phone === ADMIN_PHONE_NUMBER) {
            setOtpSent(true);
            toast({
                title: "OTP Sent",
                description: "An OTP has been sent to the admin's mobile number.",
            });
        } else {
            setError("This phone number is not authorized for admin access.");
        }
    }

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd verify the OTP here.
        // For this prototype, any 6-digit code will work.
        toast({
            title: "Login Successful",
            description: "Welcome back, Admin! Redirecting...",
        });
        router.push('/admin/dashboard');
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Admin Login</CardTitle>
        <CardDescription>
            {otpSent ? 'Enter the OTP sent to your mobile.' : 'Enter the admin phone number to receive an OTP.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" placeholder="Enter admin phone number" required defaultValue={ADMIN_PHONE_NUMBER} />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Send OTP</Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">One-Time Password (OTP)</Label>
              <Input id="otp" type="text" inputMode="numeric" pattern="\d{6}" placeholder="Enter 6-digit OTP" required />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Verify & Login</Button>
          </form>
        )}
      </CardContent>
       {otpSent && (
        <CardFooter>
          <Button variant="link" size="sm" className="w-full" onClick={() => { setOtpSent(false); setError(null); }}>
            Use a different number
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
