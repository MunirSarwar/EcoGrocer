import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const customers = [
  {
    id: 'USR001',
    name: 'Suresh Kumar',
    email: 'suresh.k@example.com',
    status: 'Verified',
    joined: '2023-10-25',
  },
  {
    id: 'USR002',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    status: 'Verified',
    joined: '2023-10-24',
  },
  {
    id: 'USR003',
    name: 'Amit Patel',
    email: 'amit.p@example.com',
    status: 'Pending Verification',
    joined: '2023-10-24',
  },
  {
    id: 'USR004',
    name: 'Deepika Rao',
    email: 'deepika.rao@example.com',
    status: 'Verified',
    joined: '2023-10-23',
  },
   {
    id: 'USR005',
    name: 'Rajesh Singh',
    email: 'rajesh.singh@example.com',
    status: 'Verified',
    joined: '2023-10-22',
  },
   {
    id: 'USR006',
    name: 'Anita Desai',
    email: 'anita.d@example.com',
    status: 'Pending Verification',
    joined: '2023-10-21',
  },
];

const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.substring(0, 2).toUpperCase();
};

export default function CustomersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
        <CardDescription>A list of all registered customers on EcoGrocer Hub.</CardDescription>
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
             {customers.length > 0 ? (
                customers.map((customer) => (
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
                          <Badge variant={customer.status === 'Verified' ? 'default' : 'secondary'}>
                            {customer.status}
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
                        No customers found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
