import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "UGX" }).format(
    value,
  );
