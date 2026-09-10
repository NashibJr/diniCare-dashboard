import React from "react";
import { Search } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import DataTableShell from "../components/common/DataTableShell";
import Input from "../components/ui/Input";
import { useQuery } from "@tanstack/react-query";
import actions from "../api/actions/actions";
import Suspense from "../components/common/Suspense";

export default function CustomersPage() {
  const [query, setQuery] = React.useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => await actions.getCustomers(),
  });

  const filtered = React.useMemo(() => {
    if (!data) {
      return [];
    }

    return data.data.filter((customer) =>
      customer.firstName
        .concat(customer.lastName)
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [data]);

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="See customer activity, order history and account status."
      />
      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4">
        <Search size={16} className="text-gray-400" />
        <Input
          className="border-0 bg-gray-50 focus:ring-0"
          placeholder="Search customers..."
          name="query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <Suspense isLoading={isLoading}>
        <DataTableShell>
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400">
              <tr>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Main address</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((customer) => (
                <tr key={customer.email} className="border-t border-gray-100">
                  <td className="px-5 py-4 font-bold">
                    {customer.firstName.concat(` ${customer.lastName}`)}
                  </td>
                  <td className="px-5 py-4 text-gray-500">{customer.email}</td>
                  <td className="px-5 py-4">{customer.email ?? "N/A"}</td>
                  <td className="px-5 py-4">{customer.addresses[0].city}</td>
                  <td className="px-5 py-4">
                    <a
                      href={`/customers/${customer?._id}`}
                      className="font-bold text-primary-500"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataTableShell>
      </Suspense>
    </>
  );
}
