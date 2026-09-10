import React, { useEffect, useState } from "react";
import { Edit3, Plus, Search, Trash2, X } from "lucide-react";
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

interface ProductForm {
  name: string;
  category: string;
  price: string;
  status: "active" | "low-stock";
  stock: number;
  description: string;
  images: File[];
  existingImages: string[];
}

const initialForm: ProductForm = {
  name: "",
  category: "",
  price: "",
  status: "active",
  stock: 0,
  description: "",
  images: [],
  existingImages: [],
};

export default function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [remove, setRemove] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [editForm, setEditForm] = useState<ProductForm>(initialForm);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-products"],
    queryFn: async () => {
      const response = await actions.getProducts();

      return Array.isArray(response.data) ? response.data : [];
    },
  });

  const categoryQuery = useQuery({
    queryKey: ["get-categories"],
    queryFn: async () => await actions.getCategories(),
  });

  const deleteProductMutation = useMutation({
    mutationKey: ["delete-product", selectedProduct?._id],

    mutationFn: async () => await actions.deleteProduct(selectedProduct?._id!),
  });

  useEffect(() => {
    if (!selectedProduct) {
      setEditForm(initialForm);
      return;
    }

    setEditForm({
      name: selectedProduct?.name ?? "",
      category: selectedProduct?.category?._id ?? "",
      price: String(selectedProduct?.price ?? ""),
      status: selectedProduct?.status === "low-stock" ? "low-stock" : "active",
      stock: selectedProduct?.stock ?? 0,
      description: selectedProduct?.description ?? "",
      images: [],
      existingImages: selectedProduct?.images ?? [],
    });
  }, [selectedProduct]);

  const handleDelete = React.useCallback(async () => {
    const { error, message } = await deleteProductMutation.mutateAsync();

    Utils.notify(error, message, () => {
      refetch();
      setSelectedProduct(null);
      setRemove(false);
    });
  }, [deleteProductMutation, refetch]);

  const handleEditFormChange = <K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K],
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) {
      return;
    }

    handleEditFormChange("images", Array.from(files));
  };

  const handleRemoveExistingImage = (image: string) => {
    setEditForm((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((item) => item !== image),
    }));
  };

  const updateProductMutation = useMutation({
    mutationKey: ["update-product", selectedProduct?._id],
    mutationFn: async (data: FormData) =>
      await actions.updateProduct(selectedProduct?._id!, data),
  });
  const handleSubmit = React.useCallback(async () => {
    const formData = new FormData();

    formData.append("name", editForm.name.trim());
    formData.append("category", editForm.category);
    formData.append("price", editForm.price);
    formData.append("stock", String(editForm.stock));
    formData.append("status", editForm.status);
    formData.append("description", editForm.description.trim());
    formData.append("existingImages", JSON.stringify(editForm.existingImages));

    editForm.images.forEach((image) => {
      formData.append("images", image);
    });

    if (selectedProduct?._id) {
      formData.append("productId", selectedProduct._id);
    }

    try {
      const { error, message } =
        await updateProductMutation.mutateAsync(formData);
      Utils.notify(error, message, () => {
        setOpen(false);
        setSelectedProduct(null);
        refetch();
      });
    } catch (error) {
      Utils.notify("Something went wrong, please try again later");
    }
  }, [editForm, selectedProduct?._id, updateProductMutation]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setEditForm(initialForm);
    setOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedProduct(null);
    setEditForm(initialForm);
  };

  return (
    <>
      <PageHeader
        title="Products"
        subtitle="Create, price, organize and publish your product catalog."
        actions={
          <Button onClick={handleAddProduct}>
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
      </div>

      <Suspense isLoading={isLoading}>
        <DataTableShell>
          <table className="w-full min-w-[860px] text-left text-sm">
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
                        src={item?.images?.[0]}
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
                        type="button"
                        onClick={() => handleEditProduct(item)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-primary-50 hover:text-primary-500"
                      >
                        <Edit3 size={16} />
                      </button>

                      <button
                        type="button"
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
        onOpenChange={(value) => {
          if (!value) {
            handleCloseModal();
            return;
          }

          setOpen(value);
        }}
        title={selectedProduct ? "Edit product" : "Add product"}
        size="lg"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold sm:col-span-2">
            Product name
            <Input
              className="mt-2"
              placeholder="Product name"
              value={editForm.name}
              onChange={(event) =>
                handleEditFormChange("name", event.target.value)
              }
            />
          </label>

          <label className="text-sm font-semibold">
            Category
            <select
              value={editForm.category}
              onChange={(event) =>
                handleEditFormChange("category", event.target.value)
              }
              className="mt-2 h-10 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none"
            >
              <option value="">Select category</option>

              {categoryQuery.data?.map((cat) => (
                <option key={cat?._id} value={cat?._id}>
                  {cat?.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-semibold">
            Status
            <select
              value={editForm.status}
              onChange={(event) =>
                handleEditFormChange(
                  "status",
                  event.target.value as "active" | "low-stock",
                )
              }
              className="mt-2 h-10 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none"
            >
              <option value="active">Active</option>

              <option value="low-stock">Low stock</option>
            </select>
          </label>

          <label className="text-sm font-semibold">
            Price
            <Input
              className="mt-2"
              type="number"
              min={0}
              placeholder="0.00"
              value={editForm.price}
              onChange={(event) =>
                handleEditFormChange("price", event.target.value)
              }
            />
          </label>

          <label className="text-sm font-semibold">
            Stock
            <Input
              className="mt-2"
              type="number"
              min={0}
              placeholder="0"
              value={editForm.stock}
              onChange={(event) =>
                handleEditFormChange("stock", Number(event.target.value))
              }
            />
          </label>

          <label className="text-sm font-semibold sm:col-span-2">
            Description
            <Textarea
              className="mt-2"
              placeholder="Product description"
              value={editForm.description}
              onChange={(event) =>
                handleEditFormChange("description", event.target.value)
              }
            />
          </label>

          {editForm.existingImages.length > 0 && (
            <div className="sm:col-span-2">
              <p className="text-sm font-semibold">Current images</p>

              <div className="mt-2 flex flex-wrap gap-3">
                {editForm.existingImages.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative">
                    <img
                      src={image}
                      alt={`product-${index + 1}`}
                      className="h-20 w-20 rounded-xl border border-gray-100 object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(image)}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <label className="text-sm font-semibold sm:col-span-2">
            Images
            <Input
              className="mt-2"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagesChange}
            />
          </label>

          {editForm.images.length > 0 && (
            <div className="sm:col-span-2">
              <p className="text-xs text-gray-500">
                {editForm.images.length} new image
                {editForm.images.length > 1 ? "s" : ""} selected
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {editForm.images.map((file) => (
                  <span
                    key={`${file.name}-${file.lastModified}`}
                    className="rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-600"
                  >
                    {file.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={handleCloseModal}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={updateProductMutation.isPending}
          >
            {selectedProduct ? "Update product" : "Save product"}
          </Button>
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
