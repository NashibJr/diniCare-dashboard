import type {ReactNode} from "react";
export default function DataTableShell({children}:{children:ReactNode}){return <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">{children}</div>}
