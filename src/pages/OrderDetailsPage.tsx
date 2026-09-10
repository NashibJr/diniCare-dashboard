import PageHeader from "../components/common/PageHeader";
import Card from "../components/ui/Card";
import StatusBadge from "../components/common/StatusBadge";
import Suspense from "../components/common/Suspense";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import actions from "../api/actions/actions";
import { format } from "date-fns";
import Utils from "../utils";

type ParamTypes = {
  id: string;
};

export default function OrderDetailsPage() {
  const { id } = useParams<ParamTypes>();

  const { data, isLoading } = useQuery({
    queryKey: ["get-order-details", id],
    queryFn: async () => await actions.getOrderDetails(id!),
  });

  return (
    <Suspense isLoading={isLoading}>
      <PageHeader
        title={`Order #${data?.orderId ?? "N/A"}`}
        subtitle={`Placed ${format(data?.createdAt ?? new Date(), "MMM dd, yyyy")}`}
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-6">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-black">Order items</h2>
              <StatusBadge status="Delivered" />
            </div>
            <div className="mt-4 grid gap-4">
              {(data?.items ?? []).slice(0, 3).map((item) => (
                <div
                  key={item?.item?._id}
                  className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0"
                >
                  <img
                    src={item?.item?.images?.at(0)}
                    alt={"digniCare"}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-bold">{item?.item?.name ?? "N/A"}</div>
                    <div className="text-xs text-gray-400">
                      Qty {data?.items?.length ?? 0} ·{" "}
                      {item?.item?.category?.name ?? "N/A"}
                    </div>
                  </div>
                  <div className="font-black">UGX{item?.item?.price ?? 0}</div>
                </div>
              ))}
            </div>
          </Card>
          {/* <Card className="p-5">
            <h2 className="font-black">Order timeline</h2>
            <div className="mt-5 grid gap-5 text-sm">
              <div>
                <div className="font-bold">Delivered</div>
                <div className="text-gray-400">Apr 23, 2026 · 10:32 AM</div>
              </div>
              <div>
                <div className="font-bold">Shipped</div>
                <div className="text-gray-400">Apr 21, 2026 · 3:10 PM</div>
              </div>
              <div>
                <div className="font-bold">Payment confirmed</div>
                <div className="text-gray-400">Apr 20, 2026 · 9:25 AM</div>
              </div>
            </div>
          </Card> */}
        </div>
        <div className="grid content-start gap-6">
          <Card className="p-5">
            <h2 className="font-black">Customer</h2>
            <div className="mt-3 text-sm text-gray-600">
              <div className="font-bold text-gray-900">
                {data?.customer
                  ? `${data?.customer?.firstName} ${data?.customer?.lastName}`
                  : data?.customerFullName}
              </div>
              <div>{data?.customer?.email ?? data?.customerEmail ?? "N/A"}</div>
              <div>
                {(data?.customer
                  ? data?.customer?.phone
                  : data?.customerPhone) ?? "N/A"}
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="font-black">Shipping address</h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              {data?.shippingAddress?.country}
              <br />
              {data?.shippingAddress?.city}
              <br />
            </p>
          </Card>
          <Card className="p-5">
            <h2 className="font-black">Payment summary</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>UGX {Utils.formatMoney(data?.totalAmount ?? 0)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax</span>
                <span>UGX 0.00</span>
              </div>
              <div className="flex justify-between font-black">
                <span>Total</span>
                <span>UGX {Utils.formatMoney(data?.totalAmount ?? 0)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Suspense>
  );
}
