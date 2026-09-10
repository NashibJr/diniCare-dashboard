import React from "react";
import { Download, Search } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import DataTableShell from "../components/common/DataTableShell";
import StatusBadge from "../components/common/StatusBadge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Suspense from "../components/common/Suspense";
import { useQuery } from "@tanstack/react-query";
import actions from "../api/actions/actions";
import Empty from "../components/common/Empty";
import ShouldRender from "../components/common/ShouldRender";
import Utils from "../utils";
import { format } from "date-fns";

type OrderSearchTypes = {
  customerSearch: string;
  status: string;
};

export default function OrdersPage() {
  const [search, setSearch] = React.useState<OrderSearchTypes>({
    customerSearch: "",
    status: "all",
  });

  const handleChange = (field: "customerSearch" | "status", value: string) =>
    setSearch((prevState) => ({ ...prevState, [field]: value }));

  const { data, isLoading } = useQuery({
    queryKey: ["get-orders"],
    queryFn: async () => {
      const response = await actions.getOrders();
      if (Array.isArray(response.data)) {
        return response.data;
      }

      return [];
    },
  });

  const filtered = React.useMemo(() => {
    if (!data) {
      return [];
    }

    if (search.customerSearch === "" && search.status === "all") {
      return data;
    }

    if (search.customerSearch !== "" && search.status === "all") {
      return data.filter((order) => {
        if (order.customer) {
          return (
            order.customer.firstName
              .toLowerCase()
              .includes(search.customerSearch.toLowerCase()) ||
            order.customer.lastName
              .toLowerCase()
              .includes(search.customerSearch.toLowerCase()) ||
            order.orderId
              .toLowerCase()
              .includes(search.customerSearch.toLowerCase())
          );
        }

        return (
          order.customerFullName
            .toLowerCase()
            .includes(search.customerSearch.toLowerCase()) ||
          order.orderId
            .toLowerCase()
            .includes(search.customerSearch.toLowerCase())
        );
      });
    }

    if (search.status !== "all" && search.customerSearch === "") {
      return data.filter(
        (order) => order.status.toLowerCase() === search.status.toLowerCase(),
      );
    }

    if (search.customerSearch !== "" && search.status !== "all") {
      return data.filter(
        (order) =>
          order.status.toLowerCase() === search.status.toLowerCase() &&
          (order.customer
            ? order.customer.firstName
                .toLowerCase()
                .includes(search.customerSearch.toLowerCase()) ||
              order.customer.lastName
                .toLowerCase()
                .includes(search.customerSearch.toLowerCase()) ||
              order.orderId
                .toLowerCase()
                .includes(search.customerSearch.toLowerCase())
            : order.customerFullName
                .toLowerCase()
                .includes(search.customerSearch.toLowerCase()) ||
              order.orderId
                .toLowerCase()
                .includes(search.customerSearch.toLowerCase())),
      );
    }
  }, [data, search.customerSearch, search.status]);

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle="Manage the full order lifecycle from placement to delivery."
        actions={
          <Button variant="outline">
            <Download size={16} />
            Export
          </Button>
        }
      />
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-gray-50 px-3">
          <Search size={16} className="text-gray-400" />
          <Input
            className="border-0 bg-transparent px-0 focus:ring-0"
            placeholder="Search order or customer..."
            value={search.customerSearch}
            onChange={(event) =>
              handleChange("customerSearch", event.target.value)
            }
          />
        </div>
        <select
          className="h-10 outline-none cursor-pointer rounded-xl border border-gray-200 bg-white px-3 text-sm"
          value={search.status}
          onChange={(event) => handleChange("status", event.target.value)}
        >
          <option value={"all"}>All statuses</option>
          <option value={"pending"}>Pending</option>
          <option value={"processing"}>Processing</option>
          <option value={"shipped"}>Shipped</option>
          <option value={"delivered"}>Delivered</option>
        </select>
      </div>
      <Suspense isLoading={isLoading}>
        <DataTableShell>
          <table className="min-w-[780px] w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <ShouldRender
              shouldRender={Array.isArray(filtered) && filtered.length > 0}
            >
              <tbody>
                {filtered?.map((order) => (
                  <tr key={order._id} className="border-t border-gray-100">
                    <td className="px-5 py-4 font-bold text-primary-500">
                      {order.orderId}
                    </td>
                    <td className="px-5 py-4">
                      {order.customer
                        ? `${order.customer.firstName} ${order.customer.lastName}`
                        : order.customerFullName}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {format(order.createdAt ?? new Date(), "MMM dd, yyyy")}
                    </td>
                    <td className="px-5 py-4 font-semibold">
                      UGX {Utils.formatMoney(order?.totalAmount ?? 0)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={`/orders/${order._id}`}
                        className="font-bold text-primary-500"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ShouldRender>
          </table>
          <ShouldRender shouldRender={filtered?.length === 0}>
            <Empty />
          </ShouldRender>
        </DataTableShell>
      </Suspense>
    </>
  );
}
