import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getWasteRequests } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'completed': return 'default';
        case 'scheduled': return 'secondary';
        case 'cancelled': return 'destructive';
        case 'pending':
        default: return 'outline';
    }
}

export default async function WasteCollectionAdminPage() {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Data Locked</CardTitle>
                    <CardDescription>Configure your backend to see waste collection requests.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Configuration Needed</AlertTitle>
                        <AlertDescription>
                            <p>To view waste collection requests, you need to set up your Firebase Admin credentials in your <strong>.env.local</strong> file.</p>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        )
    }

    const requests = await getWasteRequests();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Waste Collection Requests</CardTitle>
                <CardDescription>
                    A list of all waste collection requests from customers.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Pickup Date</TableHead>
                            <TableHead>Waste Type</TableHead>
                            <TableHead>Weight (kg)</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.length > 0 ? (
                            requests.map((request) => (
                                <TableRow key={request.id}>
                                     <TableCell>
                                        <div className="font-medium">{request.customerName}</div>
                                        <div className="text-sm text-muted-foreground">{request.customerEmail}</div>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(request.pickupDate).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </TableCell>
                                    <TableCell>{request.wasteType}</TableCell>
                                    <TableCell>{request.weight} kg</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(request.status)} className="capitalize">
                                            {request.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No waste collection requests found yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
