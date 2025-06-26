
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function DeliveryDashboardPage() {
  return (
    <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Assigned Deliveries</CardTitle>
            <CardDescription>A list of orders assigned to you for delivery.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No deliveries assigned yet.
                    </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}
