import {DollarSign,ShoppingBag,TrendingUp,Users} from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import MetricCard from "../components/dashboard/MetricCard";
import SalesChart from "../components/dashboard/SalesChart";
import OrdersChart from "../components/dashboard/OrdersChart";
import CategoryChart from "../components/dashboard/CategoryChart";
import Card from "../components/ui/Card";

export default function AnalyticsPage(){return <><PageHeader title="Analytics" subtitle="Measure revenue, orders, conversion and product mix."/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard icon={DollarSign} label="Revenue" value="$24,560" change="+14.2%"/><MetricCard icon={ShoppingBag} label="Orders" value="802" change="+9.3%"/><MetricCard icon={Users} label="Customers" value="1,245" change="+12.6%"/><MetricCard icon={TrendingUp} label="Conversion" value="5.2%" change="+0.8%"/></div><div className="mt-6 grid gap-6 xl:grid-cols-2"><Card className="p-5"><h2 className="font-black">Revenue trend</h2><p className="mb-4 text-xs text-gray-400">Last 7 days</p><SalesChart/></Card><Card className="p-5"><h2 className="font-black">Orders trend</h2><p className="mb-4 text-xs text-gray-400">Daily completed orders</p><OrdersChart/></Card></div><Card className="mt-6 p-5"><h2 className="font-black">Sales by category</h2><p className="text-xs text-gray-400">Revenue mix</p><CategoryChart/></Card></>}
