import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, ShoppingCart, Users, Package, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for recently registered users. In a real app, this would be fetched from your database.
const recentUsers = [
  {
    id: 'USR001',
    name: 'Suresh Kumar',
    phone: '+91 9876543210',
    status: 'Verified',
  },
  {
    id: 'USR002',
    name: 'Priya Sharma',
    phone: '+91 9876543211',
    status: 'Verified',
  },
  {
    id: 'USR003',
    name: 'Amit Patel',
    phone: '+91 9876543212',
    status: 'Pending',
  },
  {
    id: 'USR004',
    name: 'Deepika Rao',
    phone: '+91 9876543213',
    status: 'Verified',
  }
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹0</div>
            <p className="text-xs text-muted-foreground">
              +0.0% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+0</div>
            <p className="text-xs text-muted-foreground">
              +0.0% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{recentUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              in the last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0 since last month
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
          <CardHeader>
              <CardTitle>Recent Registrations</CardTitle>
              <CardDescription>A list of the most recent customer sign-ups.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentUsers.length > 0 ? (
                        recentUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>
                                  <Badge variant={user.status === 'Verified' ? 'default' : 'secondary'}>
                                    {user.status}
                                  </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                                No new registrations.
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
