import PageHeader from "../components/common/PageHeader";
import Card from "../components/ui/Card";
import { orders } from "../data/mock";
import StatusBadge from "../components/common/StatusBadge";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import actions from "../api/actions/actions";
import { format } from "date-fns";
import Suspense from "../components/common/Suspense";
import React from "react";
import Utils from "../utils";
import ShouldRender from "../components/common/ShouldRender";
import Empty from "../components/common/Empty";

export type ParamType = {
  id: string;
};

export default function CustomerDetailsPage() {
  const { id } = useParams<ParamType>();

  const { data, isLoading } = useQuery({
    queryKey: ["get-customer-details", id],
    queryFn: async () => await actions.getCustomerDetails(id!),
  });

  const customerOrdersQuery = useQuery({
    queryKey: ["get-customer-orders", id],
    queryFn: async () => {
      const response = await actions.getCustomerOrders(1, 100, id!);

      return Array.isArray(response.data) ? response.data : [];
    },
  });

  const totalSpent = React.useMemo(() => {
    if (!customerOrdersQuery.data) {
      return 0;
    }

    return customerOrdersQuery.data
      ?.filter((order) => order.status === "delivered")
      ?.map((order) => order.totalAmount)
      .reduce((prev, curr) => prev + curr, 0);
  }, [customerOrdersQuery.data]);

  return (
    <>
      <PageHeader
        title={`${data?.firstName} ${data?.lastName}`}
        subtitle={`Customer since ${format(data?.createdAt ?? new Date(), "MMM yyyy")}`}
      />
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="grid content-start gap-6">
          <Suspense isLoading={isLoading}>
            <Card className="p-5">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-50 text-xl font-black text-primary-600">
                {`${data?.firstName?.at(0)}${data?.firstName?.at(1)}`.toUpperCase()}
              </div>
              <h2 className="mt-4 text-xl font-black">{`${data?.firstName} ${data?.lastName}`}</h2>
              <div className="mt-3 text-sm leading-6 text-gray-500">
                {data?.email ?? "N/A"}
                <br />
                {data?.phone ?? "N/A"}
                <br />
                {data?.addresses?.at(0)?.city ?? "N/A"}
              </div>
            </Card>
          </Suspense>
          <Suspense isLoading={customerOrdersQuery.isLoading}>
            <Card className="p-5">
              <h3 className="font-black">Customer value</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-xs text-gray-400">Orders</div>
                  <div className="mt-1 text-xl font-black">
                    {customerOrdersQuery?.data?.length ?? 0}
                  </div>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-xs text-gray-400">Spent</div>
                  <div className="mt-1 text-xl font-black">
                    UGX {Utils.formatMoney(totalSpent ?? 0)}
                  </div>
                </div>
              </div>
            </Card>
          </Suspense>
        </div>
        <Card className="overflow-hidden">
          <div className="p-5">
            <h2 className="font-black">Recent orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-400">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <Suspense isLoading={customerOrdersQuery.isLoading}>
                <ShouldRender
                  shouldRender={customerOrdersQuery.data?.length !== 0}
                >
                  <tbody>
                    {customerOrdersQuery?.data?.slice(0, 4).map((order) => (
                      <tr key={order._id} className="border-t border-gray-100">
                        <td className="px-5 py-4 font-bold text-primary-500">
                          {order._id}
                        </td>
                        <td className="px-5 py-4">
                          {format(
                            order?.createdAt ?? new Date(),
                            "MMM dd, yyyy",
                          )}
                        </td>
                        <td className="px-5 py-4">
                          UGX {Utils.formatMoney(order?.totalAmount ?? 0)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={order?.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </ShouldRender>
              </Suspense>
            </table>
            <ShouldRender
              shouldRender={customerOrdersQuery?.data?.length === 0}
            >
              <Empty />
            </ShouldRender>
          </div>
        </Card>
      </div>
    </>
  );
}
