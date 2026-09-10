import React, { useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import { useMutation } from "@tanstack/react-query";
import actions from "../api/actions/actions";
import Utils from "../utils";

interface Category {
  _id: string;
  name: string;
  slung: string;
  description: string;
  totalProducts: number;
}

interface CategoryForm {
  name: string;
  slung: string;
  description: string;
}

const initialForm: CategoryForm = {
  name: "",
  slung: "",
  description: "",
};

export default function CategoriesPage() {
  const [open, setOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [formValues, setFormValues] = useState<CategoryForm>(initialForm);

  const categories: Category[] = [
    {
      _id: "1",
      name: "Electronics",
      slung: "electronics",
      description: "Electronic products and accessories",
      totalProducts: 120,
    },
    {
      _id: "2",
      name: "Fashion",
      slung: "fashion",
      description: "Clothing and fashion products",
      totalProducts: 107,
    },
    {
      _id: "3",
      name: "Home & Living",
      slung: "home-living",
      description: "Home and lifestyle products",
      totalProducts: 94,
    },
    {
      _id: "4",
      name: "Beauty",
      slung: "beauty",
      description: "Beauty and personal care products",
      totalProducts: 81,
    },
    {
      _id: "5",
      name: "Sports",
      slung: "sports",
      description: "Sports and fitness products",
      totalProducts: 68,
    },
    {
      _id: "6",
      name: "Baby & Kids",
      slung: "baby-kids",
      description: "Products for babies and children",
      totalProducts: 55,
    },
  ];

  const handleFormChange = (field: keyof CategoryForm, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setFormValues(initialForm);
    setOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);

    setFormValues({
      name: category.name,
      slung: category.slung,
      description: category.description,
    });

    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedCategory(null);
    setFormValues(initialForm);
  };

  const createCategoryMutation = useMutation({
    mutationKey: ["create-category"],
    mutationFn: async () => await actions.createCategory(formValues),
  });
  const handleSubmit = React.useCallback(async () => {
    try {
      const { error, message } = await createCategoryMutation.mutateAsync();
      Utils.notify(error, message, () => handleCloseModal());
    } catch (error) {
      Utils.notify("Network error, please try again");
    }
  }, [createCategoryMutation]);

  return (
    <>
      <PageHeader
        title="Categories"
        subtitle="Organize products into shopper-friendly groups."
        actions={
          <Button onClick={handleAddCategory}>
            <Plus size={16} />
            Add category
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category, index) => (
          <div
            key={category._id}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-black">{category.name}</div>

                <div className="mt-1 text-sm text-gray-400">
                  {category.totalProducts} products
                </div>
              </div>

              <div className="flex gap-1">
                <button
                  type="button"
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                  onClick={() => handleEditCategory(category)}
                >
                  <Edit3 size={16} />
                </button>

                <button
                  type="button"
                  className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-primary-500"
                style={{
                  width: `${Math.max(20, 80 - index * 8)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={open}
        onOpenChange={(value) => {
          if (!value) {
            handleCloseModal();
            return;
          }

          setOpen(value);
        }}
        title={selectedCategory ? "Edit category" : "Add category"}
      >
        <div className="grid gap-3">
          <label className="text-sm font-semibold">
            Category name
            <Input
              className="mt-2"
              placeholder="Category name"
              value={formValues.name}
              onChange={(event) => handleFormChange("name", event.target.value)}
            />
          </label>

          <label className="text-sm font-semibold">
            Slug
            <Input
              className="mt-2"
              placeholder="Slug e.g. electronics"
              value={formValues.slung}
              onChange={(event) =>
                handleFormChange("slung", event.target.value)
              }
            />
          </label>

          <label className="text-sm font-semibold">
            Description
            <Input
              className="mt-2"
              placeholder="Description"
              value={formValues.description}
              onChange={(event) =>
                handleFormChange("description", event.target.value)
              }
            />
          </label>

          <Button
            onClick={handleSubmit}
            disabled={createCategoryMutation.isPending}
          >
            {selectedCategory ? "Update category" : "Save category"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
