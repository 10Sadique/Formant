import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] dark:focus-visible:ring-[#6EE7B7] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#1B4332] text-[#FFFFFF] hover:bg-[#143325] border border-[#1B4332] dark:bg-[#265C45] dark:text-[#FFFFFF] dark:hover:bg-[#1E4A37] dark:border-[#265C45]",
        destructive:
          "bg-[#B84A27] text-[#FFFFFF] hover:bg-[#963B1E] border border-[#B84A27] dark:bg-[#B84A27] dark:text-[#FFFFFF] dark:hover:bg-[#963B1E] dark:border-[#B84A27]",
        outline:
          "border border-[#D2CBB8] bg-[#FFFFFF] text-[#141413] hover:bg-[#F4F1EA] dark:border-[#35332E] dark:bg-[#1E1E1B] dark:text-[#F3EFE6] dark:hover:bg-[#2A2925]",
        secondary:
          "border border-[#E5E0D5] bg-[#F4F1EA] text-[#141413] hover:bg-[#EAE5DA] dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#F3EFE6] dark:hover:bg-[#242320]",
        ghost:
          "text-[#4A4842] hover:bg-[#F4F1EA] hover:text-[#141413] dark:text-[#B8B3A8] dark:hover:bg-[#1E1E1B] dark:hover:text-[#F3EFE6]",
        link: "text-[#1B4332] underline-offset-4 hover:underline dark:text-[#6EE7B7]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-6 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
