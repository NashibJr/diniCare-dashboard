import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib";
export default function Input({className,...props}:InputHTMLAttributes<HTMLInputElement>){return <input className={cn("h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-primary-400 focus:ring-4 focus:ring-primary-50",className)} {...props}/>}
