import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        /* Primary - 밝고 산뜻한 그라데이션 */
        default: 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white hover:from-emerald-500 hover:to-teal-600 shadow-sm',
        
        /* Destructive */
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        
        /* Outline - 연한 테두리 */
        outline: 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
        
        /* Secondary */
        secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        
        /* Ghost */
        ghost: 'text-gray-500 hover:bg-gray-100 hover:text-gray-700',
        
        /* Link */
        link: 'text-primary-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 text-sm',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-5 text-sm',
        icon: 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
