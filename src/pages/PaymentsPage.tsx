import { CreditCard, DollarSign } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import MetricCard from "../components/dashboard/MetricCard";
import StatusBadge from "../components/common/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import actions from "../api/actions/actions";
import ShouldRender from "../components/common/ShouldRender";
import Empty from "../components/common/Empty";
import Suspense from "../components/common/Suspense";

const payments = [
  {
    id: "PAY-001",
    customer: "John Doe",
    amount: "$2,464",
    method: "Mastercard",
    status: "Paid",
  },
  {
    id: "PAY-002",
    customer: "Jane Smith",
    amount: "$199",
    method: "PayPal",
    status: "Paid",
  },
  {
    id: "PAY-003",
    customer: "Robert Brown",
    amount: "$89",
    method: "Visa",
    status: "Pending",
  },
];

export default function PaymentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["get-transactions"],
    queryFn: async () => {
      const response = await actions.getTransactions();

      return Array.isArray(response.data)
        ? { data: response.data, total: response.total }
        : { data: [], total: 0 };
    },
  });

  return (
    <>
      <PageHeader
        title="Payments"
        subtitle="Monitor successful payments, pending charges and settlement activity."
      />
      <Suspense isLoading={isLoading}>
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <MetricCard
            icon={DollarSign}
            label="Captured today"
            value="$8,420"
            change="+12.1%"
          />
          <MetricCard
            icon={CreditCard}
            label="Transactions"
            value={data?.total ?? 0}
            change="+7.2%"
          />
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
          <table className="min-w-[700px] w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400">
              <tr>
                <th className="px-5 py-3">Payment Ref</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <ShouldRender shouldRender={data?.data?.length !== 0}>
              <tbody>
                {data?.data.map((item) => (
                  <tr key={item._id} className="border-t border-gray-100">
                    <td className="px-5 py-4 font-bold text-primary-500">
                      {item.reference}
                    </td>
                    <td className="px-5 py-4">
                      {item.customer
                        ? `${item.customer.firstName} ${item.customer.lastName}`
                        : item.customerFullName}
                    </td>
                    <td className="px-5 py-4 font-bold">
                      {item?.customer?.phone ?? item?.customerPhone ?? "N/A"}
                    </td>
                    <td className="px-5 py-4 font-bold">{item.amount}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </ShouldRender>
          </table>
          <ShouldRender shouldRender={data?.data?.length === 0}>
            <Empty />
          </ShouldRender>
        </div>
      </Suspense>
    </>
  );
}
