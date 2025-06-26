'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { approveSeller, rejectSeller } from '../actions';
import { Loader2 } from 'lucide-react';

interface SellerActionsProps {
  sellerId: string;
}

export default function SellerActions({ sellerId }: SellerActionsProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveSeller(sellerId);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const result = await rejectSeller(sellerId);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
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
