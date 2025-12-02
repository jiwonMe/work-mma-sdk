import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '../lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer shrink-0 h-4 w-4 rounded border border-gray-300 transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30',
      'hover:border-primary-400',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500 data-[state=checked]:text-white',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className={cn('h-3 w-3 stroke-[2.5]')} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
