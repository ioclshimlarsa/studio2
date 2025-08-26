import { Tent } from 'lucide-react';
import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <div className={cn("flex items-center gap-2 text-primary", className)} {...props}>
      <Tent className="h-7 w-7" />
      <span className="text-xl font-bold font-headline">Bharat Scouts and Guides CampConnect Punjab</span>
    </div>
  );
}
