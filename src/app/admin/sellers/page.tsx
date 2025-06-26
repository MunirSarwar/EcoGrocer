import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getSellers } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import SellerActions from "./components/seller-actions";

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

  const allSellers = await getSellers();
  const pendingSellers = allSellers.filter(s => s.status === 'pending');
  const otherSellers = allSellers.filter(s => s.status !== 'pending');
  
  return (
    <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Pending Approval</CardTitle>
            <CardDescription>These sellers have registered and are awaiting verification.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Seller</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>PAN</TableHead>
                  <TableHead>GST</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {pendingSellers.length > 0 ? (
                    pendingSellers.map((seller) => (
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
                            <TableCell>{seller.pan}</TableCell>
                            <TableCell>{seller.gst}</TableCell>
                            <TableCell>
                                <SellerActions sellerId={seller.id} />
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            No sellers pending approval.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>All Sellers</CardTitle>
            <CardDescription>A list of all registered sellers with their status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Seller</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Joined On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {otherSellers.length > 0 ? (
                    otherSellers.map((seller) => (
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
                                {seller.status === 'approved' ? (
                                    <Badge variant='default'>Approved</Badge>
                                ) : seller.status === 'rejected' ? (
                                    <Badge variant='destructive'>Rejected</Badge>
                                ) : (
                                    <Badge variant='secondary'>{seller.status}</Badge>
                                )}
                            </TableCell>
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
                        <TableCell colSpan={4} className="h-24 text-center">
                            No active or rejected sellers found.
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
