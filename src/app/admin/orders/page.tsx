import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAllOrders } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default async function AdminOrdersPage() {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Orders Data Locked</CardTitle>
                    <CardDescription>Configure your backend to see customer orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Configuration Needed</AlertTitle>
                        <AlertDescription>
                            <p>To view your customer orders, you need to set up your Firebase Admin credentials in your <strong>.env.local</strong> file.</p>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        )
    }

    const orders = await getAllOrders();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Customer Orders</CardTitle>
                <CardDescription>
                    A list of all orders placed in your store.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>
                                        <div className="font-medium">#{order.id.substring(0, 8).toUpperCase()}</div>
                                        <div className="text-xs text-muted-foreground hidden md:block">{order.id}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{order.customerName}</div>
                                        <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                                    </TableCell>
                                     <TableCell>
                                        {new Date(order.date).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{order.items.length}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        ₹{order.total.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No orders found yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
