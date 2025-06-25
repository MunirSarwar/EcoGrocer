'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const registrationSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
});

export default function CustomerLoginPage() {
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      otp: "",
      name: "",
      address: "",
    },
  });

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const formElement = e.target as HTMLFormElement;
    const phoneInput = formElement.elements.namedItem('phone') as HTMLInputElement;
    setPhoneNumber(phoneInput.value);
    setOtpSent(true);
    toast({
        title: "OTP Sent",
        description: `An OTP has been sent to ${phoneInput.value}.`,
    });
  };

  const handleRegister = (values: z.infer<typeof registrationSchema>) => {
    // In a real app, you'd verify the OTP here against a backend service.
    console.log({ phoneNumber, ...values });
    toast({
        title: "Registration Successful",
        description: `Welcome to EcoGrocer Hub, ${values.name}!`,
    });
    // Here you would typically redirect the user or update the UI
    form.reset();
    setOtpSent(false);
    setPhoneNumber('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Customer Login or Register</CardTitle>
        <CardDescription>
          {!otpSent 
            ? 'Use your mobile number to login or create an account.'
            : `Enter the OTP sent to ${phoneNumber} and complete your registration.`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" placeholder="e.g., 9876543210" required />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Send OTP</Button>
          </form>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password (OTP)</FormLabel>
                    <FormControl>
                      <Input type="text" inputMode="numeric" placeholder="Enter 6-digit OTP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
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
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Verify & Register</Button>
            </form>
          </Form>
        )}
      </CardContent>
      {otpSent && (
        <CardFooter>
          <Button variant="link" size="sm" className="w-full" onClick={() => { setOtpSent(false); form.reset(); setPhoneNumber(''); }}>
            Use a different number
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
