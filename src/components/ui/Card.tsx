import type { HTMLAttributes } from "react";
import { cn } from "../../lib";

export default function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-100 bg-white shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
