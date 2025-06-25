import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";

const recentOrders = [
    { id: 'ORD001', customer: 'Ravi Kumar', amount: '₹2,150.00', status: 'Shipped' },
    { id: 'ORD002', customer: 'Priya Sharma', amount: '₹1,500.50', status: 'Processing' },
    { id: 'ORD003', customer: 'Amit Singh', amount: '₹350.00', status: 'Delivered' },
    { id: 'ORD004', customer: 'Sunita Devi', amount: '₹720.00', status: 'Shipped' },
    { id: 'ORD005', customer: 'Vikram Patel', amount: '₹899.75', status: 'Pending' },
]

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
            <div className="text-2xl font-bold">₹1,25,345</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+1,234</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+235</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +5 since last month
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
          <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>A list of the most recent orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentOrders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{order.amount}</TableCell>
                            <TableCell>{order.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
      </Card>
    </div>
  );
}
