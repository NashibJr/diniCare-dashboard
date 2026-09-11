import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

type CategoryChartTypes = {
  data: {
    name: string;
    value: number | undefined;
  }[];
};

export default function CategoryChart({ data }: CategoryChartTypes) {
  const colors = ["#f72585", "#f8c700", "#6b7280", "#a855f7", "#14b8a6"];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={58}
            outerRadius={90}
            paddingAngle={3}
          >
            {data?.map((item, index) => (
              <Cell key={item.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
