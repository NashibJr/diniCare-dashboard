import React, { useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import StatusBadge from "../components/common/StatusBadge";
import { useMutation, useQuery } from "@tanstack/react-query";
import actions from "../api/actions/actions";
import Suspense from "../components/common/Suspense";
import { Coupon } from "../response.type";
import Utils from "../utils";

export default function CouponsPage() {
  const [open, setOpen] = useState(false);
  const [coupon, setCoupon] = React.useState<Coupon | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-coupons"],
    queryFn: async () => {
      const response = await actions.getCoupons();

      return Array.isArray(response.data) ? response.data : [];
    },
  });

  const disableMutation = useMutation({
    mutationKey: ["disable", coupon?._id],
    mutationFn: async (id: string) =>
      await actions.disableCoupon(id, { status: "expired" }),
  });
  const handleDisable = async (id: string) => {
    try {
      const { message, error } = await disableMutation.mutateAsync(id);
      Utils.notify(error, message, () => {
        refetch();
      });
    } catch (error) {
      Utils.notify("Network error");
    }
  };

  return (
    <>
      <PageHeader
        title="Coupons & promotions"
        subtitle="Create offers, set usage rules and track campaign adoption."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus size={16} />
            Create coupon
          </Button>
        }
      />
      <Suspense isLoading={isLoading}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data?.map((coupon) => (
            <div
              key={coupon.code}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-black tracking-wide">{coupon.code}</div>
                  <div className="mt-1 text-sm text-primary-500">
                    {coupon?.value} {coupon?.couponType} off
                  </div>
                </div>
                <StatusBadge status={coupon.status} />
              </div>
              <div className="mt-6 text-xs text-gray-400">Usage</div>
              <div className="mt-1 text-sm font-bold">
                {coupon?.usageCount}/{coupon?.usageLimit}
              </div>
              <div className="mt-4 flex gap-2">
                {/* <Button size="sm" variant="outline" className="flex-1">
                Edit
              </Button> */}
                <Button
                  size="sm"
                  variant="danger"
                  disabled={
                    coupon.status === "expired" || disableMutation.isPending
                  }
                  onClick={() => {
                    setCoupon(coupon);
                    handleDisable(coupon?._id);
                  }}
                >
                  Disable
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Suspense>
      <Modal open={open} onOpenChange={setOpen} title="Create coupon">
        <div className="grid gap-3">
          <Input placeholder="Coupon code" />
          <div className="grid grid-cols-2 gap-3">
            <select className="h-10 rounded-xl border border-gray-200 px-3 text-sm">
              <option>Percentage</option>
              <option>Fixed amount</option>
              <option>Free shipping</option>
            </select>
            <Input type="number" placeholder="Value" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input type="date" />
            <Input type="date" />
          </div>
          <Input type="number" placeholder="Usage limit" />
          <Button onClick={() => setOpen(false)}>Create coupon</Button>
        </div>
      </Modal>
    </>
  );
}
