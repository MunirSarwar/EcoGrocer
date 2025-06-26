'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { approvePartner, rejectPartner } from '../actions';
import { Loader2 } from 'lucide-react';

interface PartnerActionsProps {
  partnerId: string;
}

export default function PartnerActions({ partnerId }: PartnerActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approvePartner(partnerId);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        // router.refresh() is handled by revalidatePath in the server action
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const result = await rejectPartner(partnerId);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        // router.refresh() is handled by revalidatePath in the server action
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    });
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={handleApprove} disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Approve
      </Button>
      <Button size="sm" variant="outline" onClick={handleReject} disabled={isPending}>
        Reject
      </Button>
    </div>
  );
}
