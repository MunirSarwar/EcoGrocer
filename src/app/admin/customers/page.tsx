import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getCustomers } from "./actions"; // Import the updated server action
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') return 'N/A';
    const names = name.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.substring(0, 2).toUpperCase();
};

export default async function CustomersPage() {
  // Check if credentials are set up. If not, show a helpful message.
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Customer Data Locked</CardTitle>
                <CardDescription>Configure your backend to see customer information.</CardDescription>
            </CardHeader>
            <CardContent>
                <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Configuration Needed</AlertTitle>
                    <AlertDescription>
                        <p className="mb-2">To view your customers, you need to set up your Firebase Admin credentials.</p>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                            <li>Go to your Firebase project settings and generate a new service account private key.</li>
                            <li>Create a new file named <strong>.env.local</strong> in your project's root directory.</li>
                            <li>Copy your credentials from the downloaded JSON file into <strong>.env.local</strong>, using <strong>.env.local.example</strong> as a template.</li>
                             <li>Restart your development server for the changes to take effect.</li>
                        </ol>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    )
  }

  const allCustomers = await getCustomers();
  const verifiedCustomers = allCustomers.filter(c => c.emailVerified);
  const pendingCustomers = allCustomers.filter(c => !c.emailVerified);

  return (
    <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Verified Customers</CardTitle>
            <CardDescription>A list of customers who have verified their email address.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Joined On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {verifiedCustomers.length > 0 ? (
                    verifiedCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                            <TableCell>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback>{getInitials(customer.name || '')}</AvatarFallback>
                                    </Avatar>
                                    <div className="font-medium">{customer.name}</div>
                                </div>
                            </TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>
                              <Badge variant='default'>
                                Verified
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {new Date(customer.joined).toLocaleDateString('en-IN', {
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
                            No verified customers found.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Verification</CardTitle>
            <CardDescription>A list of customers who have not yet verified their email address.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Joined On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {pendingCustomers.length > 0 ? (
                    pendingCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                            <TableCell>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback>{getInitials(customer.name || '')}</AvatarFallback>
                                    </Avatar>
                                    <div className="font-medium">{customer.name}</div>
                                </div>
                            </TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>
                              <Badge variant='secondary'>
                                Pending
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {new Date(customer.joined).toLocaleDateString('en-IN', {
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
                            No customers pending verification.
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
