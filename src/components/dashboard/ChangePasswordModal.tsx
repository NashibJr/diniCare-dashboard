import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import actions from "../../api/actions/actions";
import Utils from "../../utils";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PasswordForm {
  newPassword: string;
  confirmPassword: string;
}

const initialForm: PasswordForm = {
  newPassword: "",
  confirmPassword: "",
};

export default function ChangePasswordModal({
  open,
  onOpenChange,
}: ChangePasswordModalProps) {
  const [formValues, setFormValues] = useState<PasswordForm>(initialForm);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleFormChange = (field: keyof PasswordForm, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClose = () => {
    setFormValues(initialForm);
    onOpenChange(false);
  };

  const updateMutation = useMutation({
    mutationKey: ["update-account"],
    mutationFn: async (data: unknown) => await actions.updateAcc(data),
  });
  const handleSubmit = async () => {
    if (!formValues.newPassword || !formValues.confirmPassword) {
      console.log("All password fields are required");

      return;
    }

    if (formValues.newPassword !== formValues.confirmPassword) {
      Utils.notify("Passwords do not match");

      return;
    }

    try {
      const { error, message } = await updateMutation.mutateAsync({
        password: formValues.newPassword,
      });
      Utils.notify(error, message, () => onOpenChange(false));
    } catch (error) {
      Utils.notify("Something went wrong, please try again");
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          handleClose();
          return;
        }

        onOpenChange(value);
      }}
      title="Change password"
    >
      <div className="grid gap-4">
        <label className="text-sm font-semibold">
          New password
          <div className="relative mt-2">
            <Input
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={formValues.newPassword}
              onChange={(event) =>
                handleFormChange("newPassword", event.target.value)
              }
              className="pr-10"
            />

            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        <label className="text-sm font-semibold">
          Confirm new password
          <div className="relative mt-2">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={formValues.confirmPassword}
              onChange={(event) =>
                handleFormChange("confirmPassword", event.target.value)
              }
              className="pr-10"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        <div className="mt-2 flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
            Change password
          </Button>
        </div>
      </div>
    </Modal>
  );
}
