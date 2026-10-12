import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-[#D2CBB8] bg-[#FBF9F5] px-3.5 py-2 text-sm text-[#141413] placeholder:text-[#78756E] focus-visible:border-[#1B4332] focus-visible:bg-[#FFFFFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] disabled:cursor-not-allowed disabled:opacity-50 shadow-none dark:border-[#35332E] dark:bg-[#161614] dark:text-[#F3EFE6] dark:placeholder:text-[#6E6A61] dark:focus-visible:border-[#6EE7B7] dark:focus-visible:bg-[#1E1E1B] dark:focus-visible:ring-[#6EE7B7]",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "block text-xs font-semibold uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8] peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B4332] dark:focus:ring-[#6EE7B7] shadow-none",
  {
    variants: {
      variant: {
        default:
          "border-[#1B4332] bg-[#E9F2EE] text-[#1B4332] dark:border-[rgba(110,231,183,0.35)] dark:bg-[rgba(38,92,69,0.35)] dark:text-[#6EE7B7]",
        secondary:
          "border-[#D2CBB8] bg-[#F4F1EA] text-[#4A4842] dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#B8B3A8]",
        terracotta:
          "border-[#E8C5B8] bg-[#F9ECE8] text-[#B84A27] dark:border-[rgba(244,162,97,0.35)] dark:bg-[rgba(184,74,39,0.25)] dark:text-[#F4A261]",
        outline:
          "border-[#E5E0D5] bg-[#FFFFFF] text-[#141413] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#F3EFE6]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export function Progress({
  value = 0,
  label,
  className,
}: {
  value?: number;
  label?: string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || "Progress indicator"}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-[#E5E0D5] dark:bg-[#2E2D29]", className)}
    >
      <div
        style={{ width: `${clamped}%` }}
        className="h-full bg-[#1B4332] dark:bg-[#265C45] transition-all duration-200"
      />
    </div>
  );
}
