import {ResponsiveContainer,PieChart,Pie,Cell,Tooltip,Legend} from "recharts";
import {categoryData} from "../../data/mock";
export default function CategoryChart(){const colors=["#f72585","#f8c700","#6b7280","#a855f7","#14b8a6"];return <div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={90} paddingAngle={3}>{categoryData.map((item,index)=><Cell key={item.name} fill={colors[index%colors.length]}/>)}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer></div>}
