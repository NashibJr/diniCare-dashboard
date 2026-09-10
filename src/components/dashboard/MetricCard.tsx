import type { LucideIcon } from "lucide-react";
import Card from "../ui/Card";
export default function MetricCard({
  icon: Icon,
  label,
  value,
  change,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-gray-500">{label}</div>
          <div className="mt-2 text-2xl font-black text-gray-950">{value}</div>
          <div className="mt-2 text-xs font-bold text-emerald-600">
            {change}{" "}
            <span className="font-normal text-gray-400">vs last period</span>
          </div>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-50 text-primary-500">
          <Icon size={20} />
        </div>
      </div>
    </Card>
  );
}
