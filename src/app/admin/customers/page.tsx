import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// In a real application, this data would be fetched from your backend,
// which would use the Firebase Admin SDK to list all authenticated users.
const allCustomers = [
  {
    id: 'USR001',
    name: 'Suresh Kumar',
    email: 'suresh.k@example.com',
    emailVerified: true,
    joined: '2023-10-25',
  },
  {
    id: 'USR002',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    emailVerified: true,
    joined: '2023-10-24',
  },
  {
    id: 'USR003',
    name: 'Amit Patel',
    email: 'amit.p@example.com',
    emailVerified: false,
    joined: '2023-10-24',
  },
  {
    id: 'USR004',
    name: 'Deepika Rao',
    email: 'deepika.rao@example.com',
    emailVerified: true,
    joined: '2023-10-23',
  },
   {
    id: 'USR005',
    name: 'Rajesh Singh',
    email: 'rajesh.singh@example.com',
    emailVerified: true,
    joined: '2023-10-22',
  },
   {
    id: 'USR006',
    name: 'Anita Desai',
    email: 'anita.d@example.com',
    emailVerified: false,
    joined: '2023-10-21',
  },
];

const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.substring(0, 2).toUpperCase();
};

export default function CustomersPage() {
  const verifiedCustomers = allCustomers.filter(customer => customer.emailVerified);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verified Customers</CardTitle>
        <CardDescription>A list of all customers who have verified their email address.</CardDescription>
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
                                    <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{customer.name}</div>
                            </div>
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>
                          <Badge variant={customer.emailVerified ? 'default' : 'secondary'}>
                            {customer.emailVerified ? 'Verified' : 'Unverified'}
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
  );
}
