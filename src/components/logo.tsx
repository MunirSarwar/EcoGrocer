import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Leaf className="w-7 h-7 text-primary" />
      <span className="font-headline text-2xl font-bold text-primary">
        EcoGrocer Hub
      </span>
    </Link>
  );
}
