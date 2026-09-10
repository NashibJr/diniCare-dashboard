import type { HTMLAttributes } from "react";
import { cn } from "../../lib";

export default function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700",
        className,
      )}
      {...props}
    />
  );
}
