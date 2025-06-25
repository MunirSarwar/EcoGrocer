'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function CustomerLoginPage() {
  const [otpSent, setOtpSent] = useState(false);
  const { toast } = useToast();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSent(true);
    toast({
        title: "OTP Sent",
        description: "An OTP has been sent to your mobile number.",
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: "Login Successful",
        description: "Welcome to EcoGrocer Hub!",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Customer Login or Register</CardTitle>
        <CardDescription>
          {otpSent ? 'Enter the OTP sent to your mobile.' : 'Use your mobile number to login or create an account.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="e.g., +1 555 123 4567" required />
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
          <Button variant="link" size="sm" className="w-full" onClick={() => setOtpSent(false)}>
            Use a different number
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
