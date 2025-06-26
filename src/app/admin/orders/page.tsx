import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Server } from "lucide-react";

export default function AdminOrdersPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Customer Orders</CardTitle>
            <CardDescription>A centralized view of all orders placed in the store.</CardDescription>
        </CardHeader>
        <CardContent>
            <Alert>
                <Server className="h-4 w-4" />
                <AlertTitle>Database Integration Required</AlertTitle>
                <AlertDescription>
                    <p className="mb-2">To display a complete list of all customer orders here, the application must be connected to a central database like Firestore.</p>
                    <p className="text-sm text-muted-foreground">Currently, order data is saved in each customer's browser (localStorage) for this prototype. This data is not accessible to the admin panel. A backend database is needed to store and retrieve all orders centrally.</p>
                </AlertDescription>
            </Alert>
        </CardContent>
    </Card>
  )
}
