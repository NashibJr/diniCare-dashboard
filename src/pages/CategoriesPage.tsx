import React, { useState } from "react";
import { Edit3, Plus } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import { useMutation, useQuery } from "@tanstack/react-query";
import actions from "../api/actions/actions";
import Utils from "../utils";
import Suspense from "../components/common/Suspense";

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

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-categories"],
    queryFn: async () => {
      const response = await actions.getCategories();

      return Array.isArray(response) ? response : [];
    },
  });

  const createCategoryMutation = useMutation({
    mutationKey: ["create-category"],
    mutationFn: async () => await actions.createCategory(formValues),
  });
  const updateCategoryMutation = useMutation({
    mutationKey: ["update-category", selectedCategory?._id],
    mutationFn: async () =>
      await actions.updateCategory(formValues, selectedCategory?._id!),
  });
  const handleSubmit = React.useCallback(async () => {
    try {
      if (!selectedCategory) {
        const { error, message } = await createCategoryMutation.mutateAsync();
        Utils.notify(error, message, () => {
          handleCloseModal();
          refetch();
        });

        return;
      }

      const { error, message } = await updateCategoryMutation.mutateAsync();
      Utils.notify(error, message, () => {
        handleCloseModal();
        refetch();
      });
    } catch (error) {
      Utils.notify("Network error, please try again");
    }
  }, [createCategoryMutation, updateCategoryMutation, selectedCategory?._id]);

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

      <Suspense isLoading={isLoading}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data?.map((category, index) => (
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

                  {/* <button
                    type="button"
                    className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button> */}
                </div>
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
            disabled={
              createCategoryMutation.isPending ||
              updateCategoryMutation.isPending
            }
          >
            {selectedCategory ? "Update category" : "Save category"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
