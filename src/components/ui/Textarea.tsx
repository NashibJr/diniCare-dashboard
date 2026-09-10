import type {TextareaHTMLAttributes} from "react";
import {cn} from "../../lib";
export default function Textarea({className,...props}:TextareaHTMLAttributes<HTMLTextAreaElement>){return <textarea className={cn("min-h-28 w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50",className)} {...props}/>}
