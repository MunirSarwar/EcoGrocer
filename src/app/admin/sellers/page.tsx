import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getSellers } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') return 'N/A';
    const names = name.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.substring(0, 2).toUpperCase();
};

export default async function SellersPage() {
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Seller Data Locked</CardTitle>
                <CardDescription>Configure your backend to see seller information.</CardDescription>
            </CardHeader>
            <CardContent>
                <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Configuration Needed</AlertTitle>
                    <AlertDescription>
                        <p className="mb-2">To view your sellers, you need to set up your Firebase Admin credentials in your <strong>.env.local</strong> file.</p>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    )
  }

  const sellers = await getSellers();
  
  return (
    <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Verified Sellers</CardTitle>
            <CardDescription>A list of sellers who have completed registration.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Seller</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>PAN/GST</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead className="text-right">Joined On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {sellers.length > 0 ? (
                    sellers.map((seller) => (
                        <TableRow key={seller.id}>
                            <TableCell>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback>{getInitials(seller.name || '')}</AvatarFallback>
                                    </Avatar>
                                    <div className="font-medium">{seller.name}</div>
                                </div>
                            </TableCell>
                            <TableCell>{seller.email}</TableCell>
                            <TableCell>
                                {seller.emailVerified ? (
                                    <Badge variant='default'>Verified</Badge>
                                ) : (
                                    <Badge variant='secondary'>Pending</Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs italic">DB Required</TableCell>
                            <TableCell className="text-muted-foreground text-xs italic">DB Required</TableCell>
                            <TableCell className="text-right">
                              {new Date(seller.joined).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            No sellers found.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}
