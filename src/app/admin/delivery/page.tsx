import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getDeliveryPartners } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import PartnerActions from "./components/partner-actions";

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

  const allPartners = await getDeliveryPartners();
  const pendingPartners = allPartners.filter(p => p.status === 'pending');
  const activePartners = allPartners.filter(p => p.status !== 'pending');
  
  return (
    <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Pending Approval</CardTitle>
            <CardDescription>These partners have registered and are awaiting verification.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>License No.</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {pendingPartners.length > 0 ? (
                    pendingPartners.map((partner) => (
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
                            <TableCell>{partner.phone}</TableCell>
                            <TableCell>{partner.licenseNumber}</TableCell>
                            <TableCell>{partner.vehicleType}</TableCell>
                            <TableCell>
                                <PartnerActions partnerId={partner.id} />
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            No partners pending approval.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>All Delivery Partners</CardTitle>
            <CardDescription>A list of all registered delivery partners with their status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead className="text-right">Joined On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {activePartners.length > 0 ? (
                    activePartners.map((partner) => (
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
                                {partner.status === 'approved' ? (
                                    <Badge variant='default'>Approved</Badge>
                                ) : (
                                    <Badge variant='destructive'>Rejected</Badge>
                                )}
                            </TableCell>
                            <TableCell>{partner.vehicleType}</TableCell>
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
                        <TableCell colSpan={5} className="h-24 text-center">
                            No active or rejected delivery partners found.
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
