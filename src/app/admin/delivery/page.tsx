
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getDeliveryPartners } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') return 'N/A';
    const names = name.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.substring(0, 2).toUpperCase();
};

export default async function DeliveryPartnersPage() {
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Partner Data Locked</CardTitle>
                <CardDescription>Configure your backend to see delivery partner information.</CardDescription>
            </CardHeader>
            <CardContent>
                <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Configuration Needed</AlertTitle>
                    <AlertDescription>
                        <p className="mb-2">To view your delivery partners, you need to set up your Firebase Admin credentials in your <strong>.env.local</strong> file.</p>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    )
  }

  const partners = await getDeliveryPartners();
  
  return (
    <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Partners</CardTitle>
            <CardDescription>A list of all registered delivery partners.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Assigned Orders</TableHead>
                  <TableHead className="text-right">Joined On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {partners.length > 0 ? (
                    partners.map((partner) => (
                        <TableRow key={partner.id}>
                            <TableCell>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback>{getInitials(partner.name || '')}</AvatarFallback>
                                    </Avatar>
                                    <div className="font-medium">{partner.name}</div>
                                </div>
                            </TableCell>
                            <TableCell>{partner.email}</TableCell>
                            <TableCell>
                                {partner.emailVerified ? (
                                    <Badge variant='default'>Verified</Badge>
                                ) : (
                                    <Badge variant='secondary'>Pending</Badge>
                                )}
                            </TableCell>
                            <TableCell>{partner.vehicleType}</TableCell>
                            <TableCell className="text-muted-foreground text-xs italic">DB Required</TableCell>
                            <TableCell className="text-right">
                              {new Date(partner.joined).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            No delivery partners found.
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
