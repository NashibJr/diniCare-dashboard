import React, { useState } from "react";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import DataTableShell from "../components/common/DataTableShell";
import StatusBadge from "../components/common/StatusBadge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Textarea from "../components/ui/Textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import actions from "../api/actions/actions";
import Suspense from "../components/common/Suspense";
import Utils from "../utils";
import { Product } from "../response.type";

export default function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [remove, setRemove] = useState(false);

  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null,
  );

  const { data, isLoading } = useQuery({
    queryKey: ["get-products"],
    queryFn: async () => {
      const response = await actions.getProducts();

      return Array.isArray(response.data) ? response.data : [];
    },
  });

  const deleteProductMutation = useMutation({
    mutationKey: ["delete-product", selectedProduct?._id],
    mutationFn: async () => await actions.deleteProduct(selectedProduct?._id!),
  });
  const handleDelete = React.useCallback(async () => {
    const { error, message } = await deleteProductMutation.mutateAsync();
    Utils.notify(error, message, () => {
      setSelectedProduct(null);
      setRemove(false);
    });
  }, [selectedProduct, deleteProductMutation]);

  return (
    <>
      <PageHeader
        title="Products"
        subtitle="Create, price, organize and publish your product catalog."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus size={16} />
            Add product
          </Button>
        }
      />
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-gray-50 px-3">
          <Search size={16} className="text-gray-400" />
          <Input
            className="border-0 bg-transparent px-0 focus:ring-0"
            placeholder="Search products..."
          />
        </div>
        {/* <select className="h-10 rounded-xl border border-gray-200 px-3 text-sm">
          <option>All categories</option>
          <option>Electronics</option>
          <option>Fashion</option>
        </select>
        <select className="h-10 rounded-xl border border-gray-200 px-3 text-sm">
          <option>All statuses</option>
          <option>Active</option>
          <option>Low stock</option>
        </select> */}
      </div>
      <Suspense isLoading={isLoading}>
        <DataTableShell>
          <table className="min-w-[860px] w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item) => (
                <tr key={item?._id} className="border-t border-gray-100">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item?.images?.at(1)}
                        alt={`digniCare-${item?.name}`}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <span className="font-bold">{item?.name ?? "N/A"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {item?.category?.name ?? "N/A"}
                  </td>
                  <td className="px-5 py-4 font-semibold">
                    UGX {Utils.formatMoney(item.price ?? 0)}
                  </td>
                  <td className="px-5 py-4">{item?.stock ?? 0}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={item?.status ?? "N/A"} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(item);
                          setOpen(true);
                        }}
                        className="rounded-lg p-2 text-gray-500 hover:bg-primary-50 hover:text-primary-500"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(item);
                          setRemove(true);
                        }}
                        className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataTableShell>
      </Suspense>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Add / edit product"
        size="lg"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold sm:col-span-2">
            Product name
            <Input className="mt-2" placeholder="Product name" />
          </label>
          <label className="text-sm font-semibold">
            Category
            <select className="mt-2 h-10 w-full rounded-xl border border-gray-200 px-3 text-sm">
              <option>Electronics</option>
              <option>Fashion</option>
            </select>
          </label>
          <label className="text-sm font-semibold">
            Brand
            <Input className="mt-2" placeholder="Brand" />
          </label>
          <label className="text-sm font-semibold">
            Price
            <Input className="mt-2" type="number" placeholder="0.00" />
          </label>
          <label className="text-sm font-semibold">
            Stock
            <Input className="mt-2" type="number" placeholder="0" />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            Description
            <Textarea className="mt-2" placeholder="Product description" />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            Images
            <Input className="mt-2" type="file" multiple />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Save product</Button>
        </div>
      </Modal>
      <Modal open={remove} onOpenChange={setRemove} title="Delete product?">
        <p className="text-sm text-gray-500">
          This action removes the product from the catalog. You can instead
          deactivate it if you want to keep historical data.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setRemove(false);
              setSelectedProduct(null);
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={deleteProductMutation.isPending}
            variant="danger"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
