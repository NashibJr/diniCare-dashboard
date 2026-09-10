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

type CouponType = "percentage" | "fixed" | "free-shipping";

interface CouponForm {
  code: string;
  couponType: CouponType;
  value: string;
  startDate: string;
  endDate: string;
  usageLimit: string;
}

const initialForm: CouponForm = {
  code: "",
  couponType: "percentage",
  value: "",
  startDate: "",
  endDate: "",
  usageLimit: "",
};

export default function CouponsPage() {
  const [open, setOpen] = useState(false);

  const [coupon, setCoupon] = useState<Coupon | null>(null);

  const [formValues, setFormValues] = useState<CouponForm>(initialForm);

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
      await actions.disableCoupon(id, {
        status: "expired",
      }),
  });

  const createCouponMutation = useMutation({
    mutationKey: ["create-coupon"],
    mutationFn: async (data: {
      code: string;
      couponType: CouponType;
      value: number;
      startDate: string;
      endDate: string;
      usageLimit: number;
    }) => await actions.createCoupon(data),
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

  const handleFormChange = <K extends keyof CouponForm>(
    field: K,
    value: CouponForm[K],
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCouponTypeChange = (value: CouponType) => {
    setFormValues((prev) => ({
      ...prev,
      couponType: value,

      value:
        value === "free-shipping" ? "0" : prev.value === "0" ? "" : prev.value,
    }));
  };

  const handleCloseModal = () => {
    setOpen(false);

    setFormValues(initialForm);
  };

  const handleSubmit = async () => {
    const { code, couponType, value, startDate, endDate, usageLimit } =
      formValues;

    if (!code.trim()) {
      Utils.notify("Coupon code is required");

      return;
    }

    if (!startDate) {
      Utils.notify("Start date is required");

      return;
    }

    if (!endDate) {
      Utils.notify("End date is required");

      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      Utils.notify("End date cannot be before start date");

      return;
    }

    if (couponType !== "free-shipping" && (!value || Number(value) <= 0)) {
      Utils.notify("Coupon value must be greater than zero");

      return;
    }

    if (!usageLimit || Number(usageLimit) <= 0) {
      Utils.notify("Usage limit must be greater than zero");

      return;
    }

    if (couponType === "percentage" && Number(value) > 100) {
      Utils.notify("Percentage discount cannot exceed 100%");

      return;
    }

    const payload = {
      code: code.trim().toUpperCase(),
      couponType,
      value: couponType === "free-shipping" ? 0 : Number(value),
      startDate,
      endDate,
      usageLimit: Number(usageLimit),
    };

    try {
      const { error, message } =
        await createCouponMutation.mutateAsync(payload);

      Utils.notify(error, message, () => {
        handleCloseModal();
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
          <Button
            onClick={() => {
              setFormValues(initialForm);

              setOpen(true);
            }}
          >
            <Plus size={16} />
            Create coupon
          </Button>
        }
      />

      <Suspense isLoading={isLoading}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data?.map((coupon) => (
            <div
              key={coupon._id}
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

      <Modal
        open={open}
        onOpenChange={(value) => {
          if (!value) {
            handleCloseModal();
            return;
          }

          setOpen(value);
        }}
        title="Create coupon"
      >
        <div className="grid gap-4">
          <label className="text-sm font-semibold">
            Coupon code
            <Input
              className="mt-2 uppercase"
              placeholder="e.g. SAVE20"
              value={formValues.code}
              onChange={(event) =>
                handleFormChange("code", event.target.value.toUpperCase())
              }
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Coupon type
              <select
                value={formValues.couponType}
                onChange={(event) =>
                  handleCouponTypeChange(event.target.value as CouponType)
                }
                className="mt-2 h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-primary-500"
              >
                <option value="percentage">Percentage</option>

                <option value="fixed">Fixed amount</option>

                <option value="free-shipping">Free shipping</option>
              </select>
            </label>

            <label className="text-sm font-semibold">
              Value
              <Input
                className="mt-2"
                type="number"
                min={0}
                max={formValues.couponType === "percentage" ? 100 : undefined}
                placeholder={
                  formValues.couponType === "percentage"
                    ? "e.g. 20"
                    : formValues.couponType === "fixed"
                      ? "e.g. 10000"
                      : "0"
                }
                disabled={formValues.couponType === "free-shipping"}
                value={formValues.value}
                onChange={(event) =>
                  handleFormChange("value", event.target.value)
                }
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Start date
              <Input
                className="mt-2"
                type="date"
                value={formValues.startDate}
                onChange={(event) =>
                  handleFormChange("startDate", event.target.value)
                }
              />
            </label>

            <label className="text-sm font-semibold">
              End date
              <Input
                className="mt-2"
                type="date"
                min={formValues.startDate || undefined}
                value={formValues.endDate}
                onChange={(event) =>
                  handleFormChange("endDate", event.target.value)
                }
              />
            </label>
          </div>

          <label className="text-sm font-semibold">
            Usage limit
            <Input
              className="mt-2"
              type="number"
              min={1}
              placeholder="e.g. 100"
              value={formValues.usageLimit}
              onChange={(event) =>
                handleFormChange("usageLimit", event.target.value)
              }
            />
          </label>

          <Button
            disabled={createCouponMutation.isPending}
            onClick={handleSubmit}
          >
            {createCouponMutation.isPending ? "Creating..." : "Create coupon"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
