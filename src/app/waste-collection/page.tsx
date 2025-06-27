'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAuth, onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { addWasteRequest } from '@/lib/waste-collection-service';
import { app } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

const wasteRequestSchema = z.object({
    wasteType: z.enum(['Plastic', 'Paper', 'Glass', 'Organic', 'E-waste']),
    weight: z.number().min(2).max(10),
    address: z.string().min(10, { message: "Please provide a detailed address." }),
    phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }),
    pickupDate: z.date({
        required_error: "A pickup date is required.",
    }),
});

export default function WasteCollectionPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const form = useForm<z.infer<typeof wasteRequestSchema>>({
        resolver: zodResolver(wasteRequestSchema),
        defaultValues: {
            weight: 2,
            address: "",
            phone: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof wasteRequestSchema>) => {
        if (!user) {
            toast({ title: "Authentication Error", description: "You must be logged in to submit a request.", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            await addWasteRequest(user.uid, values);
            toast({
                title: "Request Submitted!",
                description: "Your waste collection request has been successfully submitted.",
            });
            router.push('/orders'); // Or a dedicated "my requests" page
        } catch (error) {
            console.error("Failed to submit waste request:", error);
            toast({
                title: "Submission Failed",
                description: "There was a problem submitting your request. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };
    
    if (authLoading) {
        return <div className="container mx-auto px-4 py-8 md:py-12 flex justify-center items-center h-96"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8 md:py-12 text-center">
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Access Denied</CardTitle>
                        <CardDescription>You need to be logged in to schedule a waste pickup.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/login/customer">Login to Continue</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Schedule Waste Collection</CardTitle>
                    <CardDescription>Fill in the details below to schedule a pickup for your recyclable waste.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="wasteType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type of Waste</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select the primary type of waste" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Plastic">Plastic (Bottles, Packaging)</SelectItem>
                                                <SelectItem value="Paper">Paper & Cardboard</SelectItem>
                                                <SelectItem value="Glass">Glass (Bottles, Jars)</SelectItem>
                                                <SelectItem value="Organic">Organic (Kitchen Waste)</SelectItem>
                                                <SelectItem value="E-waste">E-waste (Electronics)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="weight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Approximate Weight: {field.value} kg</FormLabel>
                                        <FormControl>
                                            <Slider
                                                min={2}
                                                max={10}
                                                step={0.5}
                                                defaultValue={[field.value]}
                                                onValueChange={(value) => field.onChange(value[0])}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Use the slider to estimate the weight (2kg to 10kg).
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="pickupDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Preferred Pickup Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pickup Address</FormLabel>
                                        <FormControl><Textarea placeholder="Enter your full address for pickup" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Phone Number</FormLabel>
                                        <FormControl><Input type="tel" placeholder="Enter a phone number for coordination" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Schedule Pickup'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
