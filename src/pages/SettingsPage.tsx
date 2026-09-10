import { useEffect, useState } from "react";
import { LockKeyhole, Plus, Trash2 } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import ChangePasswordModal from "../components/dashboard/ChangePasswordModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import actions from "../api/actions/actions";
import Suspense from "../components/common/Suspense";
import Utils from "../utils";

interface AddressForm {
  _id?: string;
  label: string;
  street: string;
  zipCode: string;
  city: string;
}

interface AccountForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addresses: AddressForm[];
}

const initialForm: AccountForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  addresses: [],
};

export default function SettingsPage() {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const [formValues, setFormValues] = useState<AccountForm>(initialForm);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-loggedinuser"],
    queryFn: async () => await actions.getLoggedinAcc(),
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    const account = data;

    setFormValues({
      firstName: account?.firstName ?? "",
      lastName: account?.lastName ?? "",
      email: account?.email ?? "",
      phone: account?.phone ?? "",
      addresses:
        account?.addresses?.map((address) => ({
          _id: address?._id,
          label: address?.label ?? "",
          street: address?.street ?? "",
          zipCode: address?.zipCode ?? "",
          city: address?.city ?? "",
        })) ?? [],
    });
  }, [data]);

  const handleFormChange = (
    field: keyof Omit<AccountForm, "addresses">,
    value: string,
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (
    index: number,
    field: keyof Omit<AddressForm, "_id">,
    value: string,
  ) => {
    setFormValues((prev) => ({
      ...prev,
      addresses: prev.addresses.map((address, addressIndex) =>
        addressIndex === index
          ? {
              ...address,
              [field]: value,
            }
          : address,
      ),
    }));
  };

  const handleAddAddress = () => {
    setFormValues((prev) => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        {
          label: "",
          street: "",
          zipCode: "",
          city: "",
        },
      ],
    }));
  };

  const handleRemoveAddress = (index: number) => {
    setFormValues((prev) => ({
      ...prev,
      addresses: prev.addresses.filter(
        (_, addressIndex) => addressIndex !== index,
      ),
    }));
  };

  const updateMutation = useMutation({
    mutationKey: ["update-account"],
    mutationFn: async (data: unknown) => await actions.updateAcc(data),
  });
  const handleSubmit = async () => {
    const payload = {
      firstName: formValues.firstName.trim(),
      lastName: formValues.lastName.trim(),
      email: formValues.email.trim(),
      phone: formValues.phone.trim(),

      addresses: formValues.addresses.map((address) => ({
        ...(address._id && {
          _id: address._id,
        }),
        label: address.label.trim(),
        street: address.street.trim(),
        zipCode: address.zipCode.trim(),
        city: address.city.trim(),
      })),
    };

    try {
      const { message, error } = await updateMutation.mutateAsync(payload);
      Utils.notify(error, message, () => {
        refetch();
      });
    } catch (error) {
      Utils.notify("Something went wrong");
    }
  };

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage your personal information, addresses and account security."
      />

      <Suspense isLoading={isLoading}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-7">
            <div>
              <h2 className="text-xl font-black">Personal information</h2>

              <p className="mt-1 text-sm text-gray-400">
                Update your personal and contact information.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                First name
                <Input
                  className="mt-2"
                  placeholder="First name"
                  value={formValues.firstName}
                  onChange={(event) =>
                    handleFormChange("firstName", event.target.value)
                  }
                />
              </label>

              <label className="text-sm font-semibold">
                Last name
                <Input
                  className="mt-2"
                  placeholder="Last name"
                  value={formValues.lastName}
                  onChange={(event) =>
                    handleFormChange("lastName", event.target.value)
                  }
                />
              </label>

              <label className="text-sm font-semibold">
                Email address
                <Input
                  className="mt-2"
                  type="email"
                  placeholder="Email address"
                  value={formValues.email}
                  onChange={(event) =>
                    handleFormChange("email", event.target.value)
                  }
                />
              </label>

              <label className="text-sm font-semibold">
                Phone number
                <Input
                  className="mt-2"
                  type="tel"
                  placeholder="Phone number"
                  value={formValues.phone}
                  onChange={(event) =>
                    handleFormChange("phone", event.target.value)
                  }
                />
              </label>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-black">Addresses</h2>

                  <p className="mt-1 text-sm text-gray-400">
                    Manage your saved delivery addresses.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddAddress}
                >
                  <Plus size={16} />
                  Add address
                </Button>
              </div>

              {formValues.addresses.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-gray-200 p-6 text-center">
                  <p className="text-sm text-gray-400">
                    No addresses added yet.
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid gap-4">
                  {formValues.addresses.map((address, index) => (
                    <div
                      key={address._id ?? index}
                      className="rounded-2xl border border-gray-100 bg-gray-50/40 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-bold">
                          {address.label || `Address ${index + 1}`}
                        </h3>

                        <button
                          type="button"
                          onClick={() => handleRemoveAddress(index)}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="text-sm font-semibold">
                          Label
                          <Input
                            className="mt-2"
                            placeholder="e.g. Home, Office"
                            value={address.label}
                            onChange={(event) =>
                              handleAddressChange(
                                index,
                                "label",
                                event.target.value,
                              )
                            }
                          />
                        </label>

                        <label className="text-sm font-semibold">
                          City
                          <Input
                            className="mt-2"
                            placeholder="City"
                            value={address.city}
                            onChange={(event) =>
                              handleAddressChange(
                                index,
                                "city",
                                event.target.value,
                              )
                            }
                          />
                        </label>

                        <label className="text-sm font-semibold">
                          Street
                          <Input
                            className="mt-2"
                            placeholder="Street address"
                            value={address.street}
                            onChange={(event) =>
                              handleAddressChange(
                                index,
                                "street",
                                event.target.value,
                              )
                            }
                          />
                        </label>

                        <label className="text-sm font-semibold">
                          Zip code
                          <Input
                            className="mt-2"
                            placeholder="Zip code"
                            value={address.zipCode}
                            onChange={(event) =>
                              handleAddressChange(
                                index,
                                "zipCode",
                                event.target.value,
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={updateMutation.isPending}
              >
                Save changes
              </Button>
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
              <LockKeyhole size={20} />
            </div>

            <h2 className="mt-4 text-lg font-black">Password</h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Update your account password whenever necessary.
            </p>

            <Button
              variant="outline"
              className="mt-5 w-full"
              onClick={() => setChangePasswordOpen(true)}
            >
              Change password
            </Button>
          </aside>
        </div>
      </Suspense>

      <ChangePasswordModal
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
    </>
  );
}
