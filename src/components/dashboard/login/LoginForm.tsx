import React, { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import Input from "../../common/Input";
import Btn from "../../common/Btn";
import { useMutation } from "@tanstack/react-query";
import actions from "../../../api/actions/actions";
import { toast } from "sonner";
import Utils from "../../../utils";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async () =>
      await actions.login({ email: values.email, password: values.password }),
  });
  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        const { data, message, token, error } =
          await loginMutation.mutateAsync();
        Utils.notify(error, message, () => {
          if (data?.accType === "customer") {
            Utils.notify("You dont have permissions to access this resource");

            return;
          }

          localStorage.setItem("session", JSON.stringify({ data }));
          localStorage.setItem("token", token!);
          navigate("/", { replace: true });
        });
      } catch (error) {
        toast.error("Something went wrong, please try again");
      }
    },
    [loginMutation],
  );

  return (
    <div className="w-full max-w-110">
      <div className="lg:hidden">
        <h1 className="text-2xl font-bold text-[#ff1f8f]">DigniCare </h1>

        <p className="mt-1 text-xs tracking-[0.3em] text-[#667085]">
          ADMIN CONSOLE
        </p>
      </div>

      <div className="mt-10 lg:mt-0">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#fff0f7]">
          <LockKeyhole size={21} className="text-[#ff1f8f]" />
        </div>

        <h2 className="mt-6 text-2xl font-bold text-[#101828] sm:text-3xl">
          Welcome back
        </h2>

        <p className="mt-2 text-sm text-[#667085]">
          Enter your details to access your admin dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input
          label="Email address"
          type="email"
          required
          placeholder="admin@DigniCare .com"
          value={values.email}
          onChange={(event) =>
            setValues((previous) => ({
              ...previous,
              email: event.target.value,
            }))
          }
          className="mt-1 w-full rounded-lg border border-[#D0D5DD] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#ff1f8f]"
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Enter your password"
            value={values.password}
            onChange={(event) =>
              setValues((previous) => ({
                ...previous,
                password: event.target.value,
              }))
            }
            className="mt-1 w-full rounded-lg border border-[#D0D5DD] bg-white px-3 py-2 pr-12 text-sm outline-none transition focus:border-[#ff1f8f]"
          />

          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            className="absolute right-3 top-8 flex h-8 w-8 cursor-pointer items-center justify-center text-[#667085] hover:text-[#ff1f8f]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Btn
          type="submit"
          label="Sign in"
          isLoading={loginMutation.isPending}
          disabled={
            !values.email || !values.password || loginMutation.isPending
          }
          className="flex h-10 w-full cursor-pointer items-center justify-center rounded-lg bg-[#ff1f8f] text-sm font-semibold text-white transition hover:bg-[#e7197e]"
        />
      </form>

      <div className="mt-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#EAECF0]" />

        <p className="text-xs text-[#98A2B3]">SECURE ADMIN ACCESS</p>

        <div className="h-px flex-1 bg-[#EAECF0]" />
      </div>

      <div className="mt-6 rounded-lg bg-[#F9FAFB] p-4 text-center">
        <p className="text-xs leading-5 text-[#667085]">
          Access to DigniCare Admin Console is restricted to authorized
          administrators.
        </p>
      </div>

      <p className="mt-8 text-center text-xs text-[#98A2B3] lg:hidden">
        © 2026 DigniCare . All rights reserved.
      </p>
    </div>
  );
};

export default LoginForm;
