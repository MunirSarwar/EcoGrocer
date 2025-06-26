'use client';

import Image from "next/image";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProducts, updateProduct, deleteProduct, type Product } from '@/lib/product-service';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  category: z.enum(['Vegetables', 'Fruits', 'Dairy', 'Bakery']),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  image: z.string().url({ message: "Please enter a valid image URL." }),
});

export default function SellerProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof productSchema>>({
      resolver: zodResolver(productSchema),
    });

    useEffect(() => {
        setProducts(getProducts());
    }, []);

    useEffect(() => {
        if (productToEdit) {
            form.reset({
                name: productToEdit.name,
                category: productToEdit.category,
                price: productToEdit.price,
                description: productToEdit.description,
                image: productToEdit.image,
            });
        }
    }, [productToEdit, form]);

    const handleDelete = () => {
        if (!productToDelete) return;

        try {
            deleteProduct(productToDelete.id);
            toast({
                title: "Product Deleted",
                description: `"${productToDelete.name}" has been removed.`,
            });
            setProducts(getProducts());
        } catch (error) {
            console.error("Failed to delete product:", error);
            toast({
                title: "Error",
                description: "Failed to delete the product.",
                variant: "destructive",
            });
        } finally {
            setProductToDelete(null);
        }
    };
    
    const handleEditSubmit = (values: z.infer<typeof productSchema>) => {
        if (!productToEdit) return;
        setLoading(true);

        try {
            const updatedProductData: Product = {
                ...productToEdit,
                ...values
            };
            updateProduct(updatedProductData);

            toast({
                title: "Product Updated",
                description: `"${updatedProductData.name}" has been successfully updated.`,
            });
            setProducts(getProducts());
            setProductToEdit(null);
        } catch (error) {
            console.error("Failed to update product:", error);
            toast({
                title: "Error",
                description: "Failed to update the product.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>My Products</CardTitle>
                    <CardDescription>A list of all products you have listed for sale.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">
                                    <span className="sr-only">Image</span>
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.isArray(products) && products.length > 0 ? (
                                products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="hidden sm:table-cell">
                                            <Image
                                                alt={product.name}
                                                className="aspect-square rounded-md object-cover"
                                                height="64"
                                                src={product.image}
                                                width="64"
                                                data-ai-hint={product.name.toLowerCase().split(' ').slice(0, 2).join(' ')}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{product.category}</Badge>
                                        </TableCell>
                                        <TableCell>₹{product.price}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onSelect={() => setProductToEdit(product)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => setProductToDelete(product)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No products found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product
                            "{productToDelete?.name}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Yes, delete product
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <Dialog open={!!productToEdit} onOpenChange={(open) => !open && setProductToEdit(null)}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>
                            Make changes to your product here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-6 py-4">
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Vegetables">Vegetables</SelectItem>
                                                    <SelectItem value="Fruits">Fruits</SelectItem>
                                                    <SelectItem value="Dairy">Dairy</SelectItem>
                                                    <SelectItem value="Bakery">Bakery</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                                        ₹
                                                    </span>
                                                    <Input
                                                        type="number"
                                                        className="pl-7"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Image URL</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}
