"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "accentlab-select-trigger flex h-10 w-full items-center justify-between rounded-lg border border-[#D2CBB8] bg-[#FBF9F5] px-3.5 py-2 text-sm text-[#141413] transition-colors placeholder:text-[#78756E] hover:border-[#1B4332]/60 focus:outline-none focus:border-[#1B4332] disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:border-[#35332E] dark:bg-[#161614] dark:text-[#F3EFE6] dark:placeholder:text-[#6E6A61] dark:hover:border-[#6EE7B7]/60 dark:focus:border-[#6EE7B7]",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown
        className="h-4 w-4 text-[#78756E] shrink-0 transition-transform duration-150 dark:text-[#9E9A90]"
        aria-hidden="true"
      />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center border-b border-[#EFECE4] bg-[#FBF9F5] py-1 text-[#4A4842] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#B8B3A8]",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-3.5 w-3.5" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center border-t border-[#EFECE4] bg-[#FBF9F5] py-1 text-[#4A4842] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#B8B3A8]",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-3.5 w-3.5" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "accentlab-select-content relative z-50 max-h-72 min-w-[8rem] overflow-hidden rounded-lg border border-[#D2CBB8] bg-[#FFFFFF] text-[#141413] dark:border-[#35332E] dark:bg-[#1E1E1B] dark:text-[#F3EFE6]",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "accentlab-select-viewport p-1.5 bg-[#FFFFFF] dark:bg-[#1E1E1B] no-scrollbar",
          position === "popper" &&
            "w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-xs font-semibold text-[#78756E] dark:text-[#9E9A90]", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "accentlab-select-item relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-3 text-xs sm:text-sm text-[#141413] outline-none transition-colors hover:bg-[#F4F1EA] focus:bg-[#E9F2EE] focus:text-[#1B4332] data-[state=checked]:bg-[#E9F2EE] data-[state=checked]:font-semibold data-[state=checked]:text-[#1B4332] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:text-[#F3EFE6] dark:hover:bg-[#2A2925] dark:focus:bg-[rgba(38,92,69,0.35)] dark:focus:text-[#6EE7B7] dark:data-[state=checked]:bg-[rgba(38,92,69,0.35)] dark:data-[state=checked]:text-[#6EE7B7]",
      className
    )}
    {...props}
  >
    <span className="absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-3.5 w-3.5 text-[#1B4332] dark:text-[#6EE7B7]" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-[#E5E0D5] dark:bg-[#2E2D29]", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
