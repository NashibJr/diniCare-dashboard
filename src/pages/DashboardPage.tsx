import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import MetricCard from "../components/dashboard/MetricCard";
import SalesChart from "../components/dashboard/SalesChart";
import CategoryChart from "../components/dashboard/CategoryChart";
import Card from "../components/ui/Card";
import StatusBadge from "../components/common/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import actions from "../api/actions/actions";
import Suspense from "../components/common/Suspense";
import { format } from "date-fns";
import { money } from "../lib";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["get-orders"],
    queryFn: async () => {
      const response = await actions.getOrders(1, 5);

      return Array.isArray(response.data) ? response.data : [];
    },
  });

  const dashboardStats = useQuery({
    queryKey: ["get-dashboard-stats"],
    queryFn: async () => await actions.getDashboardMetrics(),
  });

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="A complete snapshot of store performance and operations."
      />
      <Suspense isLoading={dashboardStats.isLoading}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={DollarSign}
            label="Total sales"
            value={money(dashboardStats?.data?.totalSales?.value ?? 0)}
            change={`+${dashboardStats?.data?.totalSales?.change ?? 0}%`}
          />
          <MetricCard
            icon={ShoppingCart}
            label="Total orders"
            value={dashboardStats?.data?.totalOrders?.value ?? 0}
            change={`+${dashboardStats?.data?.totalOrders?.change}%`}
          />
          <MetricCard
            icon={Users}
            label="Customers"
            value={dashboardStats?.data?.customers?.value ?? 0}
            change={`+${dashboardStats?.data?.customers?.change}%`}
          />
          <MetricCard
            icon={Package}
            label="Products"
            value={dashboardStats?.data?.products?.value ?? 0}
            change={`+${dashboardStats?.data?.products?.change}%`}
          />
        </div>
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-black">Sales overview</h2>
                <p className="text-xs text-gray-400">Last 7 days</p>
              </div>
              <button className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold">
                Last 7 days
              </button>
            </div>
            <SalesChart
              data={(dashboardStats?.data?.salesOverview ?? [])?.flatMap(
                (stat) => [
                  { name: stat?.label, sales: stat?.sales, orders: 0 },
                ],
              )}
            />
          </Card>
          <Card className="p-5">
            <h2 className="font-black">Top categories</h2>
            <p className="text-xs text-gray-400">Sales share</p>
            <CategoryChart
              data={(dashboardStats?.data?.topCategories ?? [])?.flatMap(
                (item) => [{ name: item?.name, value: item?.sales ?? 0 }],
              )}
            />
          </Card>
        </div>
      </Suspense>
      <Card className="mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <h2 className="font-black">Recent orders</h2>
          <a className="text-sm font-bold text-primary-500" href="/orders">
            View all
          </a>
        </div>
        <Suspense isLoading={isLoading}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-400">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((order) => (
                  <tr key={order?._id} className="border-t border-gray-100">
                    <td className="px-5 py-4 font-bold text-primary-500">
                      {order?.orderId}
                    </td>
                    <td className="px-5 py-4">
                      {order?.customer
                        ? `${order?.customer?.firstName} ${order?.customer?.lastName}`
                        : order?.customerFullName}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {format(order?.createdAt ?? new Date(), "MMM dd, yyyy")}
                    </td>
                    <td className="px-5 py-4 font-semibold">
                      {money(order?.totalAmount ?? 0)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Suspense>
      </Card>
    </>
  );
}
